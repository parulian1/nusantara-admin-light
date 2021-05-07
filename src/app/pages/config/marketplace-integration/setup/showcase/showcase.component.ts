import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { ProductSelectionModalComponent } from '@nusantara/shared';
import { IProduct } from '@nusantara/models/products';
import { DialogResult } from '@nusantara/core';
import { ConfirmModalComponent } from '@nusantara/shared/confirm-modal.component';

const ADD_ICON = `
<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M18.14 12.64H13.14V17.64H11.5V12.64H6.5V11H11.5V6H13.14V11H18.14V12.64Z" fill="#485368"/>
</svg>
`;

const TRASH_ICON = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12.2857 8.42857C12.2857 8.03409 11.9659 7.71429 11.5714 7.71429C11.1769 7.71429 10.8571 8.03409 10.8571 8.42857V18.4286C10.8571 18.8231 11.1769 19.1429 11.5714 19.1429C11.9659 19.1429 12.2857 18.8231 12.2857 18.4286V8.42857Z" fill="#5A5A5A"/>
  <path d="M8.33164 7.71474C8.72588 7.70066 9.05689 8.00884 9.07097 8.40308L9.42811 18.4031C9.44219 18.7973 9.13401 19.1283 8.73978 19.1424C8.34554 19.1565 8.01453 18.8483 8.00045 18.4541L7.64331 8.45407C7.62923 8.05983 7.93741 7.72882 8.33164 7.71474Z" fill="#5A5A5A"/>
  <path d="M15.4995 8.45407C15.5136 8.05983 15.2054 7.72882 14.8112 7.71474C14.417 7.70066 14.086 8.00884 14.0719 8.40308L13.7147 18.4031C13.7007 18.7973 14.0088 19.1283 14.4031 19.1424C14.7973 19.1565 15.1283 18.8483 15.1424 18.4541L15.4995 8.45407Z" fill="#5A5A5A"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M8 3.78663V4.85715H5.14916C5.14542 4.85712 5.14168 4.85712 5.13793 4.85715H3.71429C3.3198 4.85715 3 5.17694 3 5.57143C3 5.96592 3.3198 6.28572 3.71429 6.28572H4.47182L5.32259 19.8981C5.38465 21.0663 6.26569 22 7.46429 22H15.6786C16.8885 22 17.7493 21.058 17.8201 19.9008L17.8201 19.9007L18.671 6.28572H19.4286C19.8231 6.28572 20.1429 5.96592 20.1429 5.57143C20.1429 5.17694 19.8231 4.85715 19.4286 4.85715H18.0049C18.0012 4.85712 17.9974 4.85712 17.9937 4.85715H15.1429V3.78678C15.1434 3.55216 15.0976 3.31973 15.0082 3.10283C14.9186 2.88562 14.7869 2.68826 14.6208 2.52211C14.4546 2.35596 14.2572 2.22429 14.04 2.13469C13.8232 2.04524 13.5908 1.99947 13.3562 2H9.78663C9.55206 1.99947 9.31969 2.04524 9.10283 2.13469C8.88561 2.2243 8.68826 2.35596 8.52211 2.52211C8.35596 2.68826 8.22429 2.88562 8.13469 3.10283C8.04524 3.31969 7.99947 3.55206 8 3.78663ZM9.78362 3.42857C9.73696 3.42844 9.69073 3.43753 9.64759 3.45532C9.60445 3.47312 9.56526 3.49926 9.53226 3.53226C9.49926 3.56526 9.47311 3.60445 9.45532 3.64759C9.43752 3.69073 9.42843 3.73696 9.42857 3.78363L9.42857 3.78572V4.85715H13.7143V3.78572L13.7143 3.78363C13.7144 3.73696 13.7053 3.69073 13.6875 3.64759C13.6697 3.60445 13.6436 3.56526 13.6106 3.53226C13.5776 3.49926 13.5384 3.47312 13.4953 3.45532C13.4521 3.43753 13.4059 3.42844 13.3592 3.42857L13.3571 3.42858H9.78572L9.78362 3.42857ZM5.90318 6.28572L6.74861 19.8126L6.7488 19.8158C6.74889 19.8174 6.74898 19.8189 6.74906 19.8205C6.77376 20.3012 7.09292 20.5714 7.46429 20.5714H15.6786C16.0463 20.5714 16.364 20.3072 16.3942 19.8136L17.2397 6.28572H5.90318Z" fill="#5A5A5A"/>
</svg>
`;

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

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconLiteral("add", sanitizer.bypassSecurityTrustHtml(ADD_ICON));
    iconRegistry.addSvgIconLiteral('trash', sanitizer.bypassSecurityTrustHtml(TRASH_ICON));
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
