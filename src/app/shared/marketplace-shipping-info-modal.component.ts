import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
import { DialogResult } from '../core';
import { IMarketplaceItemLogisticInformation } from '../models';
import { MarketplaceShopService } from '@nusantara/services';

/**
 * Used in Delivery Product Detail Page - Makertplace Integration Section
 *
 */
@Component({
  selector: 'nus-marketplace-shipping-info-modal',
  template: `
    <ngx-smart-modal  #modal [identifier]="'marketplaceShippingInfoModal'"
      [customClass]="'wide-modal no-padding-modal'">
      <h2 class="heading-2">Shipping</h2>
      <div class="content">
        <div class="table">
          <table>
            <thead>
              <tr>
                <th>Store</th>
                <th>Marketplace</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <ng-container *ngFor="let data of shippingDetail; let i = index;">
                <tr>
                  <td> {{ data.storeName }} </td>
                  <td> {{ data.storeMarketplace }} </td>
                  <td>
                    <div class="toggle">
                      <a [routerLink]="['/config/marketplace-integration/setup/edit-shipping/', data.storeSlug]"
                        [state]="{ shop: {name: data.storeName, marketplace: data.storeMarketplace, isConnected:true} }">
                        Manage Shipping
                      </a>
                      <button type="button" (click)="isExpanded[i] = !isExpanded[i];" class="expand">
                        <i class="material-icons">{{ isExpanded[i]? 'expand_less' : 'expand_more' }}</i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="isExpanded[i]">
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
        </div>
      </div>
    </ngx-smart-modal>
  `,
  styles: [
    'h2 { padding: 24px 24px 16px; }',
    'td { width: 33.33%; }',
    '.logistic { border: 1px solid var(--grey); border-radius: 4px; margin: 10px 0; }',
    '.subheading-2 { padding: 14px 12px; background: var(--darken-white); }',
    `.logistic-item {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: 26px;
      grid-row-gap: 20px;
      padding: 12px;
    }`,
    '.expand { background: none; border: none; outline: none; font-size: 18px; cursor: pointer; }',
    '.toggle { display: flex; justify-content: space-between; align-items: center; }',
    `.content { display: block; position: relative; overflow-y: scroll; max-height: 500px; margin-right: 2px; }`,
    '.table { padding: 0 14px 24px 24px }',
    '::-webkit-scrollbar { width: 8px; }',
    '::-webkit-scrollbar-thumb { -webkit-border-radius: 10px; border-radius: 10px; background: var(--grey); }',
  ]
})
export class MarketplaceShippingInfoModalComponent implements OnInit {
  @ViewChild('modal') modalInfo: NgxSmartModalComponent;
  @Input() shippingDetail: IMarketplaceItemLogisticInformation[];

  isExpanded: boolean[];
  result: DialogResult = DialogResult.Cancelled;

  constructor(public service: MarketplaceShopService) {}

  ngOnInit() {
    this.isExpanded = Array(this.shippingDetail?.length).fill(false);
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
}
