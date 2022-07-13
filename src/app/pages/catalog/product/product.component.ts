import {StockInputComponent} from './stock-input/stock-input.component';
import {HttpErrorResponse} from '@angular/common/http';
import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import * as ClassicEditor from '@gdnnusantara/ckeditor5-build/build/ckeditor';
import {NgxSmartModalService} from 'ngx-smart-modal';
import {EMPTY, of} from 'rxjs';
import {catchError, debounceTime} from 'rxjs/operators';
import {
  ProductRelatedService,
  ProductService,
  SiteConfigService,
  SvgIconService,
  WarehouseService,
  ProductClassService,
  AdvancedPriceListService,
  MarketplaceItemService
} from '@nusantara/services';
import {
  AbstractDetailComponent,
  DialogResult,
  ErrorResult,
  getSlugFromHref, IResultResponse,
  Logger,
  NusantaraValidators,
  ToastLevelEnum,
  ToastService
} from '@nusantara/core';
import {drf, ICategory, INamedHrefEntity, IVendor, products} from '@nusantara/models';
import {IError} from '@nusantara/models/base/error';
import {PriceListHostComponent} from './price';
import {ProductMediaHostComponent} from './media';
import {ProductAttributeHostComponent} from './attribute';
import {ProductSubscriptonHostComponent} from './subscription';
import {MarketplaceInfoHostComponent} from './marketplace';

import {ProductSelectionModalComponent, VendorSelectionModalComponent} from '@nusantara/shared';
import {IPriceList, IProduct, IProductClass} from '@nusantara/models/products';
import {CategorySelectionModalComponent} from '@nusantara/shared/modals/category-selection-modal.component';
import {ProductClassSelectionModalComponent} from '@nusantara/shared/modals/product-class-selection-modal.component';
import {ProductOnlineSelectionModalComponent} from '@nusantara/shared/product-online-selection-modal.component';
import {IBundleStockSearch} from '@nusantara/models/products/stock-search';
import {IProductBundle} from '@nusantara/models/products/product-bundle';
import {ConfirmModalComponent} from '@nusantara/shared/confirm-modal.component';
import {IAdvancedPriceList} from '@nusantara/models/products/advanced-price-list';

const logger = new Logger('ProductComponent');

/**
 * Allows the user to edit/create a single product.
 */
@Component({
  selector: 'nus-product',
  template: `
    <div class="container minmax">
      <div>
        <nus-detail-title [originalName]="originalEntityName" [isLink]="this.marketplaceLink.length > 0"
                          typeName="Product" class="title"></nus-detail-title>
        <div class="drpdown" *ngIf="entity && this.marketplaceLink.length > 0">
          <button
            class="control secondary btn"
            mat-button
            [matMenuTriggerFor]="downloadMenu"
            (menuOpened)="open()"
            (menuClosed)="close()">
            <span class="judul" i18n>View Product</span>
            <i id="transform" class="material-icons preview-icon">expand_more</i>
          </button>
          <mat-menu #downloadMenu xPosition="before" class="">
            <button mat-menu-item i18n matTooltip="{{link.marketplace}} - {{link.shop}}" matTooltipClass="tooltip"
                    [matTooltipShowDelay]="1500" [matTooltipPosition]="'after'" *ngFor="let link of marketplaceLink"
                    (click)="openLink(link.urlLink)"
                    title="Link to {{link.marketplace}} - {{link.shop}}"
            >{{link.marketplace}} - {{link.shop}}</button>
          </mat-menu>
        </div>
      </div>
      <div></div>
    </div>
    <div class="container">
      <div>
        <nus-non-field-errors
          [nonFieldErrors]="nonFieldErrors">
        </nus-non-field-errors>

        <form [formGroup]="form" (ngSubmit)="preSave()" class="fluid" (keydown.enter)="$event.preventDefault()" (keydown.shift.enter)="$event.preventDefault()">
          <div id="general-info" class="wrapper">
            <h1 class="heading-1" i18n>General Information</h1>
            <label class="immediate-error-display-input">
              <span i18n>Name</span>
              <input type="text"
                     [formControl]="name"
                     name="name"
                     placeholder="Input Name"
                     i18n-placeholder
                     data-qa="name"/>
              <nus-field-errors [control]="name"></nus-field-errors>
            </label>
            <label class="toggle">
              <input id="s2" type="checkbox"
                     class="toggle"
                     [formControl]="isActive"
                     name="is-active"
                     data-qa="is-active"/>
              <span i18n>Is Active</span>
              <nus-field-errors [control]="isActive"></nus-field-errors>
            </label>

            <label *ngIf="!!structure && structure.value === 'parent'">
              <span i18n>Product Category</span>
              <div class="manage">
                <div>
                  <input type="hidden" [formControl]="category" data-qa="category">
                  <div class="input-with-button">
                    <input type="text" (click)="selectCategory()" readonly
                           i18n-placeholder placeholder="Select Category"
                           [value]="selectedCategory?.name" data-qa="category-pop">
                    <button (click)="selectCategory()" type="button" title="Dropdown Category"
                            data-qa="category-pop-button"><span class="material-icons">expand_more</span></button>
                  </div>
                  <nus-field-errors [control]="category"></nus-field-errors>
                </div>
                <div><a [routerLink]="['/catalog', 'categories']" i18n> Manage Category</a></div>
              </div>
            </label>

            <label *ngIf="!!structure && structure.value === 'parent'">
              <span i18n>Product Class</span>
              <div class="manage">
                <div>
                  <input type="hidden" [formControl]="productClass" data-qa="product-class">
                  <div class="input-with-button">
                    <input type="text" (click)="selectProductClass()" readonly
                           i18n-placeholder placeholder="Select Class"
                           [value]="selectedProductClassValue?.name"
                           data-qa="product-class-pop">
                    <button (click)="selectProductClass()" type="button" title="Dropdown Product Class"
                            data-qa="product-class-pop-button"><span class="material-icons">expand_more</span></button>
                  </div>
                  <nus-field-errors [control]="productClass"></nus-field-errors>
                </div>
                <div><a [routerLink]="['/catalog', 'product-classes']" target="_blank" i18n>Manage Class</a>
                </div>
              </div>
            </label>
            <div *ngIf="productClass?.value && productFormType !== 'bundling'">
              <nus-product-attribute-host
                [form]="attributes"
                [productClass]="productClass"
                [selectedProductClass]="selectedProductClass"
                [originalAttributeValues]="originalAttributeValues"
                [enabledAttributes]="enabledAttributes"
                [parentProduct]="parentProduct"
                *ngIf="originalAttributeValues">
              </nus-product-attribute-host>
            </div>
          </div>

          <div id="product-bundling" class="wrapper" *ngIf="productFormType === 'bundling' ">
            <h1 class="heading-1" i18n>Product Bundling</h1>
            <label>
              <span i18n>Bundling Table (Optional)</span>
              <table style="margin-bottom: 16px; table-layout: fixed;">
                <thead>
                <tr>
                  <th class="product-name" i18n>Product Name</th>
                  <th i18n>UPC</th>
                  <th i18n>Weight</th>
                  <th i18n>Qty</th>
                  <th i18n>Price Perunit</th>
                  <th i18n>Remove</th>
                </tr>
                </thead>
                <tbody>

                <nus-bundle-line *ngFor="let control of productBundling.controls; let i=index"
                                 [formGroup]="control" (remove)="removeProductBundling(i)"
                                 (update)="updateVirtualAmountAndPriceListAndWeight()">
                </nus-bundle-line>
                <tr class="total-price">
                  <td colspan="5" i18n>
                    Total
                  </td>
                  <td class="price">
                    {{ totalPrice | currency: 'Rp ': 'symbol' : '1.0' }}
                  </td>
                </tr>
                </tbody>
              </table>
              <button (click)="addBundling()" type="button" class="new-add-button wide">
                <i class="material-icons">add</i><ng-container i18n>Add Product</ng-container>
              </button>
              <div *ngIf="virtualPackageAmount !== null" class="package-info">
                <div class="label" i18n>Total Potential Virtual Stock</div>
                <div class="stock-amount" i18n>{{ virtualPackageAmount }} package</div>
              </div>
            </label>

          </div>

          <div id="product-info" class="wrapper">
            <h1 class="heading-1" i18n>Product Information</h1>

            <div class="rich-text-container">
              <label for="content" class="external"><span i18n>Product Description (min. {{DESCRIPTION_MIN_LENGTH}}
                character)</span></label>
              <ckeditor [editor]="Editor" [config]="editorConfig"
                        [formControl]="description"
                        id="description"
                        data-qa="description">
              </ckeditor>
              <span class="input-error-info">
              <nus-field-errors [control]="description"></nus-field-errors>
              <nus-field-length-counter [control]="description"
                                        [maxLength]="DESCRIPTION_MAX_LENGTH">
              </nus-field-length-counter>
              </span>
            </div>

            <label *ngIf="structure.value === 'parent'">
              <span i18n>Vendor</span>
              <div class="manage">
                <div>
                  <input type="hidden" [formControl]="vendor" data-qa="vendor">
                  <div class="input-with-button">
                    <input type="text" (click)="selectVendor()" readonly
                           i18n-placeholder placeholder="Select Vendor"
                           [value]="selectedVendor?.name" [title]="selectedVendor?.name"
                           data-qa="vendor-pop">
                    <button (click)="selectVendor()" type="button" title="Dropdown Vendor" data-qa="vendor-pop-button">
                      <span class="material-icons">expand_more</span></button>
                  </div>
                  <nus-field-errors [control]="vendor"></nus-field-errors>
                </div>
                <div><a [routerLink]="['/catalog', 'vendors']" target="_blank" i18n> Manage Vendor </a></div>
              </div>
            </label>
          </div>

          <div id="product-management" class="wrapper">
            <h1 class="heading-1" i18n>Product Management</h1>
            <ng-template [ngIf]="structure.value === 'parent' && productFormType !== 'bundling'">
              <label>
                <span i18n>Variant Table (Optional)</span>
                <table>
                  <thead>
                  <tr>
                    <th i18n>Name</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr *ngFor="let v of variants">
                    <td>
                      <a [routerLink]="['variants', v.href | entityToSlug]">{{ v.name}}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 14px;">
                      <button [disabled]="isNew" (click)="addVariant()" type="button" class="new-add-button wide">
                        <i class="material-icons">add</i><ng-container  i18n> Add Variant</ng-container>
                      </button>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </label>
            </ng-template>

            <label class="immediate-error-display-input">
              <span i18n>UPC</span>
              <input type="text"
                     [formControl]="upc"
                     name="upc"
                     placeholder="UPC must be unique" i18n-placeholder
                     data-qa="upc"/>
              <nus-field-errors [control]="upc"></nus-field-errors>
            </label>

            <label class="immediate-error-display-input">
              <div id="barcode-label">
                <span i18n>Barcode</span>
                <a (click)="copyUpcToBarcode()" i18n>Copy from UPC</a>
              </div>
              <input type="text"
                     placeholder="Input Barcode" i18n-placeholder
                     [formControl]="barcode"
                     name="barcode"
                     data-qa="barcode"/>
              <nus-field-errors [control]="barcode"></nus-field-errors>
            </label>

            <label class="single-price immediate-error-display-input">
              <span i18n>Default Price</span>
              <div class="prepend-label">
                <span class="prepended-label" [ngClass]="{'disabled': this.price.disabled}">Rp.</span>
                <input type="number" [formControl]="price" name="price" min="1" appOnlyNumber decimal="true"
                       placeholder="Input 1-{{MAX_PRICE}}"
                       i18n-placeholder data-qa="single-price"
                >
              </div>
              <span class="caption-2" *ngIf="this.isAdvancePriceAvailable" i18n>Please exclude the product from the Advanced Price to edit this column.</span>
              <nus-field-errors [control]="price"></nus-field-errors>
            </label>

            <label class="price-range field-box">
              <span i18n>Price Range (optional)</span>
              <div class="inline-option" role="radiogroup" aria-labelledby="radio_label">
                <label class="toggle">
                  <input id="pr-radio" type="checkbox"
                         class="toggle"
                         [formControl]="priceSelector"
                         data-qa="price-range-select"
                         [checked]="priceSelector.value === true"
                  />
                  <span i18n>Enable</span>
                  <nus-field-errors [control]="priceSelector"></nus-field-errors>
                </label>
              </div>
            </label>
            <label>
              <div [ngClass]="{'hidden' : !enterpriseLicense()}">
                <span *ngIf="!priceSelector.value" class="greybox" i18n>You have not checked 'enable' for price range</span>
                <nus-price-list-host [form]="priceLists"
                                     [ngClass]="{'hidden' : !priceSelector.value}"></nus-price-list-host>
              </div>
            </label>
            <label class="advance-price">
              <div [ngClass]="{'hidden' : !enterpriseLicense()}">
                <nus-advance-price [productHref]="entity?.href"></nus-advance-price>
              </div>
            </label>
          </div>

          <div id="product-subscription" class="wrapper" *ngIf="isProductOptionDomain">
            <h1 class="heading-1" i18n>Subscription Information:</h1>
            <nus-product-subscription [form]="subscription"></nus-product-subscription>
          </div>

          <div id="product-media" class="wrapper">
            <h1 class="heading-1" i18n>Media</h1>
            <nus-non-field-errors [nonFieldErrors]="mediaError">
            </nus-non-field-errors>
            <nus-product-media-host [form]="media"></nus-product-media-host>
          </div>

          <div id="product-packaging" class="wrapper">
            <h1 class="heading-1" i18n>Product Packaging</h1>
            <label class="immediate-error-display-input">
              <span i18n>Package Weight (kg)</span>
              <input type="number" [formControl]="weight"
                     name="weight"
                     placeholder="Input {{MIN_WEIGHT}}-{{MAX_DIMENSION}}"
                     i18n-placeholder
                     data-qa="weight"/>
              <nus-field-errors [control]="weight"></nus-field-errors>
            </label>
            <div formGroupName="dimensions" class="product-dimension">
              <label class="immediate-error-display-input">
                <span i18n>Length (cm)</span>
                <input
                  type="number"
                  name="length"
                  class="dimension-input"
                  formControlName="currentLength"
                  placeholder="Input 1-{{MAX_DIMENSION}}"
                  i18n-placeholder
                  data-qa="length"/>
                <nus-field-errors [control]="currentLength"></nus-field-errors>
              </label>
              <label class="immediate-error-display-input">
                <span i18n>Width (cm)</span>
                <input
                  type="number"
                  name="width"
                  class="dimension-input"
                  formControlName="currentWidth"
                  placeholder="Input 1-{{MAX_DIMENSION}}"
                  i18n-placeholder
                  data-qa="width"/>
                <nus-field-errors [control]="currentWidth"></nus-field-errors>
              </label>
              <label class="immediate-error-display-input">
                <span i18n>Height (cm)</span>
                <input
                  type="number"
                  name="height"
                  class="dimension-input"
                  formControlName="currentHeight"
                  placeholder="Input 1-{{MAX_DIMENSION}}"
                  i18n-placeholder
                  data-qa="height"/>
                <nus-field-errors [control]="currentHeight"></nus-field-errors>
              </label>
            </div>
          </div>

          <div *ngIf="enterpriseLicense()" id="product-tag" class="wrapper">
            <h1 class="heading-1" i18n>Product Tag (max {{MAX_TAG_NUMBER}})</h1>
            <div class="tag-manage immediate-error-display-input">
              <input type="text" name="input_tag"
                     [formControl]="tag"
                     #inputTag placeholder="Input Tag" i18n-placeholder
              />
              <button (click)="addTag(inputTag.value); inputTag.value = ''"
                      [disabled]="!inputTag.value ||( tags.controls.length >= MAX_TAG_NUMBER) || !tagForm.valid"
                      type="button" class="new-add-button wide">
                <i class="material-icons">add</i><ng-container i18n> Select Product Tag</ng-container>
              </button>
              <nus-field-errors [control]="tag"></nus-field-errors>
            </div>
            <div class="tag-list">
              <label *ngFor="let t of tags.controls; let i = index" class="tag-item">
                <input type="hidden" [formControl]="t" name="tag" data-qa="tag"/>
                <span class="tag-chip">{{t.value}}
                  <button type="button" class="delete" (click)="tags.removeAt(i)" title="Remove tag {{t.value}}">
                  <i class="material-icons">highlight_off</i>
                </button>
              </span>
              </label>
            </div>

          </div>

          <div id="product-other" class="wrapper">
            <h1 class="heading-1" i18n>Other</h1>
            <label>
              <span i18n>Meta Description</span>
              <textarea placeholder="Input Description" i18n-placeholder
                        [formControl]="seoDescription"
                        name="seo-description"
                        cols="30" rows="10"
                        data-qa="seo-description">
              </textarea>
              <span class="input-error-info">
              <nus-field-errors [control]="seoDescription"></nus-field-errors>
              <nus-field-length-counter [control]="seoDescription"
                                        [maxLength]="SEO_MAX_LENGTH"></nus-field-length-counter>
              </span>
            </label>
            <label>
              <span i18n>Meta Keywords</span>
              <textarea placeholder="Input Keyword" i18n-placeholder
                        [formControl]="seoMeta"
                        name="seo-meta"
                        cols="30" rows="10"
                        data-qa="seo-meta">
              </textarea>
              <span class="input-error-info">
              <nus-field-errors [control]="seoMeta"></nus-field-errors>
              <nus-field-length-counter [control]="seoMeta"
                                        [maxLength]="SEO_MAX_LENGTH"></nus-field-length-counter>
              </span>
            </label>
          </div>

          <nus-marketplace-info id="marketplace-information"
                                *ngIf="!isNew && isPhysical() && enterpriseLicense()"
                                [form]="marketplace"
                                [id]="entity?.id"
                                [lenLinks]="marketplaceLink.length > 0"
                                [productClass]="selectedProductClass">
          </nus-marketplace-info>

          <div *ngIf="!isNew && enterpriseLicense() && !!showNonBundlingComponent()"
               class="wrapper"
               id="product-inventory">
            <nus-stock-search [productHref]="entity?.href"></nus-stock-search>
          </div>

          <div class="wrapper" [ngClass]="{'hidden' : enterpriseLicense()}" id="product-inventory">
            <ng-container>
              <nus-stock-input [productHref]="entity?.href"></nus-stock-input>
            </ng-container>
          </div>

          <div id="product-recommendation" class="wrapper">
            <h1 class="heading-1" i18n>Product Recommendation</h1>
            <table>
              <thead>
              <tr>
                <th i18n>Product Name</th>
                <th i18n style="width:100px">Action</th>
              </tr>
              </thead>
              <tbody>
              <tr *ngFor="let control of productRelated.controls; let i=index">
                <td>
                  <a [routerLink]="['/catalog','products', control.get('href').value|entityToSlug]" target="_blank">
                    {{ control.get('name').value }}
                  </a>
                </td>
                <td>
                  <button type="button" class="delete remove-button" (click)="removeRelated(i)" title="Remove related {{ control.get('name').value }}">
                    <i class="material-icons">delete_outline</i>
                  </button>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <button type="button" (click)="selectProduct()" class="new-add-button wide">
                    <span class="material-icons">add</span><ng-container i18n> Add Product</ng-container>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <nus-detail-actions
            [component]="this"
            (cancel)="navigateToParent(true)"
            (delete)="delete()"
            [hideDelete]="true"
          >
          </nus-detail-actions>
        </form>
      </div>
      <div class="side-nav">
        <ul>
          <li [ngClass]="{ active: currentActive === 'general-info' }">
            <a (click)="scrollTo('general-info')" i18n>General Information</a>
          </li>
          <li [ngClass]="{ active: currentActive === 'product-info' }">
            <a (click)="scrollTo('product-info')" i18n>Product Information</a>
          </li>
          <li [ngClass]="{ active: currentActive === 'product-management' }">
            <a (click)="scrollTo('product-management')" i18n>Product Management</a>
          </li>
          <li [ngClass]="{ active: currentActive === 'product-media' }">
            <a (click)="scrollTo('product-media')" i18n>Media</a>
          </li>
          <li [ngClass]="{ active: currentActive === 'product-packaging' }">
            <a (click)="scrollTo('product-packaging')" i18n>Product Packaging</a>
          </li>
          <li *ngIf="enterpriseLicense()" [ngClass]="{ active: currentActive === 'product-tag' }">
            <a (click)="scrollTo('product-tag')" i18n>Product Tag</a>
          </li>
          <li [ngClass]="{ active: currentActive === 'product-other' }">
            <a (click)="scrollTo('product-other')" i18n>Other</a>
          </li>
          <li *ngIf="!isNew && isPhysical() && enterpriseLicense()"
              [ngClass]="{ active: currentActive === 'marketplace-information' }">
            <a (click)="scrollTo('marketplace-information')" i18n>Marketplace Information</a>
          </li>
          <li *ngIf="!isNew" [ngClass]="{ active: currentActive === 'product-inventory' }">
            <a (click)="scrollTo('product-inventory')" i18n>Product Inventory</a>
          </li>
          <li *ngIf="!isNew" [ngClass]="{ active: currentActive === 'product-recommendation' }">
            <a (click)="scrollTo('product-recommendation')" i18n>Product Recommendation</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Modals -->
    <nus-product-selection-modal #productRecommendationModal></nus-product-selection-modal>
    <nus-product-online-selection-modal #productBundlingModal></nus-product-online-selection-modal>
    <nus-vendor-selection-modal #vendorModal></nus-vendor-selection-modal>
    <nus-category-selection-modal #categoryModal></nus-category-selection-modal>
    <nus-product-class-selection-modal (productClassChanged)="onProductClassChanged(productClass.value)"
                                       #productClassModal></nus-product-class-selection-modal>
    <nus-confirm-modal
      [title]="confirmAdvancedPriceTitle"
      [content]="confirmAdvancedPriceText">
    </nus-confirm-modal>
  `,
  styles: [
    '.container { display: grid; grid-template-columns: 3fr 1fr; grid-column-gap: 24px; }',
    '.wrapper { padding: 16px 24px; border: solid 1px var(--grey); border-radius: 4px; margin-bottom: 24px; }',
    '.manage { display: grid; grid-template-columns: 7fr 1fr; grid-gap: 20px; align-items: center; }',
    '.product-dimension { display: grid; grid-template-columns: repeat(3, 1fr); grid-column-gap: 16px; }',
    '.heading-1 { margin-bottom: 16px; }',
    'label.toggle { padding-bottom: 20px; width: fit-content; min-height: 0; }',
    'label.toggle > input { margin-right: 16px }',
    '.rich-text-container { padding-bottom: 16px; margin: 0 !important; }',
    'ul { list-style: none; margin: 0; padding: 0; }',
    '.side-nav li { font-size: 14px; line-height: 20px; font-weight: bold; color: var(--tertiary); padding: 10px 32px; cursor: pointer; }',
    '.side-nav li.active { padding: 10px 24px; color: white; background: var(--tertiary-lighten); border-left: solid 8px var(--secondary); border-radius: 4px; }',
    '.preview-icon { position: absolute; top: 9px; padding-left: 2px; color:#EA730B; transition: transform .5s; transform: rotateZ(0deg) }',
    '.drpdown { float:right }',
    '.title { float:left }',
    '.judul { color:#EA730B; height: 1rem; line-height: 1rem; padding:7px; margin:6px 0; border-right-style: solid; display:inherit; font-weight:bold }',
    '.btn { border: 2px solid #EA730B; position:relative; padding-right:30px }',
    '.hover-rotate { transition: transform .4s; transform: rotateZ(180deg) }',
    '::ng-deep .elipsis { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 800px;}',
    '.minmax {grid-template-columns: 1133px minmax(200px, auto);}',
    '.mat-menu-item { width: 300px; }',
    '::ng-deep .tooltip { font-size: 11pt; }',
    '.side-nav li a { text-decoration: none; color: inherit; }',
    '.delete { background: none; border: none; outline: none; font-size: 18px; cursor: pointer; opacity: .5; }',
    '.package-info { line-height: 18px; margin-top: 26px; font-weight: bold; }',
    '.package-info .label { float: left; width: 25%; }',
    'table tr th.product-name { width: 25%; }',
    '.total-price { font-weight: bold; }',
    '.total-price td.price { text-align: right; }',
    '#barcode-label { display: block; margin-bottom: 4px; }',
    '#barcode-label > span:first-child { font-size: 14px; line-height: 20px; font-weight: bold; margin-right: 10px; }',
    `.input-error-info {
      display: flex;
      justify-content: space-between;
    }
    `, `
      .greybox {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 8px 0 8px 12px;
        /* UI / Darken White */

        background: #F4F4F4;
        border-radius: 4px;

        /* Inside auto layout */

        flex: none;
        order: 2;
        align-self: stretch;
        flex-grow: 0;
        margin: 4px 0;
      }
    `,
    '.tag-manage { display: grid; grid-template-columns: 6fr 2fr; grid-gap: 20px; align-items: center; }',
    `
      .tag-list {
        display: flex;
        margin-top: 8px;
        max-width: 900px;
        flex-wrap: wrap;
        gap: 8px;
      }

      label.tag-item {
        min-height: initial;
        padding: 0;
        gap: 16px;
      }

      .tag-chip {
        /* Auto layout */

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 4px 4px 4px 8px;
        /* UI / Darken White */
        background: #F4F4F4;
        border-radius: 24px;
        flex: none;
        order: 0;
        flex-grow: 0;
        font-style: normal;
        font-weight: 700;
        font-size: 14px;
        line-height: 20px;
      }
    `,
    `
      .prepend-label {
        position: relative;
      }

      .prepend-label span.prepended-label {
        margin-left: 0;
        position: absolute;
        display: block;
        transform: translate(0, -50%);
        top: 50%;
        pointer-events: none;
        width: 25px;
        text-align: center;
        font-style: normal;
        padding-left: 5px;
      }

      span.prepended-label.disabled {
        color: var(--grey);
      }

      .prepend-label > input {
        padding-left: 30px;
      }
    `
  ]
})
export class ProductComponent extends AbstractDetailComponent<products.IProduct> implements OnInit, AfterViewInit {
  readonly DESCRIPTION_MAX_LENGTH = 3000;
  readonly DESCRIPTION_MIN_LENGTH = 50;
  readonly SEO_MAX_LENGTH = 160;
  readonly UPC_MAX_LENGTH = 20;
  readonly BARCODE_MAX_LENGTH = 20;
  readonly MAX_TAG_NUMBER = 20;
  readonly MAX_TAG_LENGTH = 20;
  readonly MAX_PRICE = 999999999;
  readonly MAX_DIMENSION = 9999;
  readonly MIN_WEIGHT = 0.01;

  productClasses: Array<products.IProductClass>;
  categories: Array<ICategory>;
  vendors: Array<IVendor>;
  attribute: Array<products.IProductAttribute>;
  mediaTypes: Array<drf.IChoice>;
  parentProduct: products.IProduct;
  variants: Array<products.IVariantSummary> = [];
  originalAttributeValues: { [key: string]: string | number | boolean };
  entity: products.IProduct;
  currentActive = 'general-info';
  Editor = ClassicEditor;
  editorConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'alignment',
        'indent',
        'outdent',
        '|',
        'imageUpload',
        'imageInsert',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        'undo',
        'redo',
        '|',
        'code',
        'codeBlock',
        'htmlEmbed',
        'fontColor',
        'fontSize',
        'fontFamily',
        'highlight',
        'horizontalLine'
      ]
    },
    language: 'en',
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:full',
        'imageStyle:side',
        'linkImage'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableCellProperties',
        'tableProperties'
      ]
    },
    licenseKey: '',
    placeholder: $localize`Input Description`
  };
  selectedProductClass: products.IProductClass;

  selectedVendor: INamedHrefEntity = null;
  selectedCategory: INamedHrefEntity = null;
  selectedProductClassValue: INamedHrefEntity = null;

  productRelatedSlug: string;
  productSlug: string;
  productFormType: string;
  virtualPackageAmount: number = null;
  totalPrice = 0;
  marketplaceLink = [];

  isAdvancePriceAvailable = false;
  confirmAdvancedPriceTitle = 'Update this product?';
  confirmAdvancedPriceText =
    'This product has an "Advanced Price", if you change the default price,' +
    ' it might impact on the “Advance Price" as well.';

  productRelatedFormData: FormData[] = [];
  enabledAttributes: INamedHrefEntity[] = [];
  mediaError: Array<string> = [];
  priceRangeEnabled = false;
  allowPriceSelector = false;

  @ViewChild(ProductMediaHostComponent) mediaHost: ProductMediaHostComponent;
  @ViewChild(PriceListHostComponent) priceListHost: PriceListHostComponent;
  @ViewChild(ProductAttributeHostComponent) attributeHost: ProductAttributeHostComponent;
  @ViewChild(ProductSubscriptonHostComponent) subscriptionHost: ProductSubscriptonHostComponent;
  @ViewChild(StockInputComponent) stockInput: StockInputComponent;
  @ViewChild(MarketplaceInfoHostComponent) marketplaceHost: MarketplaceInfoHostComponent;

  @ViewChild('productRecommendationModal') productRecommendationSelectionModal: ProductSelectionModalComponent;
  @ViewChild('productBundlingModal') productBundlingSelectionModal: ProductOnlineSelectionModalComponent;

  @ViewChild('vendorModal') vendorSelectionModal: VendorSelectionModalComponent;
  @ViewChild('categoryModal') categorySelectionModal: CategorySelectionModalComponent;
  @ViewChild('productClassModal') productClassSelectionModal: ProductClassSelectionModalComponent;

  // Confirm modal if product has advanced price
  @ViewChild(ConfirmModalComponent) confirmModal: ConfirmModalComponent;
  @ViewChild('inputTag') inputTag: ElementRef;

  priceListEnabled = false;

  tagForm: FormGroup;


  constructor(service: ProductService,
              private fb: FormBuilder,
              route: ActivatedRoute,
              toast: ToastService,
              private relatedService: ProductRelatedService,
              private configService: SiteConfigService,
              router: Router,
              svgIconService: SvgIconService,
              public modal: NgxSmartModalService,
              public productClassService: ProductClassService,
              private warehouseService: WarehouseService,
              private advancedPriceListService: AdvancedPriceListService,
              private marketplaceItemService: MarketplaceItemService) {
    super(route, router, toast, service);
    svgIconService.registerIcons();
  }

  get name(): FormControl {
    return this.form?.get('name') as FormControl;
  }

  get isActive(): FormControl {
    return this.form?.get('isActive') as FormControl;
  }

  get upc(): FormControl {
    return this.form?.get('upc') as FormControl;
  }

  get productClass(): FormControl {
    return this.form?.get('productClass').get('href') as FormControl;
  }

  get category(): FormControl {
    return this.form?.get('category').get('href') as FormControl;
  }

  get vendor(): FormControl {
    return this.form?.get('vendor').get('href') as FormControl;
  }

  get description(): FormControl {
    return this.form?.get('description') as FormControl;
  }

  get media(): FormArray {
    return this.form?.get('media') as FormArray;
  }

  get priceLists(): FormArray {
    return this.form?.get('priceLists') as FormArray;
  }

  get attributes(): FormGroup {
    return this.form?.get('attributes') as FormGroup;
  }

  get related(): FormArray {
    return this.form?.get('related') as FormArray;
  }

  get weight(): FormControl {
    return this.form?.get('weight') as FormControl;
  }

  get price(): FormControl {
    return this.form?.get('price') as FormControl;
  }

  get priceSelector(): FormControl {
    return this.form?.get('priceSelector') as FormControl;
  }

  get dimensions(): FormGroup {
    return this.form?.get('dimensions') as FormGroup;
  }

  get currentHeight(): FormControl {
    return this.dimensions?.get('currentHeight') as FormControl;
  }

  get currentLength(): FormControl {
    return this.dimensions?.get('currentLength') as FormControl;
  }

  get currentWidth(): FormControl {
    return this.dimensions?.get('currentWidth') as FormControl;
  }


  get parent(): FormControl {
    return this.form?.get('parent') as FormControl;
  }

  get structure(): FormControl {
    return this.form?.get('structure') as FormControl;
  }

  get tags(): FormArray {
    return this.form?.get('tags') as FormArray;
  }

  get seoMeta(): FormControl {
    return this.form?.get('seoMeta') as FormControl;
  }

  get seoDescription(): FormControl {
    return this.form?.get('seoDescription') as FormControl;
  }

  get subscription(): FormGroup {
    return this.form?.get('subscription') as FormGroup;
  }

  get marketplace(): FormGroup {
    return this.form?.get('marketplace') as FormGroup;
  }

  get productRelated(): FormArray {
    return this.form.get('productRelated') as FormArray;
  }

  get productBundling(): FormArray {
    return this.form.get('bundle') as FormArray;
  }

  get isProductOptionDomain(): boolean {
    let pc;
    if (!!this.selectedProductClass) {
      pc = this.selectedProductClass;
    }
    if (!!pc && (pc.type === 'subscription' && pc.option)) {
      return true;
    }
    return false;
  }

  get barcode(): FormControl {
    return this.form?.get('barcode') as FormControl;
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.productRecommendationSelectionModal.onClose.subscribe(() => this.onProductRecommendationSelectionModalClosed());
    this.vendorSelectionModal.onClose.subscribe(() => this.onVendorSelectionModalClosed());
    this.categorySelectionModal.onClose.subscribe(() => this.onCategorySelectionModalClosed());
    this.productClassSelectionModal.onClose.subscribe(() => this.onProductClassSelectionModalClosed());
    this.productBundlingSelectionModal.onClose.subscribe(() => this.onProductBundlingSelectionModalClosed());
    this.confirmModal.onClose.subscribe(() => this.onConfirmModalClosed());

    this.price.valueChanges.pipe(debounceTime(150)).subscribe((value) => {
      logger.debug('priceChange');
      this.priceChange(value);
    });
    this.priceSelector.valueChanges.pipe(debounceTime(150)).subscribe(value => {
      logger.debug('priceSelectorSubscribe', value);
      if (value === true) {
        this.price.disable({emitEvent: false});
        this.price.clearValidators();
        this.price.setValidators([Validators.min(1), Validators.max(this.MAX_PRICE)]);
        this.priceRangeEnabled = false;
      } else {
        if (!this.isAdvancePriceAvailable) {
          // Default price field will not be enabled if there is an advance price
          this.price.enable({emitEvent: false});
          this.price.clearValidators();
          this.price.setValidators([Validators.required, Validators.min(1), Validators.max(this.MAX_PRICE)]);
        }
        this.priceRangeEnabled = true;
      }
    });
    this.priceLists.valueChanges.subscribe((val: Array<IPriceList>) => {
      logger.debug('priceListChange', val);
      const hasMorePriceList = val.length > 1;
      const hasMorePriceRange = val.every((cur, idx) => {
        return cur.ranges.length > 1;
      });
      // this.priceRangeEnabled = hasMorePriceList || hasMorePriceRange;
      this.allowPriceSelector = !hasMorePriceList;
      if (this.allowPriceSelector) {
        this.priceSelector.enable();
      } else {
        this.priceSelector.disable();
      }
      this.price.setValue(val[0].ranges[0].price, {emitEvent: false});

    });
  }

  getSlugFromHref(href: string): string {
    const r = /^.+\/(.+?)\/$/.exec(href);
    if (r) {
      return r[1];
    }
    return null;
  }

  ngOnInit(): void {
    this.productSlug = this.route.snapshot.paramMap?.get('slug');
    this.route.data.subscribe((
      data: {
        entity: products.IProduct, parent: products.IProduct,
        mediaTypes: drf.IChoice[]
      }) => {
      this.parentProduct = data.parent;
      this.mediaTypes = data.mediaTypes;
      this.entity = data.entity;
    });

    this.getMarketplaceLinks();
    this.getProductFormType();
    this.getAdvancePrice();
    this.tagForm = this.fb.group({
      tag: ['', [Validators.pattern(/^[A-Za-z0-9]*$/),
        Validators.maxLength(this.MAX_TAG_LENGTH)]]
    });
    super.ngOnInit();
  }

  get tag(): FormControl {
    return this.tagForm.get('tag') as FormControl;
  }


  /**
   * Configures the form that is edited in this component.
   *
   * Special notes related to the ProductComponent:
   * 1. There is differing logic depending on whether we're initializing a parent or a child (variant)
   * 2. From a parent, the variants array is READ-ONLY at the API, so we DO NOT set it on this form. - + [ ] / \ . & ! _
   */
  initializeForm(entity?: products.IProduct) {
    let bundleInitialValue = this.fb.array([]);
    if (this.productFormType !== 'bundling') {
      bundleInitialValue = null;
    }
    if (!!entity) {
      const hasMorePriceList = entity.priceLists.length > 1;
      this.priceRangeEnabled = entity.priceLists.every((cur, idx) => {
        return cur.ranges.length > 1;
      }) || hasMorePriceList;
      this.allowPriceSelector = !hasMorePriceList;
    }
    this.form = this.fb.group({
      name: [entity?.name, [
        Validators.required,
        Validators.maxLength(120),
        Validators.pattern(/^[A-Za-z0-9-_ &!+/\\\[\].()]*$/)]],
      isActive: [entity?.isActive, []],
      parent: [entity?.parent],
      href: [entity?.href],
      upc: [entity?.upc, [Validators.required,
        Validators.maxLength(this.UPC_MAX_LENGTH),
        Validators.pattern('^[A-Z0-9a-z-/&_]+$')]],
      structure: [entity?.structure ?? 'parent', [Validators.required,]],
      description: [entity?.description, [
        Validators.required,
        Validators.minLength(this.DESCRIPTION_MIN_LENGTH),
        Validators.maxLength(this.DESCRIPTION_MAX_LENGTH)]],
      weight: [entity?.weight, [Validators.required, Validators.min(this.MIN_WEIGHT), Validators.max(this.MAX_DIMENSION)]],
      price: [null, [Validators.max(this.MAX_PRICE), Validators.min(1)]],
      priceSelector: [this.priceRangeEnabled, []],
      dimensions: this.fb.group({
        currentLength: [entity?.dimensions?.currentLength, [
          Validators.required,
          Validators.min(1),
          Validators.max(this.MAX_DIMENSION),
        ]],
        currentWidth: [entity?.dimensions?.currentWidth, [
          Validators.required,
          Validators.min(1),
          Validators.max(this.MAX_DIMENSION),
        ]],
        currentHeight: [entity?.dimensions?.currentHeight, [
          Validators.required,
          Validators.min(1),
          Validators.max(this.MAX_DIMENSION),
        ]]
      }),
      productClass: this.fb.group({href: [entity?.productClass.href, [Validators.required]]}),
      category: this.fb.group({href: [entity?.category.href, [Validators.required]]}),
      vendor: this.fb.group({href: [entity?.vendor?.href, [Validators.required]]}),
      media: this.fb.array([]),
      attributes: this.fb.group({}),
      marketplace: this.fb.group({}),
      priceLists: this.fb.array([]),
      seoMeta: [entity?.seoMeta, [Validators.maxLength(this.SEO_MAX_LENGTH)]],
      seoDescription: [entity?.seoDescription, [Validators.maxLength(this.SEO_MAX_LENGTH)]],
      tags: this.fb.array([], [NusantaraValidators.preventArrayDuplicates()]),
      subscription: this.fb.group({}),
      productRelated: this.fb.array([]),
      bundle: bundleInitialValue,
      barcode: [entity?.barcode, [Validators.required,
        Validators.maxLength(this.BARCODE_MAX_LENGTH),
        Validators.pattern('^[A-Z0-9]+$'),
      ]],
    });


    this.selectedVendor = entity?.vendor;
    this.selectedCategory = entity?.category;
    this.selectedProductClassValue = entity?.productClass;

    if (this.priceRangeEnabled) {
      this.priceSelector.setValue(true);
      this.price.disable();
    } else {
      this.price.enable();
      this.priceSelector.setValue(false);
    }
    if (this.allowPriceSelector) {
      this.priceSelector.enable();
    } else {
      this.priceSelector.disable();
    }

    // new product variant
    if (!entity && !!this.parentProduct) {
      this.parent.setValue(this.parentProduct.href);
      this.structure.setValue('child');

      // mandatory inheritance from parent
      this.productClass.setValue(this.parentProduct.productClass.href);
      this.category.setValue(this.parentProduct.category.href);
      this.vendor.setValue(this.parentProduct.vendor.href);

      this.selectedVendor = this.vendor.value;
      this.selectedCategory = this.category.value;
      this.selectedProductClassValue = this.productClass.value;

      // optional inheritance from parent
      this.description.setValue(this.parentProduct.description);
    }

    this.variants = entity?.variants ?? [];
    this.originalAttributeValues = entity?.attributes ?? {};
    if (!!this.productSlug) {
      this.relatedService.fetch(this.productSlug)
        .subscribe((data: products.IProductRelation[]) => {
          if (data) {
            for (const prod of data) {
              this.addProductRelation(prod);
            }
          }
        });
    }
    for (const t of entity?.tags ?? []) {
      this.addTag(t);
    }

    // listen for any changes to this, so we can disable weight when appropriate
    this.onProductClassChanged(this.productClass.value?.href ?? this.productClass.value);
    // #NOTE: this causing enabled attributes cannot keep their data since product class keep changed
    //        onProductClassChanged called even though previous code already set that value
    // this.productClass.valueChanges.subscribe(val => this.onProductClassChanged(val));
    if (!this.parentProduct) {
      this.enabledAttributes = entity?.enabledAttributes ?? [];
    } else {
      this.enabledAttributes = this.parentProduct.enabledAttributes ?? [];
    }
    if (!this.enterpriseLicense()) {
      this.price.clearValidators();
      this.price.setValidators([Validators.minLength(0), Validators.max(999999999), Validators.min(1)]);
      this.price.updateValueAndValidity();
    }
    this.form.markAllAsTouched();
  }

  initializeSubViewForms(entity?: products.IProduct) {
    for (const priceList of entity?.priceLists ?? []) {
      this.priceListHost?.addPriceList(priceList);
      this.price.setValue(priceList?.ranges[0]?.price);
    }
    // if the product doesn't have a pricelist, we automatically add one.
    if (!entity?.priceLists.length) {
      this.priceListHost?.addPriceList({
        href: null,
        product: this.href.value,
        type: 'default',
        platforms: [],
        locations: [],
        isProgressive: false,
        ranges: [
          {href: null, priceList: null, price: null, minQuantity: 1, maxQuantity: null}
        ]
      });
    }

    for (const media of entity?.media ?? []) {
      this.mediaHost.add(media);
    }

    if (entity?.subscription) {
      this.subscriptionHost.add(entity?.subscription);
    }

    this.addProductBundling(entity);
  }

  /**
   * Overridden implementation: This form hosts several sub-views, which must
   * be saved separate of the main product:  Because of that, the data
   * must be deleted from the data we pass to the product service.
   */
  getFormValue(): any {
    const formValue = {};
    this.form.value.productRelated.forEach((v) => {
      delete v.name, delete v.href;
    });
    Object.assign(formValue, this.form.value);

    if (!formValue.hasOwnProperty('attributes')) {
      formValue['attributes'] = {};
    } else {
      Object.keys(formValue['attributes']).forEach((key) => {
        if (typeof formValue['attributes'][key] === 'boolean') {
          formValue['attributes'][key] = formValue['attributes'][key].toString();
        }
      });
    }

    // delete sub entities that shouldn't be saved on the primary object
    // like price-lists, media, dll.
    delete (formValue as products.IProduct).media;
    delete (formValue as products.IProduct).priceLists;
    delete (this.form.value.marketplace);

    formValue['enabledAttributes'] = this.enabledAttributes;

    return formValue;
  }

  onConfirmModalClosed() {
    if (this.confirmModal.result === DialogResult.OK) {
      this.save();
    }
  }

  getAdvancePrice() {
    if (!!this.productSlug) {
      this.advancedPriceListService.search_by_product_slug(this.productSlug).pipe(catchError(err => {
        logger.debug('Cannot get advanced price');
        logger.debug(err);
        return of(EMPTY);
      })).subscribe((data: Array<IAdvancedPriceList>) => {
        this.isAdvancePriceAvailable = data.length > 0;
        if (this.isAdvancePriceAvailable) {
          this.price.disable({emitEvent: false});
        }
      });
    }
  }

  preSave() {
    if (!!this.productSlug) {
      // If the product has an advanced price and the price list has been touched (assuming the user changed it),
      // open the warning confirmation modal
      if (this.isAdvancePriceAvailable && !this.priceLists.pristine) {
        this.confirmModal.open();
        return;
      }
    }
    this.save();
  }

  save() {
    if (this.isValidForm()) {
      this.setSinglePrice(null);
      this.service.save(this.getFormValue()).pipe(catchError(err => {
        logger.debug('err', err);
        if (err instanceof HttpErrorResponse) {
          return of(new ErrorResult<IError>(err.error, err.status));
        } else {
          return of(new ErrorResult<IError>({message: 'Network error.. probably?'}, err.status));
        }
      })).subscribe(resp => {
          if (resp instanceof ErrorResult) {
            this.onSaveError(resp);
          } else {
            if (this.isProductOptionDomain) {
              this.subscriptionHost.save(resp.entity).subscribe(() => {
              });
            }

            if (!this.enterpriseLicense()) {
              this.stockInput.save(resp.entity).subscribe(() => {
              });
            }

            this.mediaHost?.saveAll(resp.entity)?.subscribe(() => {
            });
            this.validatePriceList();
            if (this.priceListHost.validatePriceListHost()) {
              this.priceListHost.saveAll(resp.entity).pipe(catchError(childErr => {
                if (childErr instanceof HttpErrorResponse) {
                  return of(new ErrorResult<IError>(childErr.error, childErr.status));
                } else {
                  return of(new ErrorResult<IError>({message: 'Network error.. probably?'}, childErr.status));
                }
              })).subscribe((childResp) => {
                  if (childResp instanceof ErrorResult) {
                    this.onSaveError(childResp);
                  } else {
                    this.onSaveSuccess(resp);
                  }
                }
              );
            }
            if (this.productRelatedFormData.length > 0) {
              const savedProductEntity = resp.entity as IProduct;
              this.productRelatedFormData.forEach((productRelatedForm) => {
                productRelatedForm['primary'] = getSlugFromHref(savedProductEntity.href);
                this.updateProductRelation(productRelatedForm, 'add');
              });
            }
          }
        }
      );
      if (!this.isNew && this.isPhysical() && this.enterpriseLicense()) {
        this.marketplaceHost?.saveAll();
      }
    } else {
      this.validatePriceList();
    }
    if(!this.form.errors) {
      this.form.valid
    }
    this.form.enable();
  }

  validatePriceList() {
    this.priceListHost?.priceLists.forEach((priceList) => {
      logger.debug('pricelist', priceList.validatePriceList());
      priceList.rangeComponents.forEach((component) => {
        logger.debug('validate', component.validatePriceRange(), component.maxQuantity.value);
      });
    });
  }

  addVariant() {
    this.router.navigate(['./variants/new'], {relativeTo: this.route});
  }

  addTag(value?: string) {
    if (!!value) {
      this.tags.push(
        this.fb.control(value, [Validators.required])
      );
    }
  }

  addRelatedProduct() {
    throw Error('Not Implemented');
  }

  getMarketplaceLinks() {
    if (this.entity) {
      this.marketplaceItemService.getItemMarketplaceInfo(this.entity.id).subscribe((resp) => {
        this.marketplaceLink = resp.links;
      });
    }
  }

  open() {
    document.getElementById('transform').classList.add('hover-rotate');
    // document.getElementById("down").classList.toggle("show");
  }

  close() {
    document.getElementById('transform').classList.remove('hover-rotate');
  }

  openLink(link) {
    window.open(link);
  }

  navigateToParent(warnOnDirty: boolean = false) {
    if (this.structure.value === 'parent' && this.productFormType !== 'bundling') {
      super.navigateToParent(warnOnDirty);
    } else {
      this.router.navigateByUrl('/catalog/products',);
    }
  }

  /**
   * Disables irrelevant/invalid product values for certain classes of product.
   */
  onProductClassChanged(newValue: any) {
    // protect against triggering during initialization
    if (!newValue) {
      return;
    }
    this.productClassService.fetch(getSlugFromHref(newValue)).pipe(catchError((err) => {
      logger.error('Cannot get correct product class');
      return of(EMPTY);
    })).subscribe((res) => {
      if (!!res) {
        const productClass = res as IProductClass;
        // const productClass = this.productClasses.filter(e => e.href === newValue)[0];
        if (!!this.selectedProductClass && this.selectedProductClass !== productClass) {
          this.enabledAttributes = [];
        }
        this.selectedProductClass = productClass;
        // const productClass = this.selectedProductClass;

        if (productClass?.type === 'physical') {
          this.weight.enable();
          Object.keys(this.dimensions.controls).forEach(key => {
            this.dimensions.controls[key].enable();
          });
        } else {
          this.weight.disable();
          Object.keys(this.dimensions.controls).forEach(key => {
            this.dimensions.controls[key].disable();
          });
        }
        this.form.setControl('attributes', this.fb.group({}));
      } else {
        this.selectedProductClass = null;
        this.weight.disable();
        Object.keys(this.dimensions.controls).forEach(key => {
          this.dimensions.controls[key].disable();
        });
      }
    });
  }

  isPhysical() {
    return this.selectedProductClass?.type === 'physical';
  }

  enterpriseLicense() {
    return this.configService.isEnterpriseLicense();
  }

  setSinglePrice(event) {
    if (!this.priceSelector.value || !this.enterpriseLicense()) {
      if (this.priceListHost.form.controls.length > 1) {
        const x = 1;
        const currentLength = this.priceListHost.form.controls.length;
        while (this.priceListHost.form.controls.length > 1) {
          this.priceListHost.removePriceList(1);
        }
      }
      try {
        for (let x = this.priceListHost.priceLists.first.rangeComponents.length; x > 1; x--) {
          this.priceListHost.priceLists.first.rangeComponents.get(x - 1).remove.emit(this.priceListHost.priceLists.first.rangeComponents.get(x - 1));
        }
        this.priceListHost.priceLists.first.rangeComponents.get(0).price.setValue(this.price.value);
      } catch (e) {
        logger.error(e);
      }

      // for (const priceList of this.entity?.priceLists ?? []) {
      //   priceList.ranges[0].price = this.price.value;
      //   // this.priceListHost.updatePriceList(priceList, 0);
      // }

      // if (this.priceListHost.form.controls.length > 1) {
      //   this.priceListHost.updatePriceList({
      //     href: null,
      //     product: this.href.value,
      //     type: 'default',
      //     platforms: [],
      //     locations: [],
      //     isProgressive: false,
      //     ranges: [
      //       {href: null, priceList: null, price: this.price.value, minQuantity: 1, maxQuantity: null}
      //     ]
      //   }, 0);
      //
      // } else if (!this.entity?.priceLists[0].ranges.length) {
      //   this.entity?.priceLists[0].ranges.push({
      //     href: null,
      //     priceList: null,
      //     price: this.price.value,
      //     minQuantity: 1,
      //     maxQuantity: null
      //   });
      //   this.priceListHost.updatePriceList(this.entity?.priceLists[0], 0);
      // } else {
      //   for (const priceList of this.entity?.priceLists ?? []) {
      //     priceList.ranges[0].price = this.price.value;
      //     this.priceListHost.updatePriceList(priceList, 0);
      //   }
      // }
    } else {
      logger.debug('Price range is disabled');
    }
  }

  scrollTo(id: string) {
    const elmnt = document.getElementById(id);
    elmnt.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
    this.currentActive = id;
  }

  getFormErrors(form: AbstractControl) {
    if (form instanceof FormControl) {
      // Return FormControl errors or null
      return form.errors ?? null;
    }
    if (form instanceof FormGroup) {
      const groupErrors = form.errors;
      // Form group can contain errors itself, in that case add'em
      const formErrors = groupErrors ? {groupErrors} : {};
      Object.keys(form.controls).forEach(key => {
        // Recursive call of the FormGroup fields
        const error = this.getFormErrors(form.get(key));
        if (error !== null) {
          // Only add error if not null
          formErrors[key] = error;
        }
      });
      // Return FormGroup errors or null
      return Object.keys(formErrors).length > 0 ? formErrors : null;
    }
  }

  isValidForm(): boolean {
    this.mediaError = [];
    if (!this.mediaHost.validateMedia()) {
      this.mediaError.push('Media requirement not match. Need at least 3 image and max 9 image, max 1 video');
    }
    return this.form.valid && this.mediaHost.validateMedia() && this.priceListHost.validatePriceListHost();
  }

  selectProduct() {
    this.productRecommendationSelectionModal.open();
  }

  showErrorToast(errMsg: string) {
    this.toast?.addMessage(errMsg, 'error', ToastLevelEnum.error);
  }

  showInfoWindow(resp, action) {
    if (action === 'remove') {
      this.toast?.addMessage(resp, 'Successfully Removed', ToastLevelEnum.info);
    } else {
      this.toast?.addMessage(resp, 'Successfully Add', ToastLevelEnum.success);
    }
  }

  apiPostRelatedProduct(productValue: FormData, action, product, index = 0) {
    delete productValue['name'];
    delete productValue['href'];
    let actionStatus = 'add';

    if (action === 'remove') {
      productValue['action'] = 'remove';
      actionStatus = 'remove';
    }
    if (action === 'add') {
      // if "add" then it will be pushed to array
      this.productRelated.push(product);
      this.productRelatedFormData.push(productValue);
    } else {
      // this will remove from the table if remove success
      this.productRelated.removeAt(index);
      this.productRelatedFormData.splice(index, 1);
      if (!!this.entity) {
        this.updateProductRelation(productValue, actionStatus);
      }
    }

  }

  removeRelated(index: number) {
    const prevRelated = this.productRelated.at(index).value;
    this.apiPostRelatedProduct(prevRelated, 'remove', this.productRelated, index);
  }

  addProductRelation(product: products.IProductRelation) {
    this.productRelated.push(
      this.fb.group({
        primary: [getSlugFromHref(this.entity?.href)],
        relation: [product.slug, []],
        name: [product.name, []],
        href: [product.href, []],
        action: 'add'
      }));
  }

  onProductRecommendationSelectionModalClosed() {
    if (this.productRecommendationSelectionModal.result === DialogResult.OK) {
      const selectedProduct = this.productRecommendationSelectionModal.product.value as products.IProductRelation;
      const productRelatedSlug = getSlugFromHref(this.productRecommendationSelectionModal.product.value.href);
      const primarySlug = getSlugFromHref(this.entity?.href);

      const f = this.fb.group({
        primary: [primarySlug, []],
        relation: [productRelatedSlug, []],
        name: [selectedProduct.name, []],
        href: [selectedProduct.href, []],
        action: 'add'
      });

      this.apiPostRelatedProduct(f.value, 'add', f);
    }
  }

  selectVendor(): void {
    this.vendorSelectionModal.open();
  }

  selectCategory(): void {
    this.categorySelectionModal.open();
  }

  selectProductClass(): void {
    this.productClassSelectionModal.open();
  }

  addBundling(): void {
    this.productBundlingSelectionModal.open();
  }

  onProductBundlingSelectionModalClosed() {
    if (this.productBundlingSelectionModal.result === DialogResult.OK) {

      const selectedProduct = this.productBundlingSelectionModal.product.value as IProduct;
      const selectedProductPrice = this.defaultProductPriceForBundling(selectedProduct);
      const isSameProduct = this.getSameProductBundlingIndex(selectedProduct.name);

      if (isSameProduct !== -1) {
        logger.debug('productBundling', this.productBundling.value);
        const currentQty = this.productBundling.at(isSameProduct).value.quantity;
        this.productBundling.at(isSameProduct).patchValue({quantity: Number(currentQty) + 1});
        logger.debug('productBundling', this.productBundling.value);
      } else {
        const defaultQty = 1;

        const f = this.fb.group({
          product: [{
            href: selectedProduct.href,
            name: selectedProduct.name
          }, []],
          name: [selectedProduct.name, []],
          upc: [selectedProduct.upc, []],
          weight: [selectedProduct.weight, []],
          quantity: [defaultQty, Validators.required],
          price: [selectedProductPrice, []],
          media: [selectedProduct.media, []]
        });
        this.productBundling.push(f);
        logger.debug(this.productBundling);
        this.setProductBundlingMedia(selectedProduct);
      }
      this.updateVirtualAmountAndPriceListAndWeight();
    }
  }

  private onVendorSelectionModalClosed(): void {
    if (this.vendorSelectionModal.result === DialogResult.OK) {
      this.selectedVendor = this.vendorSelectionModal.vendor.value as IVendor;
      this.vendor.setValue(this.selectedVendor.href);
    }
  }

  private onCategorySelectionModalClosed(): void {
    if (this.categorySelectionModal.result === DialogResult.OK) {
      this.selectedCategory = this.categorySelectionModal.category.value as ICategory;
      this.category.setValue(this.selectedCategory.href);
    }
  }

  private onProductClassSelectionModalClosed() {
    if (this.productClassSelectionModal.result === DialogResult.OK) {
      this.selectedProductClassValue = this.productClassSelectionModal.productClass.value as IProductClass;
      this.selectedProductClass = this.productClassSelectionModal.productClass.value as IProductClass;
      this.productClass.setValue(this.selectedProductClassValue.href);
    }
  }

  private getProductFormType(): void {
    this.route.params?.subscribe((param) => {
      if (param) {
        this.productFormType = param.type;
      }
    });
    if (!!this.entity?.bundle && this.entity.bundle.length > 0) {
      this.productFormType = 'bundling';
    }
  }

  private defaultProductPriceForBundling(selectedProduct: IProduct) {
    const productRanges = selectedProduct.priceLists.filter((priceList) => priceList.type === 'default')[0].ranges[0];

    if (productRanges) {
      return productRanges.price;
    }

    return 0;
  }

  getVirtualPackageAmount(): void {
    const bundle: Array<{ product: string, quantity: number }> = [];
    this.totalPrice = 0;
    this.virtualPackageAmount = null;
    this.productBundling.controls.forEach((product) => {
      const productValue = product.value as IBundleStockSearch;
      if (!!productValue.quantity) {
        if (typeof productValue.product === 'string') {
          bundle.push({
            product: productValue.product,
            quantity: productValue.quantity
          });
          this.totalPrice += productValue.price * productValue.quantity;
        } else {
          const newProductValue = product.value as IProductBundle;
          bundle.push({
            product: newProductValue.product.href,
            quantity: newProductValue.quantity
          });
          this.totalPrice += newProductValue.price * newProductValue.quantity;
        }
      }
    });
    if (!!bundle && bundle.length > 0) {
      this.warehouseService.warehouseStockBundleSearch(bundle).subscribe((resp) => {
        this.virtualPackageAmount = resp.length > 0 ? resp[0].quantity : 0;
      });
    }

  }

  removeProductBundling(index: number): void {
    this.removeProductBundlingMedia(this.productBundling.at(index).value);
    this.productBundling.removeAt(index);
    this.updateVirtualAmountAndPriceListAndWeight();
  }

  addProductBundling(entity: IProduct): void {
    if (!!entity?.bundle) {
      entity?.bundle?.forEach((productInfo) => {
        const f = this.fb.group({
          product: [{
            href: productInfo.product.href,
            name: productInfo.product.name
          }, []],
          name: [productInfo.product.name, []],
          upc: [productInfo.product.upc, []],
          weight: [productInfo.product.weight, []],
          quantity: [productInfo.quantity, Validators.required],
          media: [productInfo.product.media, []],
          price: [productInfo.product.defaultPrice, []]
        });
        this.productBundling.push(f);
      });

      logger.debug(this.productBundling);
      this.getVirtualPackageAmount();
    }
  }

  showNonBundlingComponent(): boolean {
    if (!this.entity) {
      return false;
    } else if (!!this.entity && !!this.entity.bundle && this.entity.bundle.length > 0) {
      return false;
    }
    return true;
  }

  private setDescription(): void {
    let productBundlingDescription = '';

    if (!this.description.dirty && !this.entity) {
      if (this.productBundling.length === 0) {
        productBundlingDescription = '';
      } else {
        productBundlingDescription = 'Paket berisi : ';
        productBundlingDescription += '<ul>';

        for (const product of this.productBundling.value) {
          productBundlingDescription += '<li>' + product.quantity + ' ' + product.name + '</li><br>';
        }
        productBundlingDescription += '</ul>';

      }
      this.description.setValue(productBundlingDescription);
    }
  }

  private setWeight(): void {
    let totalWeight = 0;
    if (!this.entity) {
      for (const product of this.productBundling.value) {
        totalWeight += (product.weight * product.quantity);
      }

      this.weight.patchValue(totalWeight);
    }
  }

  private setProductBundlingMedia(selectedProduct: IProduct): void {
    const productMedia = selectedProduct.media;
    const firstImage = productMedia.find((img) => img.type === 'image');
    const firstVideo = productMedia.find((video) => video.type === 'you_tube');
    if (!this.entity) {
      if (!!firstImage) {
        this.mediaHost.add(firstImage);
      }

      if (!!firstVideo) {
        this.mediaHost.add(firstVideo);
      }
    }

  }

  private getSameProductBundlingIndex(name: string): number {
    return this.productBundling.value.findIndex((product) => product.name === name);
  }

  private setPriceProductBundling(): void {
    if (!this.entity) {
      if (!this.entity?.priceLists) {
        this.priceListHost?.updatePriceList({
          href: null,
          product: null,
          type: 'default',
          platforms: [],
          locations: [],
          isProgressive: false,
          ranges: [
            {href: null, priceList: null, price: this.totalPrice, minQuantity: 1, maxQuantity: null}
          ]
        }, 0);
      } else {
        for (const priceList of this.entity?.priceLists ?? []) {
          priceList.ranges[0].price = this.totalPrice;
          this.priceListHost.updatePriceList(priceList, 0);
        }
      }
    }
  }

  updateVirtualAmountAndPriceListAndWeight(): void {
    this.getVirtualPackageAmount();
    this.setPriceProductBundling();
    this.setWeight();
    this.setDescription();
  }

  private removeProductBundlingMedia(product: any): void {
    if (!this.entity) {
      if (!!this.mediaHost.entities) {
        const removeImage = this.mediaHost.entitiesImage.findIndex((x) => {
          return (x.product === product.href || x.product === product.product.href) && x.type === 'image';
        });
        if (removeImage !== -1) {
          this.mediaHost.removeImage(removeImage);
        }
        const removeVideo = this.mediaHost.entitiesVideo.findIndex((x) => {
          return (x.product === product.href || x.product === product.product.href) && x.type === 'you_tube';
        });
        if (removeVideo !== -1) {
          this.mediaHost.removeVideo(removeVideo);
        }
      }
    }
  }

  protected onSaveSuccess(result: IResultResponse<any>) {
    this.form.enable();
    this.toast?.addMessage(`"${this.form.get('name')?.value ?? 'data'}" was saved successfully.`, 'Saved', ToastLevelEnum.success);
    this.navigateToParent();
  }

  protected onDeleteSuccess() {
    this.form.enable();
    const message = this.form.get('name')?.value ?? this.form.get('title')?.value;
    this.toast?.addMessage(`"${message}" was deleted successfully.`, 'Deleted', ToastLevelEnum.success);
    this.navigateToParent(false);
  }

  copyUpcToBarcode() {
    const upc = this.upc.value;
    this.barcode.setValue(upc);
  }

  updateProductRelation(productValue: FormData, actionStatus: string) {
    this.relatedService.post(productValue).subscribe(
      (resp) => {
        this.showInfoWindow(resp.status, actionStatus);
      },
      (err) => {
        this.showErrorToast(err.error.relation);
      }
    );
  }

  private priceChange(value: any): void {
    this.priceListHost.priceLists.forEach(
      (item, idx, arr) => {
        item.rangeComponents.get(0).price.setValue(this.price.value);
      }
      );
  }
}
