import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';

import { DialogResult, PagedResponse } from '../core';
import { ProductService } from '../services';
import {INamedHrefEntity, products} from '../models';
import {IProductWithPromotion} from "@nusantara/models/products";

/**
 * Shows the user a list of products they can select from.
 *
 * Note: Currently this does not allow the user to navigate
 * paginated data -- it assumes they're going to be searching
 * mostly based on SKUs.
 */
@Component({
  selector: 'nus-product-with-promotion-selection-modal',
  template: `
    <ngx-smart-modal [identifier]="'selectProduct'" #modal [formGroup]="form" [customClass]="'wider-modal'">
      <h2 class="heading-2" i18n>Select Product</h2>
      <form #modalForm class="fluid">
        <div class="search">
          <i class="material-icons">search</i>
          <input type="search" id="search_box" [formControl]="searchText" placeholder="Search Product Name or UPC">
        </div>
        <input type="hidden" [formControl]="product">
        <div *ngIf="displayedResults?.entities.length; else notFound">
          <p i18n>Showing 10 recently added products. Search product name or UPC to find more products.</p>
          <table>
            <colgroup>
              <col class="product-name">
              <col class="product-upc">
              <col class="product-promotion-tag">
              <col class="product-action">
            </colgroup>
            <thead>
            <tr>
              <th i18n>Product Name</th>
              <th i18n>UPC</th>
              <th i18n>
                <span>Promotion Tag</span>
                <!-- Tooltip-->
                <div class="tooltip">
                  <i class="material-icons">info_outline</i>
                  <div class="tooltip-content">
                    <div class="tooltip-header">Information</div>
                    <div class="tooltip-body">Show on going promotions that have the same or overlapping period.</div>
                  </div>
                </div>
                <!-- Tooltip-->
              </th>
              <th class="centered" i18n>Action</th>
            </tr>
            </thead>
            <tbody>
            <tr *ngFor="let p of displayedResults?.entities">
              <td class="product-name" title="{{ p.name }}">{{ p.name }}</td>
              <td class="product-sku" title="{{ p.upc }}">{{ p.upc }}</td>
              <td class="product-promo-tag" title="Promo tag">
                <div>
                    <span *ngFor="let promoTag of p.promotionTag">{{ typesWithLabelInfo[promoTag] }}</span>
                </div>
              </td>
              <td class="left">
                <span>
                  <ng-container *ngIf="!isProductExists(p); else removeProduct">
                    <a href="#" (click)="selectProduct(p)"
                       [class.disabled]="!!isDisabled(p.promotionTag)" (keydown.enter)="!isDisabled(p.promotionTag)"  i18n>Add</a>
                  </ng-container>
                  <ng-template #removeProduct>
  <!--                  <a href="#" (click)="remove(p)"  i18n>remove</a>-->
                  </ng-template>
                </span>
                <div class="tooltip-tag" *ngIf="!!p.promotionTag.length">
                  <i class="material-icons">info_outline</i>
                  <div class="tooltip-content">
                    <div class="tooltip-header">Information</div>
                    <div class="tooltip-body">
                      This product has the same or overlapping periods
                      in other Promo Classifications, but you may still add the product.
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <ng-template #notFound>
          <div class="not-found">
            <h1 class="heading-1" i18n>
              Product Not Found
            </h1>
            <p class="body-2" i18n>Try searching another name or SKU again.</p>
          </div>
        </ng-template>
      </form>
    </ngx-smart-modal>
  `,
  styles: [
    'h2 { padding-bottom: 16px }',
    'p { color : var(--darken-grey); margin-bottom: 16px; }',
    'td { white-space: nowrap;  overflow: hidden; text-overflow: ellipsis; }',
    ` .search {
        display: flex;
        border: solid 1px var(--lighter-nav-bg);
        background-color: transparent;
        align-items: center;
        margin-bottom: 16px;
      }
      div.search > i {
        background-color: white;
        color: var(--nav-background);
        line-height: 31px;
        padding-left: 13px;
      }
      .search > input[type=search] {
        border: none !important;
      }
    `,
    'table { table-layout: fixed }',
    'td { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    '.product-name { width: 40%; }',
    '.product-upc { width: 20%; }',
    '.product-promotion-tag { width: 25%; }',
    '.product-action { width: 15%; }',
    '.not-found { display: flex; flex-flow: column; align-items: center; padding: 64px 0; }',
    '.product-promo-tag div { display: flex; flex-wrap: wrap; }',
    `.product-promo-tag div span {
        background-color: #21A656;
        padding: 2px;
        margin: 8px 0px 0px 8px;
        font-size: 12px;
        line-height: 18px;
        border-radius: 4px;
    }`,
    `
      /* Tooltip container */
    .tooltip {
      position: relative;
      display: inline-block;
      margin-left: 5px;
      height: 22px;
      cursor: pointer;
    }

    .tooltip-tag {
      position: relative;
      display: inline-block;
      margin-left: 30px;
      height: 22px;
      cursor: pointer;
    }

    .tooltip > i, .tooltip-tag > i {
      font-size: 22px;
    }

    /* Tooltip text */
    .tooltip .tooltip-content {
      display: none;
      width: 312px;
      background-color: white;
      color: var(--darken-grey);
      text-align: left;
      padding: 16px;
      position: absolute;
      z-index: 1;
      top: 38px;
      left: -320px;
      filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.16)) drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.08));
    }

    /* Show the tooltip text when you mouse over the tooltip container */
    .tooltip:hover .tooltip-content, .tooltip-tag:hover .tooltip-content {
      display: inline-block;
    }
    .tooltip .tooltip-content::before    {
      content: " ";
      position: absolute;
      right: 100%;
      margin-top: -23px;
      margin-right: -340px;
      width: 18px;
      height: 18px;
      background: white;
      transform: rotate(-45deg);
    }

    .tooltip-content > .tooltip-body {
      padding: 10px 0px;
      font-weight: normal;
    }

    .tooltip-tag .tooltip-content {
      display: none;
      width: 312px;
      background-color: white;
      color: var(--darken-grey);
      text-align: left;
      padding: 16px;
      position: fixed;
      z-index: 1;
      margin-top: 30px;
      margin-left: -325px;
      filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.16)) drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.08));
      white-space: pre-wrap;
    }

    .tooltip-tag .tooltip-content::before {
      content: " ";
      position: absolute;
      right: 100%;
      margin-top: -23px;
      margin-right: -321px;
      width: 18px;
      height: 18px;
      background: white;
      transform: rotate(-45deg);
    }

    .tooltip-tag .tooltip-content .tooltip-header {
      font-weight: bold;
    }

    .left {
      text-align: left;
    }
    `
  ]
})
export class ProductWithPromotionTagSelectionModalComponent implements OnInit, AfterViewInit {

  @ViewChild('imageInput') imageInput: ElementRef;
  @ViewChild('modalForm') formView: ElementRef<HTMLFormElement>;
  @ViewChild('modal') modal: NgxSmartModalComponent;

  @Input() productSelected: IProductWithPromotion[];
  @Input() typesWithLabelInfo?: Object;
  @Input() promoClassificationType: string;
  @Input() pricePromoType?: Array<string>;
  @Input() bundlingPromoType?: Array<string>;
  @Output() removeProduct = new EventEmitter<INamedHrefEntity>();

  form: FormGroup;
  result: DialogResult = DialogResult.Cancelled;
  searchTextChanged$: Subscription;

  displayedResults: PagedResponse<products.IProductWithPromotion> = null;

  timeoutId: any;
  reloadTimeout = 650;
  originalValue: string = null;

  constructor(protected fb: FormBuilder,
              protected service: ProductService) { }

  get searchText(): FormControl { return this.form.get('searchText') as FormControl; }
  get product(): FormControl { return this.form.get('product') as FormControl; }

  ngOnInit() {
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    this.modal.onOpen.subscribe(() => {
      this.initializeForm();
      this.result = DialogResult.Cancelled;

      this.searchTextChanged$ = this.searchText.valueChanges.subscribe(
        (value) => { this.onSearchTextChanged(value); }
        );
    });


    // ensure that we unsubscribe from valueChanges when this form
    // is closed (prevent memory leaks, as it will be reinitialized later)
    this.modal.onClose.subscribe(() => {
      if (this.searchTextChanged$) {
        this.searchTextChanged$.unsubscribe();
      }
    });

    // trigger initial loading of products
    this.onSearchTextChanged('');
  }

  /**
   * Sets the modals form to a new empty set of data.
   */
  private initializeForm(): void {
    this.form = this.fb.group({
      searchText: ['', [ ]],
      product: ['', [Validators.required, ]],
    });
  }


  getValue(): FormData {
    if (this.result !== DialogResult.OK) {
      return null;
    }
    return new FormData(this.formView.nativeElement);
  }

  /**
   * Whenever the user changes the search text, reload
   * the currently-displayed products (after a slight delay
   * to ensure they're not still typing; 650ms)
   *
   * @param newValue The new value the user has typed.
   */
  onSearchTextChanged(newValue: string) {
    if (!!this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // don't run if the value hasn't actually changed from the original.
    if (newValue === this.originalValue) {
      return;
    }

    // wait to see if the user is still typing, before we reload
    this.timeoutId = setTimeout(() => {
      let otherParams = {};
      this.service.fetchWithPromotionList(this.searchText.value, 1, 10).subscribe((page) => {
        this.displayedResults = page;
      });
    }, this.reloadTimeout);

  }

  open() {
    this.modal.open();
    console.log('productSelected', this.productSelected);
  }

  selectProduct(product: products.IProductWithPromotion) {
    this.product.setValue(product);
    this.close();
    this.productSelected.push(product);
    return false;
  }

  get onClose(): EventEmitter<any> {
    return this.modal.onClose;
  }

  close() {
    this.result = DialogResult.OK;
    this.modal.close();
  }

  cancel() {
    this.modal.close();
  }

  remove(product: INamedHrefEntity) {
    this.removeProduct.emit(product);
  }

  isProductExists(product: INamedHrefEntity): boolean {
    return !!this.productSelected.find((_product) => {
      return _product.href === product.href;
    });
  }

  isDisabled(promotionTag: Array<string>): boolean {
    if (this.promoClassificationType === 'price_promo') {
      const foundPriceType = !!promotionTag.some((promoTag) => {
        return this.pricePromoType.includes(promoTag);
      });
      if (!!foundPriceType) {
        return true;
      }
    } else if (this.promoClassificationType === 'bundling_promo') {
      const foundBundlingType = !!promotionTag.some((promoTag) => {
        return this.bundlingPromoType.includes(promoTag);
      });
      if (!!foundBundlingType) {
        return true;
      }
    }
    return false;
  }
}
