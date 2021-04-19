import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  IOrderPaymentConfirm,
  IPaymentGateway,
  order, PaymentTypeChoices,
} from '@nusantara/models';
import {
  OrderPaymentConfirmService,
  PaymentGatewayService,
} from '@nusantara/services';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'nus-order-confirm',
  template: `
    <div class="payment-confirm--actions">
      <button (click)="openModal()" class="control" [disabled]="!canDoCRUD()">Create New</button>
    </div>

    <div class="payment-confirm--list">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Sender Name</th>
            <th>Amount Transfer</th>
            <th>Payment To</th>
            <th>Receipt File</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngIf="paymentConfirms?.length == 0">
            <td rowspan="6"><i>Belum ada Payment Konfirmasi</i></td>
          </tr>

          <tr *ngFor="let paymentConfirm of paymentConfirms">
            <td>
              {{ paymentConfirm.orderDate | date: "dd/MM/yyyy HH:mm:ss" }}
            </td>
            <td>{{ paymentConfirm.shippingName }}</td>
            <td>{{ paymentConfirm.transferAmount }}</td>
            <td>{{ paymentConfirm.paymentGateway.accountHoldNumber }}</td>
            <td>
              <a href="{{ paymentConfirm.proofImage }}" target="_blank">
                Klik Disini
              </a>
            </td>
            <td class="button-action">
              <button
                type="button"
                class="control"
                (click)="openModal(paymentConfirm)"
                [disabled]="!canDoCRUD()"
              >
                Edit</button
              >&nbsp;
              <button
                type="button"
                class="control ghost"
                (click)="onDelete(paymentConfirm)"
                [disabled]="!canDoCRUD()"
              >
                Delete
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
    `
      .payment-confirm--actions {
        margin-top: 1.5rem;
      }
      .payment-confirm--actions a {
      }
      .payment-confirm--list {
        margin-top: 1rem;
      }
    `,
    'td.button-action { display: flex; }',
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
    public ngxSmartModalService: NgxSmartModalService
  ) {}

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
