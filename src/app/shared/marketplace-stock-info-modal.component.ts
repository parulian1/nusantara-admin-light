import {Component, EventEmitter, Input, ViewChild} from '@angular/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
import { DialogResult} from '../core';
import {IMarketplaceItemDetailInformation} from '../models';

/**
 * Used in Delivery Product Detail Page - Makertplace Integration Section
 *
 */

@Component({
  selector: 'nus-marketplace-stock-info-modal',
  template: `
    <ngx-smart-modal #modal [identifier]="'marketplaceStockInfoModal'"
    [customClass]="'wide-modal no-padding-modal'">
      <h2 class="heading-2">Marketplace Information</h2>
      <div class="content">
        <div class="table">
          <table>
              <thead>
                  <tr>
                    <th>Warehouse</th>
                    <th>Marketplace</th>
                    <th class="numeric">Stock</th>
                    <th>Store</th>
                  </tr>
              </thead>
              <tbody>
                  <ng-container *ngFor="let mp of warehouseInfoDetail">
                    <tr *ngFor="let store of mp.store">
                      <td>{{ mp.warehouse }}</td>
                      <td>{{ store.marketplace }}</td>
                      <td class="numeric">{{ mp.totalStock }}</td>
                      <td>{{ store.name }}</td>
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
    `.content { display: block; position: relative; overflow-y: scroll; max-height: 500px; margin-right: 2px; }`,
    '.table { padding: 0 14px 24px 24px }',
    '::-webkit-scrollbar { width: 8px; }',
    '::-webkit-scrollbar-thumb { -webkit-border-radius: 10px; border-radius: 10px; background: var(--grey); }',
  ]
})
export class MarketplaceStockInfoModalComponent {
  @ViewChild('modal') modalInfo: NgxSmartModalComponent;
  @Input() warehouseInfoDetail: IMarketplaceItemDetailInformation[];

  result: DialogResult = DialogResult.Cancelled;

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
}
