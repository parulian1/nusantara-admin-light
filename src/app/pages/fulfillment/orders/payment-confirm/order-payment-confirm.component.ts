import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  IOrderPaymentConfirm,
  IPaymentGateway,
  order, PaymentTypeChoices,
} from '@nusantara/models';
import {
  OrderPaymentConfirmService,
  PaymentGatewayService,
  SvgIconService,
} from '@nusantara/services';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'nus-order-confirm',
  template: `
    <div class="wrapper">
      <button (click)="openModal()" class="control add-payment-confirm" [disabled]="!canDoCRUD()">
        <i class="material-icons">add</i>Add
      </button>
      <table>
        <thead>
          <tr>
            <th>Sender Name</th>
            <th class="numeric">Date</th>
            <th class="numeric">Transfer Amount</th>
            <th>Payment To</th>
            <th>Receipt File</th>
            <th>Action</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngIf="paymentConfirms?.length == 0">
            <td rowspan="6"><i>Belum ada Payment Konfirmasi</i></td>
          </tr>

          <tr *ngFor="let paymentConfirm of paymentConfirms">
            <td>{{ paymentConfirm.shippingName }}</td>
            <td class="numeric">
              {{ paymentConfirm.orderDate | date: "dd/MM/yyyy HH:mm:ss" }}
            </td>
            <td class="numeric">{{ paymentConfirm.transferAmount | currency: "IDR" }}</td>
            <td>{{ paymentConfirm.paymentGateway.accountHoldNumber }}</td>
            <td>
              <a href="{{ paymentConfirm.proofImage }}" target="_blank">
                Click Here
              </a>
            </td>
            <td>
              <a
                (click)="openModal(paymentConfirm)"
                [ngClass]="{'disabled': !canDoCRUD()}">
                Edit
              </a>
            </td>
            <td>
              <button
                type="button"
                class="delete-button"
                (click)="onDelete(paymentConfirm)"
                [disabled]="!canDoCRUD()">
                <mat-icon svgIcon="trash"></mat-icon>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Dialog to used for create / update payment confirm -->
    <nus-order-payment-confirm-dialog
      (action)="onSubmit($event)"
      [order]="order"
      [paymentConfirm]="currentPaymentConfirm"
      [paymentGateways]="paymentGateways"
    >
    </nus-order-payment-confirm-dialog>
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
    '.add-payment-confirm > i { line-height: 31px; font-size: 20px; }',
    '.delete-button { background: none; border: none; }'
  ],
})
export class OrderPaymentConfirmComponent implements OnInit, OnDestroy {
  @Input() order: order.IOrderDetail;

  private unsubscribe$ = new Subject<void>();

  paymentConfirms: order.IOrderPaymentConfirm[] = [];
  paymentGateways: IPaymentGateway[];

  currentPaymentConfirm?: order.IOrderPaymentConfirm;

  constructor(
    private service: OrderPaymentConfirmService,
    private paymentGatewayService: PaymentGatewayService,
    public ngxSmartModalService: NgxSmartModalService,
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

  openModal(paymentConfirm?: order.IOrderPaymentConfirm): void {
    this.currentPaymentConfirm = paymentConfirm;
    this.ngxSmartModalService.getModal('myModal').open();
  }

  onSubmit(event: any): void {
    this.reFetch();
  }

  onDelete(orderPaymentConfirm: IOrderPaymentConfirm) {
    this.service.delete(orderPaymentConfirm).subscribe(
      () => {
        alert('success delete payment confirm');
        this.reFetch();
      },
      (error) => this.handleError(`error to delete a payment confirm`)
    );
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

  handleError(error: any): void {
    if (typeof error === 'string') {
      alert(error);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  canDoCRUD(): boolean {
    const statusChoices = ['cancelled', 'unpaid', 'waiting'];
    return statusChoices.includes(this.order.status);
  }
}
