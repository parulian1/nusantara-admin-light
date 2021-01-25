import {Component, EventEmitter, Input,  ViewChild} from '@angular/core';
import {NgxSmartModalComponent} from 'ngx-smart-modal';
import {DialogResult} from '../core';
import {IMarketplaceItemLogisticInformation, IShop} from '../models';
import {MarketplaceShopService, ProductService} from "@nusantara/services";


@Component({
  selector: 'nus-marketplace-info-shipping-modal',
  template: `
    <ngx-smart-modal  #modal identifier="longTextModal">
      <h2 class="heading-2">Shipping</h2>
        <div *ngFor="let data of shippingDetail" class="shipping-container wrapper">
          <div id="product-media" class="flex-container">
            <div class="margin-right-container">
                <h3>Store</h3>
                <span>{{data.storeName}}</span>
            </div>
            <div>
                <h3>Marketplace</h3>
                <span>{{data.storeMarketplace}}</span>
            </div>
            <div>
              <button type="button" [routerLink]="['/config/marketplace-integration/setup/edit-shipping/', data.storeSlug]"
                      [state]="{ shop: {name: data.storeName, marketplace: data.storeMarketplace, isConnected:true} }"
                      class="detail-button shipping-detail">Manage Shipping
              </button>
            </div>
          </div>
          <br>
          <div>
            <div class="shipping-list-title">
                <h3 class="medium-padding bold">Shipping</h3>
                <div class="flex-container logistic-list">
                    <div class="logistic small-font-no-bold" *ngFor="let logisticData of data.storeLogistic">{{logisticData}}</div>
                </div>
            </div>
          </div>
        </div>
    </ngx-smart-modal>
  `,
  styles: [
    `
      .shipping-container{
        height: 300px;
      }

      .shipping-container:last-child{
        height: 360px;
      }

      h3{
        font-weight: normal;
      }

      .small-font-no-bold{
        font-weight: normal;
        font-size: 14px;
      }

      .medium-padding{
        padding-bottom: 16px;
        padding-top: 16px;
        padding-left: 16px;
      }

      .bold{
        font-weight: bold !important;
        color: #5A5A5A;
      }

      .wrapper {
        border: 1px solid #e7e7e7;
        border-radius: 8px;
        padding: 16px 24px 24px;
        margin-bottom: 24px !important;
        overflow: auto;
      }

      .shipping-list-title{
        background: #F4F4F4;
        height: 56px;
        font-weight: 700 !important;
        margin-bottom: 130px;
      }

      span{
        font-weight: 700;
        color: #5A5A5A;
      }
      .flex-container {
        display: flex;
      }
      .margin-right-container{
        width: 250px;
      }

      .detail-button{
        background:none;
        border: 2px solid #FF7D09;
        padding:0;
        cursor: pointer;
        color: #FF7D09;
        font-weight: 700;
        font-size: 14px;
        width: 135px;
        height: 40px;
        margin-left: 80px;
        margin-top:40px;
      }

      .detail-button:hover{
        background:#FF7D09;
        border: 2px solid #FF7D09;
        transition: all .3s;
        color: white;
      }

      .logistic-list{
        flex: 1;
        flex-wrap: wrap;
        align-content: flex-start;
        margin-bottom: 30px;
      }

      .logistic{
        flex-basis: calc(31.333% - 8px);
        min-width: calc(100% * (1/4) - 1px);
        height: 30px;
        margin-left: 16px;
        margin-bottom: 30px;
      }
    `
  ]
})
export class MarketplaceInfoShippingModalComponent {
  @ViewChild('modal') modalInfo: NgxSmartModalComponent;
  @Input() shippingDetail: IMarketplaceItemLogisticInformation[];

  result: DialogResult = DialogResult.Cancelled;
  constructor(public service: MarketplaceShopService) {
  }

  getShop(shopSlug){
    this.service
      .getShopDetail(shopSlug)
      .subscribe((data: IShop) => {
          return data
      });
  }

  getValue(): FormData {
    if (this.result !== DialogResult.OK) {
      return null;
    }
  }

  open() {
    this.modalInfo.open();
  }

  get onClose(): EventEmitter<any> {
    return this.modalInfo.onClose;
  }

  close() {
    this.result = DialogResult.OK;
    this.modalInfo.close();
  }

  cancel() {
    this.modalInfo.close();
  }

  showShippingDetail() {

  }
}
