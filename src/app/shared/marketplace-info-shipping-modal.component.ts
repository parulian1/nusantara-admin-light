import { Component, EventEmitter, Input, ViewChild } from '@angular/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
import { DialogResult } from '../core';
import { IMarketplaceItemLogisticInformation, IShop } from '../models';
import { MarketplaceShopService } from "@nusantara/services";
import { SlideInOutAnimation } from './animation';


@Component({
  selector: 'nus-marketplace-shipping-info-modal',
  animations: [SlideInOutAnimation],
  template: `
    <ngx-smart-modal  #modal [identifier]="'marketplaceShippingInfoModal'" 
      [customClass]="'wide-modal'">
      <h2 class="heading-2">Shipping</h2>
        <table>
          <thead>
            <tr>
              <th>Store</th>
              <th>Marketplace</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <ng-container *ngFor="let data of shippingDetail; let i = index">
              <tr>
                <td> {{ data.storeName }} </td>
                <td> {{ data.storeMarketplace }} </td>
                <td>
                  <div class="toggle">
                    <a [routerLink]="['/config/marketplace-integration/setup/edit-shipping/', data.storeSlug]"
                      [state]="{ shop: {name: data.storeName, marketplace: data.storeMarketplace, isConnected:true} }">
                      Manage Shipping
                    </a>
                    <button type="button" class="expand">
                      <i class="material-icons">expand_more</i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <div class="logistic">
                    <div class="subheading-2">Shipping</div>
                    <div class="logistic-item">
                      <div *ngFor="let logisticData of data.storeLogistic">
                       {{ logisticData }}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </ng-container>
          </tbody>
        </table>
    </ngx-smart-modal>
  `,
  styles: [
    'h2 { margin-bottom: 16px }',
    'td { width: 33.33%; }',
    '.logistic { border: 1px solid var(--grey-color); border-radius: 4px; margin: 10px 0; }',
    '.subheading-2 { padding: 14px 12px; background: var(--darken-white-color); }',
    `.logistic-item { 
      display: grid; 
      grid-template-columns: repeat(3, 1fr); 
      grid-column-gap: 26px; 
      grid-row-gap: 20px; 
      padding: 12px; 
    }`,
    '.expand { background: none; border: none; outline: none; font-size: 18px; cursor: pointer; }',
    '.toggle { display: flex; justify-content: space-between; align-items: center; }'
  ]
})
export class MarketplaceShippingInfoModalComponent {
  @ViewChild('modal') modalInfo: NgxSmartModalComponent;
  @Input() shippingDetail: IMarketplaceItemLogisticInformation[];

  animationState = 'out';
  showedShipping: number;
  isExpanded = false;
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

  toggleStore(index: number) {
    this.isExpanded = !this.isExpanded;
    this.showedShipping = index;
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }
}
