import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { DialogResult, ToastLevelEnum, ToastService } from '@nusantara/core';
import { IPaymentGateway, order, PaymentTypeChoices } from '@nusantara/models';
import {
  OrderPaymentConfirmService,
  PaymentGatewayService,
  SvgIconService,
} from '@nusantara/services';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DeleteConfirmDialogComponent } from './modals';

@Component({
  selector: 'nus-order-confirm',
  template: `
    <div class="wrapper">
      <button (click)="openModal()" class="control add-payment-confirm" [disabled]="!canUpdateConfirmData()" i18n>
        <i class="material-icons">add</i>Add
      </button>
      <table>
        <thead>
          <tr>
            <th i18n>Sender Name</th>
            <th class="numeric" i18n>Date</th>
            <th class="numeric" i18n>Transfer Amount</th>
            <th i18n>Payment To</th>
            <th i18n>Receipt File</th>
            <th i18n>Action</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngIf="paymentConfirms?.length === 0">
            <td colspan="7" class="empty-table">
              <div class="heading-1" i18n>No Payment Confirmation Yet</div>
              <div class="body-2" i18n>Payment confirmation information will appear here once the customer confirm the order.</div>
            </td>
          </tr>

          <tr *ngFor="let paymentConfirm of paymentConfirms">
            <td>{{ paymentConfirm.shippingName }}</td>
            <td class="numeric">
              {{ paymentConfirm.orderDate | date: "dd/MM/yyyy HH:mm:ss" }}
            </td>
            <td class="numeric">{{ paymentConfirm.transferAmount | currency: "IDR" }}</td>
            <td>{{ paymentConfirm.paymentGateway.accountHoldNumber }}</td>
            <td>
              <a href="{{ paymentConfirm.proofImage }}" target="_blank" i18n>
                Click Here
              </a>
            </td>
            <td>
              <a
                (click)="openModal(paymentConfirm)"
                [ngClass]="{'disabled': !canUpdateConfirmData()}" i18n>
                Edit
              </a>
            </td>
            <td>
              <button *ngIf="canUpdateConfirmData(); else disableDelete"
                type="button"
                class="delete-button"
                (click)="deleteConfirmModal.open(paymentConfirm)">
                <mat-icon svgIcon="trash"></mat-icon>
              </button>
              <ng-template #disableDelete>
                <button
                  type="button"
                  class="delete-button"
                  disabled>
                    <mat-icon svgIcon="trash-disabled"></mat-icon>
                </button>
              </ng-template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Dialog to used for create / update payment confirm -->
    <nus-payment-confirm-form-modal
      (action)="onSubmit($event)"
      [order]="order"
      [paymentConfirm]="currentPaymentConfirm"
      [paymentGateways]="paymentGateways"
    >
    </nus-payment-confirm-form-modal>
    <nus-delete-confirm-dialog></nus-delete-confirm-dialog>
  `,
  styles: [
    '.wrapper { margin: 16px 0; }',
    `.add-payment-confirm {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: auto;
        margin-bottom: 16px;
      }
    `,
    '.empty-table { padding: 20px; text-align:center }',
    '.heading-1 { font-weight: 700 }',
    '.add-payment-confirm > i { line-height: 31px; font-size: 20px; }',
    '.delete-button { background: none; border: none; }'
  ],
})
export class OrderPaymentConfirmComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() order: order.IOrderDetail;
  @Output() updatePaymentConfirm = new EventEmitter();

  @ViewChild(DeleteConfirmDialogComponent) deleteConfirmModal: DeleteConfirmDialogComponent;
  private unsubscribe$ = new Subject<void>();

  paymentConfirms: order.IOrderPaymentConfirm[] = [];
  paymentGateways: IPaymentGateway[];

  currentPaymentConfirm?: order.IOrderPaymentConfirm;

  constructor(
    private service: OrderPaymentConfirmService,
    private paymentGatewayService: PaymentGatewayService,
    public ngxSmartModalService: NgxSmartModalService,
    private toast: ToastService,
    svgIconService: SvgIconService,
  ) {
    svgIconService.registerIcons();
  }

  ngOnInit(): void {
    this.service.baseUrl = `/api/order/order/${this.order.orderNumber}/payment-confirm`;

    this.service
      .fetchAllWithPaymentGateway()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((paymentConfirms) => {
        this.paymentConfirms = paymentConfirms;
      });
    this.paymentGatewayService
      .fetchAllByType(PaymentTypeChoices.MANUAL_TRANSFER)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((paymentGateways) => {
        this.paymentGateways = paymentGateways;
      });
  }

  ngAfterViewInit() {
    this.deleteConfirmModal.onClose.subscribe(() => this.ondeleteConfirmModalClosed());
  }

  openModal(paymentConfirm?: order.IOrderPaymentConfirm): void {
    this.currentPaymentConfirm = paymentConfirm;
    this.ngxSmartModalService.getModal('myModal').open();
  }

  onSubmit(event: any): void {
    this.reFetch();
    this.updatePaymentConfirm.emit();
  }

  ondeleteConfirmModalClosed() {
    if (this.deleteConfirmModal.result === DialogResult.OK) {
      this.service.delete(this.deleteConfirmModal.orderPaymentConfirm).subscribe(
        () => {
          this.toast?.addMessage(
            'Payment confirmation information has been deleted.',
            'Payment Confirmation Deleted!',
            ToastLevelEnum.success
          );
          this.reFetch();
          this.updatePaymentConfirm.emit();
        },
        () => this.handleError()
      );
    }
  }

  reFetch(): void {
    this.paymentConfirms = [];
    this.service
      .fetchAllWithPaymentGateway()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((paymentConfirms) => {
        this.paymentConfirms = paymentConfirms;
      });
  }

  handleError(): void {
    this.toast?.addMessage(
      'Unable to delete payment confirmation. Please try again.',
      'Failed to Delete Payment Confirmation',
      ToastLevelEnum.error
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  canUpdateConfirmData(): boolean {
    const statusChoices = ['cancelled', 'unpaid', 'waiting'];
    return statusChoices.includes(this.order.status);
  }
}
