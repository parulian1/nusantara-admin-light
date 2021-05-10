import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductSelectionModalComponent } from '@nusantara/shared';
import { IProduct } from '@nusantara/models/products';
import { DialogResult } from '@nusantara/core';
import { ConfirmModalComponent } from '@nusantara/shared/confirm-modal.component';
import { SvgIconService } from '@nusantara/services';

@Component({
  selector: 'nus-showcase-detail',
  template: `
    <h1 class="title-1">Perawatan Wajah</h1>

    <div class="wrapper">
      <div class="general-info">
        <h1 class="heading-1">General Information</h1>
        <div class="box">
          <label>
            <span>Showcase Display Name</span>
            <div class="display-name">
              <input type="text">
              <button [routerLink]="" class="control">
                Update
              </button>
            </div>        
          </label>
        </div>
        <div>
          <label>
            <span>Products</span>
            <p>0</p>
          </label>
        </div>
        <div>
          <label>
            <span>Display On/Off</span>
            <div class="switcher">
              <mat-slide-toggle>
              </mat-slide-toggle>
            </div>
          </label>
        </div>
      </div>
      <table class="table-scroll">
        <tr class="button-add">
          <button (click)="productSelectionModal.open()" type="button" class="new-add-button wide">
            <mat-icon class="icon" svgIcon="add"></mat-icon> Add Product
          </button>
        </tr>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>SKU</th>
            <th class="centered">Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let entity of data; let i=index">
            <td>{{ entity?.name }}</td>
            <td>{{ entity?.upc }}</td>
            <td class="centered">
              <button class="remove" (click)="remove(i)">
                <mat-icon class="icon" svgIcon="trash"></mat-icon>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="cancel">
        <button class="control" (click)="confirmModal.open()"> 
          Cancel
        </button>
      </div>

    </div>
    <!-- Modals -->
    <nus-product-selection-modal></nus-product-selection-modal>
    <nus-confirm-modal
      [title]="confirmTitle"
      [content]="confirmText"
      [okText]="confirmOk"
      [cancelText]="confirmCancel">
    </nus-confirm-modal>
  `,
  styles: [
    '.wrapper { display: flex; flex-flow: column; height: 100%; gap: 20px; }',
    `
      .general-info {
        padding: 20px 24px;
        border: solid 1px var(--grey);
        border-radius: 4px;
      }`,
    '.display-name { display: flex; justify-content: space-between; gap: 16px; }',
    'table thead tr th:last-child { padding-right: 22px;}',
    '.table-scroll { display: block; empty-cells: show; }',
    '.table-scroll thead { position: relative; display: block; width: 100%; }', 
    `.table-scroll tbody {
        display: block;
        position: relative;
        width: 100%; 
        overflow-y: scroll;
        max-height: 39vh;
      }
    `,
    '.table-scroll tr { width: auto; display: flex; }',
    `.table-scroll td, .table-scroll th {
        flex-basis: 100%;
        flex-grow: 2;
        display: block;
      }
    `,
      /* Slim and rounded scrollbar */
    '::-webkit-scrollbar { width: 8px; }',
    '::-webkit-scrollbar-thumb { -webkit-border-radius: 10px; border-radius: 10px; background: var(--grey); }',
    '.cancel{ flex: 1 1 auto; }',
    '.cancel button { position: absolute; bottom: 0; }',
    '.icon { height: 20px; }',
    '.button-add { padding: 12px; border-bottom: solid 1px var(--grey); }',
    '.remove { background: none; border: none; }',
  ],
})
export class ShowcaseComponent implements OnInit {
  data: Array<IProduct> = [];
  @ViewChild(ProductSelectionModalComponent) productSelectionModal: ProductSelectionModalComponent;
  @ViewChild(ConfirmModalComponent)confirmModal: ConfirmModalComponent;

  confirmTitle = "Are You Sure?";
  confirmText =
    "Changes you made on General Information will not be saved if you go back.";
  confirmOk = 'Go Back';
  confirmCancel = 'Cancel Anyway';

  constructor(svgIconService: SvgIconService) {
    svgIconService.registerIcons();
  }
  
  ngOnInit() {}

  ngAfterViewInit() {
    // wire-up modal closed callback
    this.productSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed())
  }

  onProductSelectionModalClosed() {
    if (this.productSelectionModal.result === DialogResult.OK) {
      const selectedProduct = this.productSelectionModal.product.value as IProduct;
      this.data.push(selectedProduct);
    }
  }

  remove(index: number){
    this.data.splice(index, 1);
  }
}
