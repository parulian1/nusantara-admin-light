import { Component, EventEmitter, Input, ViewChild} from '@angular/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
import { DialogResult } from '../core';
import { IWarehouseDetail } from '../models';

/**
 * Used in Delivery Orders Page / inventory-receiving
 *
 */
@Component({
  selector: 'nus-marketplace-channel-info-modal',
  template: `
    <ngx-smart-modal #modal [identifier]="'marketplaceChannelInfoModal'"
      [customClass]="'wide-modal no-padding-modal'">
      <h2 class="heading-2">Marketplace Information</h2>
      <div class="content">
        <div class="table">
          <table>
              <thead>
                  <tr>
                    <th>Channel</th>
                    <th>Stock</th>
                    <th>Store</th>
                  </tr>
              </thead>
              <tbody>
                  <tr *ngFor="let mp of warehouseInfoDetail">
                    <td>{{mp.marketplace}}</td>
                    <td>{{mp.storeStock}}</td>
                    <td>{{mp.store}}</td>
                  </tr>
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
    'tr td:nth-child(2), tr th:nth-child(2) { text-align: right; }',
    '::-webkit-scrollbar { width: 8px; }',
    '::-webkit-scrollbar-thumb { -webkit-border-radius: 10px; border-radius: 10px; background: var(--grey); }',
  ]
})
export class MarketplaceChannelInfoModalComponent {
  @ViewChild('modal') modalInfo: NgxSmartModalComponent;
  @Input() warehouseInfoDetail: IWarehouseDetail[];

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
