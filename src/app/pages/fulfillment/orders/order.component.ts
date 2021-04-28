import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractDetailComponent, ErrorResult, getSlugFromHref, ToastService } from '@nusantara/core';
import { 
  UserService,
  ShipmentService,
  OrderService,
  OrderReportService,
  OrderDownloadFileService
} from '@nusantara/services';
import { drf, order } from '@nusantara/models';
import { PaymentConfirmModalComponent } from './modals';
@Component({
  selector: 'nus-order',
  template: `  
    <h1 class="title-1">Order Detail</h1>
    <table class="detail">
      <tbody>
        <tr class="no-border-bottom">
          <td>
            <div class="body-2">Order Number</div>
            <div class="subheading-2">{{ orderDetailData.orderNumber }}</div>
          </td>
          <td>
            <div class="body-2">Time of Order</div>
            <div class="subheading-2">
              {{ orderDetailData.created | date: 'dd/MM/yyyy HH:mm:ss' }}
            </div>
          </td>
          <td>
            <div class="body-2">Platform</div>
            <div class="subheading-2">{{ (orderDetailData.source? orderDetailData.source : '-') | uppercase }}</div>
          </td>
          <td></td>
        </tr>
        <tr *ngIf="isDetailShowed" class="no-border-bottom more-detail">
          <td>
            <div class="body-2">Customer Name</div>
            <div class="subheading-2">{{ orderDetailData.customer.name }}</div>
          </td>
          <td>
            <div class="body-2">Phone Number</div>
            <div class="subheading-2">{{ orderDetailData.orderAddress.phoneNumber }}</div>
          </td>
          <td>
            <div class="body-2">Email</div>
            <div class="subheading-2">{{ orderDetailData.customer.name }}</div>
          </td>
          <td>
            <div class="body-2">Address</div>
            <div class="subheading-2"> {{ getOrderAddress() }} </div>
          </td>
        </tr>
        <tr class="more-toggle">
          <td colspan="4">
            <a (click)="isDetailShowed = !isDetailShowed;">{{ isDetailShowed? 'Hide' : 'More' }}</a>
          </td>
        </tr>
        <tr>
          <ng-container *ngIf="canUpdateOrder">
            <td>
              <div>
                <div class="body-2">Status</div>
                <div class="subheading-2">{{ orderStatusDisplayName }}</div>
              </div>
            </td>
            <td>
              <button *ngIf="this.orderDetailData.status === 'unpaid'" 
                type="button" 
                class="control confirm-payment" disabled>
                  Confirm Payment
              </button>
              <button *ngIf="this.orderDetailData.status === 'waiting'" 
                type="button" 
                class="control confirm-payment" 
                (click)="paymentConfirm.open()">
                  Confirm Payment
              </button>
            </td>
            <td colspan="3">
              <button class="download-button control secondary" (click)="downloadProductList()">Download Product List</button>
            </td>
          </ng-container>
          <ng-container *ngIf="!canUpdateOrder">
            <td colspan="5">
              <button class="download-button control secondary" (click)="downloadProductList()">Download Product List</button>
            </td>
          </ng-container>
        </tr>
      </tbody>
    </table>

    <nus-tabs *ngIf="isManualTransfer(orderDetailData); else noManualTransfer">
      <nus-tab title="Order Detail">
        <nus-order-detail></nus-order-detail>
      </nus-tab>
      <nus-tab title="Order Confirmation">
        <nus-order-confirm [order]="orderDetailData"></nus-order-confirm>      
      </nus-tab>
    </nus-tabs>

    <ng-template #noManualTransfer>
      <nus-order-detail></nus-order-detail>
    </ng-template>

    <button type="button" (click)="navigateToParent(true)" class="control secondary">Back</button>

    <!-- Modal -->
    <nus-payment-confirm-modal></nus-payment-confirm-modal>
    `,
  styles: [
    'table { margin-bottom: 24px; }',
    'h3 { color: var(--lighten-black); margin-bottom: 0; }',
    '.detail td { padding: 20px 24px; vertical-align: top; width: 25%; }',
    '.detail tr.no-border-bottom td { border-bottom: none; }',
    '.detail tr.more-detail td { padding-top: 3px; }',
    '.detail tr.more-toggle td { padding: 0 24px 18px; }',
    '.confirm-payment { min-width: 160px }',
    '.subheading-2 { color: var(--lighten-black); margin-bottom: 2px; }',
    '.download-button { min-width: 200px; display: block; margin-left: auto; }',
  ]
})
export class OrderComponent extends AbstractDetailComponent<order.IOrderDetail> implements OnInit {
  @ViewChild(PaymentConfirmModalComponent) paymentConfirm: PaymentConfirmModalComponent;

  orderDetailData: order.IOrderDetail;
  currentTab: 'orderDetail' | 'paymentConfirm' = 'orderDetail';
  orderStatusChoices: Array<drf.IChoice>;
  entity: order.IOrderDetail;
  isDetailShowed = false;

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

      console.log(this.orderDetailData.status);
    });
    this.fetchAwbUrl();
  }

  initializeForm(entity?: order.IOrderDetail) {
    this.form = this.fb.group({
      status: [entity?.status ?? 'unpaid', []],
    });
    this.entity = entity;
  }

  get status(): FormControl { return this.form.get('status') as FormControl; }

  get currentMilestone(){
    let status = this.orderDetailData.status === 'shipped'? 'ship': this.orderDetailData.status;
    return status;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.service.updateByOrderNumber(this.entity.orderNumber, this.form.value).subscribe(() => {
        alert('success update order');
        this.router.navigate([]);
      }, error => this._handleError(error));
    }
  }

  _handleError(error: any) {
    if (error.status === 400) {
      this.setErrorsMessage(error.error);
    }
  }

  setErrorsMessage(error: any) {
    Object.keys(error).forEach((fieldName: any) => {
      if (this.form.controls[fieldName]) {
        this.form.controls[fieldName].setErrors({server: error[fieldName]});
      }
    });
  }

  fetchAwbUrl(selectedOrderDetail?: any) {
    if (!selectedOrderDetail) {
      this.orderDetailData.children.forEach((children) => {
        children.data.forEach((childrenData) => {
          if (childrenData.shipmentHistory?.href) {
            this.shipmentService.fetch(getSlugFromHref(childrenData.shipmentHistory?.href)).subscribe((entity) => {
              childrenData.shipmentHistory.shippingLabelUrl = entity.shippingLabelUrl;
            });
          }

        });
      });
    } else {
      this.shipmentService.fetch(getSlugFromHref(selectedOrderDetail.shipmentHistory.href)).subscribe((entity) => {
        selectedOrderDetail.shipmentHistory.shippingLabelUrl = entity.shippingLabelUrl;
      });
    }
  }

  printConnote(labelUrl: string) {
    let windowContent = '<!DOCTYPE html>';
    windowContent += '<html>';
    windowContent += '<head><title>Print</title></head>';
    windowContent += '<body>';
    windowContent += '<img src="' + labelUrl + '">';
    windowContent += '</body>';
    windowContent += '</html>';

    const printWin = window.open('', '', 'width=' + screen.availWidth + ',height=' + screen.availHeight);
    printWin.document.open();
    printWin.document.write(windowContent);

    printWin.document.addEventListener('load', () => {
      printWin.focus();
      printWin.print();
      printWin.document.close();
      printWin.close();
    }, true);
  }

  getOrderAddress(): string {
    if (!this.orderDetailData || !this.orderDetailData.orderAddress) {
      return '';
    }
    return `${this.orderDetailData.orderAddress.shipToName} ` +
      `${this.orderDetailData.orderAddress.street} ` +
      `${this.orderDetailData.orderAddress.city} ` +
      `${this.orderDetailData.orderAddress.state} ` +
      `${this.orderDetailData.orderAddress.zipcode}`;
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

  downloadProductList(){
    this.orderReportService.downloadProductDetail(this.orderDetailData.orderNumber).subscribe((response: string) => {
      this.orderDonwloadService.downloadAsCsv(response, 'product-list');
    });
  }
}

