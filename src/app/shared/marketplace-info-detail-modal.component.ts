import { Component, EventEmitter, Input, ViewChild} from '@angular/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
import { DialogResult } from '../core';
import { IWarehouseDetail } from '../models';

/**
 * Shows the user a list of products they can select from.
 *
 * Note: Currently this does not allow the user to navigate
 * paginated data -- it assumes they're going to be searching
 * mostly based on SKUs.
 */
@Component({
  selector: 'nus-marketplace-info-detail-modal',
  template: `
    <ngx-smart-modal  #modal [customClass]="'wide-modal'">
      <h2 class="heading-2">Marketplace Information</h2>
        <div>
          <table>
              <thead id="mp-add-product-head">
                  <tr>
                    <th>Marketplace</th>
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
    </ngx-smart-modal>
  `,
  styles: [
    'h2 { margin-bottom: 20px; }',
    'tr td:nth-child(2), tr th:nth-child(2) { text-align: right; }',
  ]
})
export class MarketplaceInfoDetailModalComponent {
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
