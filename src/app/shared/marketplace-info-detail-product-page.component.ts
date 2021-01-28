import {Component,EventEmitter, Input, ViewChild} from '@angular/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
import { DialogResult} from '../core';
import {IMarketplaceItemDetailInformation} from '../models';

/**
 * Shows the user a list of products they can select from.
 *
 * Note: Currently this does not allow the user to navigate
 * paginated data -- it assumes they're going to be searching
 * mostly based on SKUs.
 */
@Component({
  selector: 'nus-marketplace-product-info-modal',
  template: `
    <ngx-smart-modal #modal [identifier]="'marketplaceProductInfoModal'" [customClass]="'wide-modal'">
      <h2 class="heading-2">Marketplace Information</h2>
        <div>
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
    </ngx-smart-modal>
  `,
  styles: [
    'h2 { margin-bottom: 20px; }',
  ]
})
export class MarketplaceProductInfoComponent {
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
