import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';

import { DialogResult, PagedResponse } from '../core';
import { ProductService } from '../services';
import {ISubLocation, IWarehouseDetail, products} from '../models';

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
    <ngx-smart-modal  #modal identifier="longTextModal">
      <h1 style="font-weight: 700;color: #5A5A5A;">Marketplace Information</h1>
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
    `
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
