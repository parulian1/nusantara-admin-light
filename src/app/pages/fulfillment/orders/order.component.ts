import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractDetailComponent, DialogResult, ToastLevelEnum, ToastService } from '@nusantara/core';
import {
  UserService,
  ShipmentService,
  OrderService,
  OrderReportService,
  OrderDownloadFileService,
} from '@nusantara/services';
import { drf, order } from '@nusantara/models';
import { FormBuilder } from '@angular/forms';
import {
  CancelOrderDialogComponent,
  PaymentConfirmModalComponent,
  MarkAsTestingDialogComponent
} from './modals';
@Component({
  selector: 'nus-order',
  template: `
    <h1 class="title-1" i18n>Order Detail</h1>
    <table class="detail">
      <tbody>
        <tr class="no-border-bottom">
          <td>
            <div class="body-2" i18n>Order Number</div>
            <div class="subheading-2">{{ orderDetailData.orderNumber }}</div>
          </td>
          <td>
            <div class="body-2" i18n>Time of Order</div>
            <div class="subheading-2">
              {{ orderDetailData.created | date: 'dd/MM/yyyy HH:mm:ss' }}
            </div>
          </td>
          <td>
            <div class="body-2" i18n>Platform</div>
            <div class="subheading-2">{{ platform }}</div>
          </td>
          <td class="wide-column" *ngIf="orderDetailData?.meta?.shopifyInfo">
            <div class="body-2" i18n>Order Notes (Shopify)</div>
            <div class="subheading-2">
                <div>{{ orderDetailData.meta.shopifyInfo.note? orderDetailData.meta.shopifyInfo.note: '-' }}</div>
            </div>
          </td>
        </tr>
        <tr *ngIf="isDetailShowed" class="no-border-bottom more-detail">
          <td>
            <div class="body-2" i18n>Customer Name</div>
            <div class="subheading-2">
              {{ orderDetailData.customer.name? orderDetailData.customer.name : '-' }}
            </div>
          </td>
          <td>
            <div class="body-2" i18n>Phone Number</div>
            <div class="subheading-2">
              {{ orderDetailData.orderAddress.phoneNumber? orderDetailData.orderAddress.phoneNumber : '-' }}
            </div>
          </td>
          <td>
            <div class="body-2" i18n>Email</div>
            <div class="subheading-2">
              {{ orderDetailData.customer.email? orderDetailData.customer.email : '-' }}
            </div>
          </td>
          <td class="wide-column">
            <div class="body-2" i18n>Address</div>
            <div class="subheading-2">
              <ng-container *ngIf="this.orderDetailData && this.orderDetailData.orderAddress; else noAddress">
                <div>{{ orderDetailData.orderAddress.shipToName }}</div>
                <div style="word-wrap:break-word">{{ orderDetailData.orderAddress.street +' '+ orderDetailData.orderAddress.city }}</div>
                <div>{{ orderDetailData.orderAddress.state +' - '+ orderDetailData.orderAddress.zipcode }}</div>
              </ng-container>
              <ng-template #noAddress>-</ng-template>
            </div>
          </td>
        </tr>
        <tr *ngIf="isDetailShowed && orderDetailData?.meta?.billingAddress" class="no-border-bottom more-detail">
          <td>
              <div class="body-2" i18n>Billing Address</div>
              <div class="subheading-2">
                  <div><address [innerHTML]="billingAddress"></address></div>
              </div>
              <ng-template #noBillingAddress>-</ng-template>
          </td>
        </tr>
        <tr class="more-toggle">
          <td colspan="5">
            <a (click)="isDetailShowed = !isDetailShowed;">{{ isDetailShowed? 'Hide' : 'More' }}</a>
          </td>
        </tr>
        <tr>
          <td>
            <div>
              <div class="body-2" i18n>Status</div>
              <div class="subheading-2">{{ orderStatusDisplayName }}</div>
            </div>
          </td>
          <td>
            <div>
              <div class="body-2">Reason</div>
              <div class="subheading-2">{{ markAsTestReason }}</div>
            </div>
          </td>
          <ng-container *ngIf="canUpdateOrder">
            <td>
              <button *ngIf="this.orderDetailData.status === 'unpaid'"
                type="button"
                class="control confirm-payment" disabled i18n>
                  Confirm Payment
              </button>
              <button *ngIf="this.orderDetailData.status === 'waiting'"
                type="button"
                class="control confirm-payment"
                (click)="paymentConfirmModal.open()" i18n>
                  Confirm Payment
              </button>
            </td>
          </ng-container>
          <td colspan="3" class="other-action">
              <button class="download-button control secondary"
                  *ngIf="this.orderDetailData.source !== 'marketplace'"
                  (click)="markAsTestingModal.open()"
                  [disabled]="orderDetailData.isTesting"
                  style="margin-right: 10px;" i18n>
                  Mark As Test
              </button>
              <button class="download-button control secondary" (click)="downloadProductList()" i18n>Download Product List</button>
          </td>
        </tr>
      </tbody>
    </table>

    <nus-tabs *ngIf="isManualTransfer(orderDetailData); else noManualTransfer">
      <nus-tab title="Order Detail">
        <nus-order-detail
          (enableCancelOrder)="onEnableCancelOrder($event)"
          (updateOrderStatus)="onUpdateOrderStatus()">
        </nus-order-detail>
      </nus-tab>
      <nus-tab title="Order Confirmation">
        <nus-order-confirm
          [order]="orderDetailData"
          (updatePaymentConfirm)="onUpdateOrderStatus()"></nus-order-confirm>
      </nus-tab>
    </nus-tabs>

    <ng-template #noManualTransfer>
      <nus-order-detail
        (enableCancelOrder)="onEnableCancelOrder($event)"
        (updateOrderStatus)="onUpdateOrderStatus()">
      </nus-order-detail>
    </ng-template>

    <div class="action-button">
      <button type="button" (click)="navigateToParent(true)" class="control secondary" i18n>Back</button>
      <button
        *ngIf="canCancelOrder"
        type="button"
        class="control danger ghost"
        (click)="cancelOrderModal.open()" i18n>
          Cancel Order
        </button>
    </div>

    <!-- Modal -->
    <nus-payment-confirm-modal></nus-payment-confirm-modal>
    <nus-cancel-order-dialog></nus-cancel-order-dialog>
    <nus-mark-as-testing-modal></nus-mark-as-testing-modal>
    `,
  styles: [
    'table { margin-bottom: 24px; width: 100%; table-layout: fixed; }',
    '.detail td { width: 20%; }',
    `.detail td:not(:last-child) div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap; }`,
    '.detail td.wide-column { width: 40% }',
    '.detail td { padding: 20px 24px; vertical-align: top; }',
    '.detail tr.no-border-bottom td { border-bottom: none; }',
    '.detail tr.more-detail td { padding-top: 3px; }',
    '.detail tr.more-toggle td { padding: 0 24px 18px; }',
    'h3 { color: var(--lighten-black); margin-bottom: 0; }',
    '.confirm-payment { min-width: 160px }',
    '.subheading-2 { color: var(--lighten-black); margin-bottom: 2px; }',
    '.download-button { min-width: 200px; margin-left: auto; }',
    '.action-button { display: flex; justify-content: space-between; }',
    'address { font-style: normal; }',
    '.other-action { text-align: right; }'
  ]
})
export class OrderComponent extends AbstractDetailComponent<order.IOrderDetail> implements OnInit {
  @ViewChild(PaymentConfirmModalComponent) paymentConfirmModal: PaymentConfirmModalComponent;
  @ViewChild(CancelOrderDialogComponent) cancelOrderModal: CancelOrderDialogComponent;
  @ViewChild(MarkAsTestingDialogComponent) markAsTestingModal: MarkAsTestingDialogComponent;

  orderDetailData: order.IOrderDetail;
  shipmentMessageInfo: Array<order.IOrderShipmentInfo> = [];
  currentTab: 'orderDetail' | 'paymentConfirm' = 'orderDetail';
  orderStatusChoices: Array<drf.IChoice>;
  entity: order.IOrderDetail;
  isRequestShipment = false;
  isShippableOrder = true;
  isDetailShowed = false;
  canCancelOrder = false;
  canConfirmPayment = false;

  billingAddress = '';
  shippingAddress = '';

  constructor(public service: OrderService,
              public route: ActivatedRoute,
              public router: Router,
              public toast: ToastService,
              public userService: UserService,
              public shipmentService: ShipmentService,
              private fb: FormBuilder,
              private orderReportService: OrderReportService,
              private orderDonwloadService: OrderDownloadFileService) {
    super(route, router, toast, service);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((
      data: { entity: order.IOrderDetail, orderStatus: Array<drf.IChoice> }) => {
          this.orderDetailData = data.entity;
          this.orderStatusChoices = data.orderStatus;
          this.isShippableOrder = !!this.orderDetailData.orderAddress;
          if (!!this.orderDetailData.meta?.billingAddress) {
            this.billingAddress = this.formatAddress(this.orderDetailData.meta.billingAddress);
          }
          if (!!this.isShippableOrder) {
              this.shippingAddress = this.formatAddress(this.orderDetailData.orderAddress);
            }
      });

      // set initial value for canCancelOrder using this criteria
      if(this.isCancelOrderSupported){
        this.canCancelOrder = true;
      }

      // can confirm payment for manual transfer if status waiting
      this.canConfirmPayment = this.orderDetailData.status === 'waiting';
  }

  ngAfterViewInit() {
    this.paymentConfirmModal.onClose.subscribe(() => this.onPaymentConfirmModalClosed());
    this.cancelOrderModal.onClose.subscribe(() => this.oncancelOrderModalClosed());
    this.markAsTestingModal.onClose.subscribe(() => this.onMarkAsTestingModalClosed());
  }

  onPaymentConfirmModalClosed() {
    if (this.paymentConfirmModal.result === DialogResult.OK) {
      this.service.updateByOrderNumber(this.entity.orderNumber, {status: 'paid'}).subscribe(() => {
        this.toast?.addMessage(
          'You can now process the order.',
          'Payment Confirmed!',
          ToastLevelEnum.success
        );
        this.router.navigate([]);
      }, error => {
        this.toast?.addMessage(
          'Unable to confirm payment. Please try again.',
          'Failed to Confirm Payment',
          ToastLevelEnum.error
        );
        console.log(error)
      });
    }
  }

  oncancelOrderModalClosed(){
    if (this.cancelOrderModal.result === DialogResult.OK) {
      this.service.updateByOrderNumber(this.orderDetailData.orderNumber, {status: 'cancelled'}).subscribe(() => {
        this.toast?.addMessage(
          `Order ${this.orderDetailData.orderNumber} has just been cancelled.`,
          'Order Cancelled!',
          ToastLevelEnum.success
        );
        this.router.navigate([]);
      }, error => {
        this.toast?.addMessage(
          'Unable to cancel order. Please try again.',
          'Failed to Cancel Order',
          ToastLevelEnum.error
        );
        console.log(error)
      });
    }
  }

  onMarkAsTestingModalClosed(){
    if (this.markAsTestingModal.result === DialogResult.OK) {
      this.service.updateByOrderNumber(this.orderDetailData.orderNumber, {
        reason: this.markAsTestingModal.reason.value,
        isTesting: true
      }).subscribe(() => {
        this.toast?.addMessage(
          `Order ${this.orderDetailData.orderNumber} has just been marked as test.`,
          'Order marked as test!',
          ToastLevelEnum.success
        );
        this.router.navigate([]);
      }, error => {
        this.toast?.addMessage(
          'Unable to mark order as test. Please try again.',
          'Failed to mark order as test',
          ToastLevelEnum.error
        );
        console.log(error)
      });
    }
  }

  initializeForm(entity?: order.IOrderDetail) {
    this.entity = entity;
  }

  /**
   * Check manual transfer or not
   */
  isManualTransfer(orderData: order.IOrderDetail): boolean {
    return orderData?.orderPayment?.paymentGateway.type === 'manual_transfer';
  }

  /**
  * return display name from order status
  */
  get orderStatusDisplayName(): string {
    return this.orderStatusChoices.find((status) => status.value === this.orderDetailData.status ).displayName;
  }

  /**
   * check current order status can update or not
   */
  get canUpdateOrder(): boolean {
    const statusCanUpdate = ['unpaid', 'waiting', 'paid', 'cancelled'];
    return (
      this.isManualTransfer(this.orderDetailData) &&
      statusCanUpdate.includes(this.orderDetailData.status)
    );
  }


  formatAddress(orderAddress): string {
    return `${orderAddress.shipToName} <br>` +
      `${orderAddress.street} <br>` +
      `${orderAddress.city} <br>` +
      `${orderAddress.state} <br>` +
      `${orderAddress.zipcode} <br>` +
      `${orderAddress.country} <br>` +
      `${orderAddress.phoneNumber}`;
  }

  downloadProductList(){
    this.orderReportService.downloadProductDetail(this.orderDetailData.orderNumber).subscribe((response: string) => {
      this.orderDonwloadService.downloadAsCsv(response, 'product-list');
    });
  }

  onEnableCancelOrder(isAble: boolean){
    this.canCancelOrder = isAble;
  }

  onUpdateOrderStatus(){
    this.service.fetch(this.orderDetailData.orderNumber).subscribe(
      (response: any) => {
        this.orderDetailData = response;
      });
  }

  get platform(): string {
    if(this.orderDetailData.source){
      if(this.orderDetailData.sourceName === 'shopify'){
        return this.orderDetailData.sourceName.toUpperCase();
      } else {
        if(this.orderDetailData.source === 'marketplace'){
          return `${this.orderDetailData.sourceName.toUpperCase()} (${this.orderDetailData.storeName})` ;
        } else {
          return this.orderDetailData.source.toUpperCase();
        }
      }
    } else {
      return '-';
    }
  }

  get isCancelOrderSupported() {
    return (
      !(
        ["web", "pos"].includes(this.orderDetailData.source) ||
        this.orderDetailData.sourceName == "tsc"
      ) &&
      ["unpaid", "waiting", "paid", "ready"].includes(
        this.orderDetailData.status
      )
    );
  }

  get markAsTestReason(): string {
    return this.orderDetailData.meta?.reason || '-';
  }
}

