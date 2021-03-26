import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractDetailComponent, ErrorResult, getSlugFromHref, ToastService } from '@nusantara/core';
import { UserService, ShipmentService, OrderService } from '@nusantara/services';
import { drf, order, OrderStatusType } from '@nusantara/models';


@Component({
  selector: 'nus-order',
  templateUrl: './order-detail.html',
  styleUrls: ['./order-detail.scss']
})
export class OrderComponent extends AbstractDetailComponent<order.IOrderDetail> implements OnInit {

  orderDetailData: order.IOrderDetail;
  shipmentMessageInfo: Array<order.IOrderShipmentInfo> = [];
  currentTab: 'orderDetail' | 'shipping' | 'history' | 'paymentConfirm' = 'orderDetail';
  orderStatusChoices: Array<drf.IChoice>;
  entity: order.IOrderDetail;
  isRequestShipment = false;
  isShippableOrder = true;

  billingAddress = '';
  shippingAddress = '';

  constructor(public service: OrderService,
              public route: ActivatedRoute,
              public router: Router,
              public toast: ToastService,
              public userService: UserService,
              public shipmentService: ShipmentService,
              private fb: FormBuilder) {
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
    this.fetchAwbUrl();
  }

  initializeForm(entity?: order.IOrderDetail) {
    this.form = this.fb.group({
      status: [entity?.status ?? 'unpaid', []],
    });
    this.entity = entity;
  }

  get status(): FormControl { return this.form.get('status') as FormControl; }

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

  showKirim(orderDetailData: any) {
    if (orderDetailData.shipmentHistory) {
      return false;
    }
    if (this.orderDetailData.orderPayment.status !== 'paid') {
      return false;
    }
    if (this.shipmentMessageInfo.length > 0) {
      const showMessage = this.shipmentMessageInfo.filter(info => info.orderHref === orderDetailData.href)[0];
      return !showMessage?.success;
    }
    return true;
  }

  requestShipmentAndUpdateOrder(childrenData: any) {
    if (childrenData.status !== 'ready') {
      alert(`Cannot ship order that wasn't ready`);
    } else if (childrenData.status === 'shipped') {
      alert(`Order already shipped`);
    } else {
      this.isRequestShipment = true;
      let shipmentInfo = {
            orderHref: childrenData.href,
            message: 'Please wait...',
            success: true,
            connoteNumber: '',
          };
      this.shipmentMessageInfo.push(shipmentInfo);
      this.shipmentService.createAWB({
        orderNumber: getSlugFromHref(childrenData.href)
      }).subscribe((response) => {
        const foundShipmentInfoIndex = this.shipmentMessageInfo.findIndex((messageInfo) => {
          return messageInfo.orderHref === childrenData.href;
        });
        if (response instanceof ErrorResult) {
          shipmentInfo = {
            orderHref: childrenData.href,
            message: 'Please contact administrator, something went wrong...',
            success: true,
            connoteNumber: '',
          };
        } else {
          shipmentInfo = {
            orderHref: childrenData.href,
            message: response.messages[0],
            success: response.success,
            connoteNumber: response.entity.airwayBillNumber,
          };
          if (!childrenData.shipmentHistory) {
            childrenData.shipmentHistory = new Object({
              awbNumber: null,
              href: null,
              shippingLabelUrl: '',
            });
          }
          childrenData.shipmentHistory.href = response.entity.href;
          childrenData.shipmentHistory.awbNumber = response.entity.awbNumber;
          this.fetchAwbUrl(childrenData);
          this.updateOrder(childrenData, 'shipped');
        }
        if (foundShipmentInfoIndex !== -1) {
          this.shipmentMessageInfo[foundShipmentInfoIndex] = shipmentInfo;
        } else {
          this.shipmentMessageInfo.push(shipmentInfo);
        }
        this.isRequestShipment = false;
      });
    }
  }

  getShipmentMessageInfo(orderHref: string) {
    if (this.shipmentMessageInfo.length) {
      const shipMessage = this.shipmentMessageInfo.filter(info => info.orderHref === orderHref)[0];
      return shipMessage?.message ?? '';
    }
    return '';
  }

  getConnote(childrenData: any) {
    if (childrenData.shipmentHistory?.awbNumber) {
      return childrenData.shipmentHistory.awbNumber;
    }
    return '';
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
    return `${this.orderDetailData.orderAddress.shipToName} <br>` +
      `${this.orderDetailData.orderAddress.street} <br>` +
      `${this.orderDetailData.orderAddress.city} <br>` +
      `${this.orderDetailData.orderAddress.state} <br>` +
      `${this.orderDetailData.orderAddress.zipcode} <br>` +
      `${this.orderDetailData.orderAddress.phoneNumber}`;
  }

  updateOrder(childrenData: any, status: OrderStatusType) {
    const children: Array<string> = [];
    if (status === 'ready' && childrenData.status !== 'paid') {
      alert('Cannot change unpaid order');
    } else if (status === 'shipped' && childrenData.status !== 'ready') {
      alert(`Cannot change order that wasn't ready`);
    } else if (status === 'complete' && childrenData.status !== 'shipped') {
      alert(`Cannot change order that wasn't shipped`);
    } else {
      const entity = {
        orderNumber: childrenData.orderNumber,
        status,
        href: childrenData.href
      };

      this.service.update(entity as any).subscribe((resp) => {
          this.service.fetch(this.orderDetailData.orderNumber).subscribe(
            (response) => {
              // its not correct, IOrder not same as IOrderDetail
              this.orderDetailData = response as any;
              this.fetchAwbUrl();
            },
            (error) => {
              console.log('Error', error);
          });
      }, (error) => {
        console.log('error', error);
      });
    }

  }

  getIsDisabledForReady(childrenData: any): boolean {
    if (childrenData.status !== 'paid' || childrenData.status === 'ready') {
      return true;
    }
    return false;
  }

  getIsDisabledForShipment(childrenData: any): boolean {
    if (childrenData.status !== 'ready' || childrenData.status === 'shipped' || this.isRequestShipment) {
      return true;
    }
    return false;
  }

  getIsDisabledForComplete(childrenData: any): boolean {
    if (childrenData.status !== 'shipped' || childrenData.status === 'complete') {
      return true;
    }
    return false;
  }

  /**
   * Check manual transfer or not
   */
  isManualTransfer(orderData: order.IOrderDetail): boolean {
    return orderData?.orderPayment?.paymentGateway.type === 'manual_transfer';
  }

  /**
   * return status that can `changed`
   */
  statusCanUpdateChoices(): Array<drf.IChoice> {
    const statusCanUpdate = ['unpaid', 'waiting', 'paid', 'cancelled'];
    return this.orderStatusChoices.filter(status => statusCanUpdate.includes(status.value));
  }

  /**
   * check current order status can update or not
   */
  canUpdateOrder(): boolean {
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
      `${orderAddress.phoneNumber}`;
  }
}

