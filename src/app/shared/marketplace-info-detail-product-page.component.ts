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
  selector: 'nus-marketplace-info-detail-product-page',
  template: `
    <ngx-smart-modal  #modal identifier="longTextModal">
      <h1 style="font-weight: 700;color: #5A5A5A;">Marketplace Information</h1>
        <div>
          <table>
              <thead id="mp-add-product-head">
                  <tr>
                    <th>Warehouse</th>
                    <th>Stock</th>
                    <th>Marketplace</th>
                    <th>Store</th>
                  </tr>
              </thead>
              <tbody>
                  <tr *ngFor="let mp of warehouseInfoDetail">
                    <td>{{mp.warehouse}}</td>
                    <td>{{mp.totalStock}}</td>
                    <td>
                        <table class="inline-table">
                            <tr *ngFor="let data of mp.store">
                                <td style="padding-left: 0">{{data.marketplace}}</td>
                            </tr>
                        </table>
                    </td>
                    <td>
                        <table class="inline-table">
                            <tr *ngFor="let data of mp.store">
                                <td style="padding-left: 0">{{data.name}}</td>
                            </tr>
                        </table>
                    </td>
                  </tr>
              </tbody>
          </table>
        </div>
    </ngx-smart-modal>
  `,
  styles: [
    `
      .inline-table{
        box-shadow: none;
        border-collapse: separate;
      }
      #mp-add-product-head {
        background-color: #F4F4F4;
        height: 56px;
      }
      th, td{
        text-align: left;
      }
      table{
        border-radius: 4px;
      }

    `
  ]
})
export class MarketplaceInfoDetailProductPageComponent {
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
