import { StockInputComponent } from './stock-input/stock-input.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@gdnnusantara/ckeditor5-build/build/ckeditor';
import { NgxSmartModalService } from 'ngx-smart-modal';
import {EMPTY, of} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  ProductRelatedService,
  ProductService,
  SiteConfigService,
  SvgIconService,
  WarehouseService,
  ProductClassService, AdvancedPriceListService
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
import { drf, ICategory, INamedHrefEntity, IVendor, products } from '@nusantara/models';
import { IError} from '@nusantara/models/base/error';
import { PriceListHostComponent} from './price';
import { ProductMediaHostComponent} from './media';
import { ProductAttributeHostComponent} from './attribute';
import { ProductSubscriptonHostComponent} from './subscription';
import { MarketplaceInfoHostComponent} from './marketplace';

import { ProductSelectionModalComponent, VendorSelectionModalComponent } from '@nusantara/shared';
import { IProduct, IProductClass } from '@nusantara/models/products';
import { CategorySelectionModalComponent } from '@nusantara/shared/modals/category-selection-modal.component';
import { ProductClassSelectionModalComponent } from '@nusantara/shared/modals/product-class-selection-modal.component';
import { ProductOnlineSelectionModalComponent } from '@nusantara/shared/product-online-selection-modal.component';
import { IBundleStockSearch } from '@nusantara/models/products/stock-search';
import { IProductBundle } from '@nusantara/models/products/product-bundle';
import { ConfirmModalComponent } from '@nusantara/shared/confirm-modal.component';
import { IAdvancedPriceList } from '@nusantara/models/products/advanced-price-list';

const log = new Logger('ProductComponent');

/**
 * Allows the user to edit/create a single product.
 */
@Component({
  selector: 'nus-product',
  template: `
    <nus-detail-title [originalName]="originalEntityName" typeName="Product"></nus-detail-title>
    <div class="container">
      <div>
        <nus-non-field-errors
          [nonFieldErrors]="nonFieldErrors">
        </nus-non-field-errors>

        <form [formGroup]="form" (ngSubmit)="preSave()" class="fluid">
          <div id="general-info" class="wrapper">
            <h1 class="heading-1" i18n>General Information</h1>
            <label>
              <span i18n>Name</span>
              <input type="text"
                     [formControl]="name"
                     name="name"
                     placeholder="Input Name"
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
                  <input type="text" (click)="selectCategory()" readonly [value]="selectedCategory?.name"
                         data-qa="category-pop">
                  <!--                  <select [formControl]="category" name="category" data-qa="category">-->
                  <!--                    <option *ngFor="let c of categories" [ngValue]="c.href">-->
                  <!--                      {{ c.pathName }}-->
                  <!--                    </option>-->
                  <!--                  </select>-->
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
                  <input type="text" (click)="selectProductClass()" readonly [value]="selectedProductClassValue?.name"
                         data-qa="product-class-pop">
                  <!--                  <select [formControl]="productClass" name="product-class" data-qa="product-class">-->
                  <!--                    <option *ngFor="let pc of productClasses" [ngValue]="pc.href">-->
                  <!--                      {{ pc.name }}-->
                  <!--                    </option>-->
                  <!--                  </select>-->
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
                *ngIf="originalAttributeValues">
              </nus-product-attribute-host>
            </div>
          </div>

          <div id="product-bundling" class="wrapper" *ngIf="productFormType === 'bundling' ">
            <h1 class="heading-1">Product Bundling</h1>
            <label>
              <span>Bundling Table (Optional)</span>
              <table style="margin-bottom: 16px; table-layout: fixed;">
                <thead>
                <tr>
                  <th class="product-name">Product Name</th>
                  <th>UPC</th>
                  <th>Weight</th>
                  <th>Qty</th>
                  <th>Price Perunit</th>
                  <th>Remove</th>
                </tr>
                </thead>
                <tbody>

                <nus-bundle-line *ngFor="let control of productBundling.controls; let i=index"
                                 [formGroup]="control" (remove)="removeProductBundling(i)"
                                 (update)="updateVirtualAmountAndPriceListAndWeight()">
                </nus-bundle-line>
                <tr class="total-price">
                  <td colspan="5">
                    Total
                  </td>
                  <td class="price">
                    {{ totalPrice | currency: 'Rp ': 'symbol' : '1.0' }}
                  </td>
                </tr>
                </tbody>
              </table>
              <button (click)="addBundling()" type="button" class="new-add-button wide">
                <i class="material-icons">add</i> Add Product
              </button>
              <div *ngIf="virtualPackageAmount !== null" class="package-info">
                <div class="label">Total Potential Virtual Stock</div>
                <div class="stock-amount">{{ virtualPackageAmount }} package</div>
              </div>
            </label>

          </div>

          <div id="product-info" class="wrapper">
            <h1 class="heading-1" i18n>Product Information</h1>

            <div class="rich-text-container">
              <label for="content" class="external"><span i18n>Description</span></label>
              <ckeditor [editor]="Editor" [config]="editorConfig"
                        [formControl]="description"
                        id="description"
                        name="description"
                        data-qa="description">
              </ckeditor>
              <nus-field-errors [control]="description"></nus-field-errors>
            </div>

            <label *ngIf="structure.value === 'parent'">
              <span i18n>Vendor</span>
              <div class="manage">
                <div>
                  <input type="hidden" [formControl]="vendor" data-qa="vendor">
                  <input type="text" (click)="selectVendor()" readonly [value]="selectedVendor?.name"
                         data-qa="vendor-pop">
                  <!--                  <select [formControl]="vendor" name="vendor" data-qa="vendor">-->
                  <!--                    <option *ngFor="let v of vendors" [ngValue]="v.href">-->
                  <!--                      {{ v.name }}-->
                  <!--                    </option>-->
                  <!--                  </select>-->
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
                <span i18n>Variant Table</span>
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
                      <button [disabled]="isNew" (click)="addVariant()" type="button" class="new-add-button wide" i18n>
                        <i class="material-icons">add</i> Add Variant
                      </button>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </label>
            </ng-template>

            <label>
              <span i18n>UPC</span>
              <input type="text"
                     [formControl]="upc"
                     name="upc"
                     placeholder="Input UPC"
                     data-qa="upc"/>
              <nus-field-errors [control]="upc"></nus-field-errors>
            </label>

            <label>
              <div id="barcode-label" >
                <span i18n>Barcode</span>
                <a (click)="copyUpcToBarcode()" i18n>Copy from UPC</a>
              </div>
              <input type="text"
                     [formControl]="barcode"
                     name="barcode"
                     data-qa="barcode"/>
              <nus-field-errors [control]="barcode"></nus-field-errors>
            </label>

            <label class="single-price" *ngIf="!enterpriseLicense()">
              <span i18n>Price</span>
              <input type="number" [formControl]="price" name="price" min="0" appOnlyNumber decimal="true"
                     (change)="setSinglePrice($event)">
              <nus-field-errors [control]="price"></nus-field-errors>
            </label>

            <div [ngClass]="{'hidden' : !enterpriseLicense()}">
              <nus-price-list-host [form]="priceLists"></nus-price-list-host>
            </div>
            <div [ngClass]="{'hidden' : !enterpriseLicense()}">
              <nus-advance-price [productHref]="entity?.href"></nus-advance-price>
            </div>
          </div>

          <div id="product-subscription" class="wrapper" *ngIf="isProductOptionDomain">
            <h1 class="heading-1" i18n>Subscription Information:</h1>
            <nus-product-subscription [form]="subscription"></nus-product-subscription>
          </div>

          <div id="product-media" class="wrapper">
            <h1 class="heading-1" i18n>Media</h1>
            <nus-product-media-host [form]="media"></nus-product-media-host>
          </div>

          <div id="product-packaging" class="wrapper">
            <h1 class="heading-1" i18n>Product Packaging</h1>
            <label>
              <span i18n>Package Weight (kg)</span>
              <input type="number" [formControl]="weight"
                     name="weight"
                     placeholder="Input Weight"
                     data-qa="weight"/>
              <nus-field-errors [control]="weight"></nus-field-errors>
            </label>
            <div formGroupName="dimensions" class="product-dimension">
              <label>
                <span i18n>Length (cm)</span>
                <input
                  type="number"
                  name="length"
                  class="dimension-input"
                  formControlName="currentLength"
                  placeholder="Input Length"
                  data-qa="length"/>
                <nus-field-errors [control]="dimensions.get('currentLength')"></nus-field-errors>
              </label>
              <label>
                <span i18n>Width (cm)</span>
                <input
                  type="number"
                  name="width"
                  class="dimension-input"
                  formControlName="currentWidth"
                  placeholder="Input Width"
                  data-qa="width"/>
                <nus-field-errors [control]="dimensions.get('currentWidth')"></nus-field-errors>
              </label>
              <label>
                <span i18n>Height (cm)</span>
                <input
                  type="number"
                  name="height"
                  class="dimension-input"
                  formControlName="currentHeight"
                  placeholder="Input Height"
                  data-qa="height"/>
                <nus-field-errors [control]="dimensions.get('currentHeight')"></nus-field-errors>
              </label>
            </div>
          </div>

          <div *ngIf="enterpriseLicense()" id="product-tag" class="wrapper">
            <h1 class="heading-1" i18n>Product Tag</h1>
            <label *ngFor="let t of tags.controls; let i = index">
              <span i18n>Tag {{ i + 1 }}</span>
              <div style="display: flex;">
                <input type="text" [formControl]="t" name="tag" data-qa="tag"/>
                <button type="button" class="delete" (click)="tags.removeAt(i)">
                  <i class="material-icons">delete_outline</i>
                </button>
              </div>
            </label>
            <button (click)="addTag()" type="button" class="new-add-button wide" i18n>
              <i class="material-icons">add</i> Add Tag
            </button>
          </div>

          <div id="product-other" class="wrapper">
            <h1 class="heading-1" i18n>Other</h1>
            <label>
              <span i18n>Meta Description</span>
              <textarea
                [formControl]="seoDescription"
                name="seo-description"
                cols="30" rows="10"
                data-qa="seo-description">
              </textarea>
              <nus-field-errors [control]="seoDescription"></nus-field-errors>
            </label>
            <label>
              <span i18n>Meta Keywords</span>
              <input type="text"
                     [formControl]="seoMeta"
                     name="seo-meta"
                     data-qa="seo-meta"/>
              <nus-field-errors [control]="seoMeta"></nus-field-errors>
            </label>
          </div>

          <nus-marketplace-info id="marketplace-information"
                                *ngIf="!isNew && isPhysical() && enterpriseLicense()"
                                [form]="marketplace"
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
                <th i18n>Product</th>
                <th i18n>Remove</th>
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
                  <button (click)="removeRelated(i)" type="button" class="remove-button">
                    <mat-icon class="icon" svgIcon="trash"></mat-icon>
                  </button>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <button type="button" (click)="selectProduct()" class="new-add-button wide" i18n>
                    Add Product
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
            [hideDelete]="!entity || !entity.isActive"
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
    <nus-product-class-selection-modal #productClassModal></nus-product-class-selection-modal>
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
    '.side-nav li a { text-decoration: none; color: inherit; }',
    '.delete { background: none; border: none; outline: none; font-size: 18px; cursor: pointer; opacity: .5; }',
    '.package-info {line-height: 18px; margin-top: 26px; font-weight: bold; }',
    '.package-info .label { float: left; width: 25%; }',
    'table tr th.product-name { width: 25%; }',
    '.total-price { font-weight: bold; }',
    '.total-price td.price { text-align: right; }',
    '#barcode-label {display: block; margin-bottom: 4px;}',
    '#barcode-label > span:first-child {font-size: 14px; line-height: 20px; font-weight: bold; margin-right: 10px;}',
  ]
})
export class ProductComponent extends AbstractDetailComponent<products.IProduct> implements OnInit, AfterViewInit {

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
    licenseKey: ''
  };
  selectedProductClass: products.IProductClass;

  selectedVendor: INamedHrefEntity = null;
  selectedCategory: INamedHrefEntity = null;
  selectedProductClassValue: INamedHrefEntity = null;

  productRelatedSlug: string;
  productSlug: string;
  productFormType: string;
  virtualPackageAmount: number = null;
  totalPrice: number = 0;

  isAdvancePriceAvailable = false;
  confirmAdvancedPriceTitle = 'Update this product?';
  confirmAdvancedPriceText =
    'This product has an "Advanced Price", if you change the default price, it might impact on the “Advance Price" as well.';

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
  @ViewChild(ConfirmModalComponent)confirmModal: ConfirmModalComponent;


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
              private advancedPriceListService: AdvancedPriceListService) {
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

  get dimensions(): FormGroup {
    return this.form?.get('dimensions') as FormGroup;
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

  get subscription(): FormControl {
    return this.form?.get('subscription') as FormControl;
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
        // productClasses: products.IProductClass[],
        mediaTypes: drf.IChoice[]
      }) => {
      this.parentProduct = data.parent;
      // this.vendors = data.vendors;
      // this.categories = data.categories;
      // this.productClasses = data.productClasses;
      this.mediaTypes = data.mediaTypes;
      this.entity = data.entity;
    });

    this.getProductFormType();
    this.getAdvancePrice();

    super.ngOnInit();
  }


  /**
   * Configures the form that is edited in this component.
   *
   * Special notes related to the ProductComponent:
   * 1. There is differing logic depending on whether we're initializing a parent or a child (variant)
   * 2. From a parent, the variants array is READ-ONLY at the API, so we DO NOT set it on this form.
   */
  initializeForm(entity?: products.IProduct) {
    let bundleInitialValue = this.fb.array([]);
    if (this.productFormType !== 'bundling') {
      bundleInitialValue = null;
    }
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, Validators.maxLength(120)]],
      isActive: [entity?.isActive, []],
      parent: [entity?.parent],
      href: [entity?.href],
      upc: [entity?.upc, [Validators.required, ]],
      structure: [entity?.structure ?? 'parent', [Validators.required, ]],
      description: [entity?.description, [Validators.required, ]],
      weight: [entity?.weight, [Validators.required, ]],
      price: [0, [Validators.minLength(0), Validators.max(999999999)]],
      dimensions: this.fb.group({
        currentLength: [entity?.dimensions?.currentLength, ],
        currentWidth: [entity?.dimensions?.currentWidth, ],
        currentHeight: [entity?.dimensions?.currentHeight, ]
      }),
      productClass: this.fb.group({href: [entity?.productClass.href, [Validators.required]]}),
      category: this.fb.group({href: [entity?.category.href, [Validators.required]]}),
      vendor: this.fb.group({href: [entity?.vendor?.href, [Validators.required]]}),
      media: this.fb.array([]),
      attributes: this.fb.group({}),
      marketplace: this.fb.group({}),
      priceLists: this.fb.array([]),
      seoMeta: [entity?.seoMeta, []],
      seoDescription: [entity?.seoDescription, []],
      tags: this.fb.array([], [NusantaraValidators.preventArrayDuplicates()]),
      subscription: this.fb.group({}),
      productRelated: this.fb.array([]),
      bundle: bundleInitialValue,
      barcode: [entity?.barcode, [Validators.required, ]],
    });


    this.selectedVendor = entity?.vendor;
    this.selectedCategory = entity?.category;
    this.selectedProductClassValue = entity?.productClass;

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
    this.productClass.valueChanges.subscribe(val => this.onProductClassChanged(val));

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


    return formValue;
  }

  onConfirmModalClosed(){
    if (this.confirmModal.result === DialogResult.OK){
      this.save();
    }
  }

  getAdvancePrice() {
    if (!!this.productSlug) {
      this.advancedPriceListService.search_by_product_slug(this.productSlug).pipe(catchError(err => {
        log.debug('Cannot get advanced price');
        return of(EMPTY);
      })).subscribe((data: Array<IAdvancedPriceList>) => {
        this.isAdvancePriceAvailable = data.length > 0;
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
      this.service.save(this.getFormValue()).pipe(catchError(err => {
        log.debug('err', err);
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
            console.log(resp.entity);
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
          }
        }
      );
      if (!this.isNew && this.isPhysical() && this.enterpriseLicense()) {
        this.marketplaceHost?.saveAll();
      }
    } else {
      window.alert('Please check your input.');
      this.validatePriceList();
    }
    this.form.enable();
  }

  validatePriceList() {
    this.priceListHost?.priceLists.forEach((priceList) => {
      log.debug('pricelist', priceList.validatePriceList());
      priceList.rangeComponents.forEach((component) => {
        log.debug('validate', component.validatePriceRange(), component.maxQuantity.value);
      });
    });
  }

  addVariant() {
    this.router.navigate(['./variants/new'], {relativeTo: this.route});
  }

  addTag(value?: string) {
    this.tags.push(
      this.fb.control(value, [Validators.required])
    );
  }

  addRelatedProduct() {
    throw Error('Not Implemented');
  }

  navigateToParent(warnOnDirty: boolean = false) {
    if (this.structure.value === 'parent' && this.productFormType !== 'bundling') {
      super.navigateToParent(warnOnDirty);
    } else {
      this.router.navigateByUrl('/catalog/products', );
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
      log.error('Cannot get correct product class');
      return of(EMPTY);
    })).subscribe((res) => {
      if (!!res) {
        const productClass = res as IProductClass;
        // const productClass = this.productClasses.filter(e => e.href === newValue)[0];

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
    if (!this.entity?.priceLists.length) {
      this.priceListHost.updatePriceList({
        href: null,
        product: this.href.value,
        type: 'default',
        platforms: [],
        locations: [],
        isProgressive: false,
        ranges: [
          {href: null, priceList: null, price: this.price.value, minQuantity: 1, maxQuantity: null}
        ]
      }, 0);
    } else if (!this.entity?.priceLists[0].ranges.length) {
      this.entity?.priceLists[0].ranges.push({
        href: null,
        priceList: null,
        price: this.price.value,
        minQuantity: 1,
        maxQuantity: null
      });
      this.priceListHost.updatePriceList(this.entity?.priceLists[0], 0);
    } else {
      for (const priceList of this.entity?.priceLists ?? []) {
        priceList.ranges[0].price = this.price.value;
        this.priceListHost.updatePriceList(priceList, 0);
      }
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

  isValidForm(): boolean {
    return this.form.valid && this.priceListHost.validatePriceListHost();
  }

  selectProduct() {
    this.productRecommendationSelectionModal.open();
  }

  showErrorToast(err) {
    this.toast?.addMessage(err.error.relation, 'error', ToastLevelEnum.error);
  }

  showInfoWindow(resp, action) {
    if (action === 'remove'){
      this.toast?.addMessage(resp, 'Successfully Removed', ToastLevelEnum.info);
    } else {
      this.toast?.addMessage(resp, 'Successfully Add', ToastLevelEnum.success);
    }
  }

  apiPostRelatedProduct(productValue, action, product, index= 0){
    delete productValue['name'];
    delete productValue['href'];
    let actionStatus = 'add';

    if (action === 'remove'){
      productValue['action'] = 'remove';
      actionStatus = 'remove';
    }

    this.relatedService.post(productValue).subscribe(
      (resp) => {
        if (action === 'add') {
          // if "add" then it will be pushed to array
          this.productRelated.push(product);
        } else {
          // this will remove from the table if remove success
          this.productRelated.removeAt(index);
        }
        this.showInfoWindow(resp.status, actionStatus);
      },
      (err) => {
        this.showErrorToast(err);
      }
    );
  }

  removeRelated(index: number) {
    const prevRelated = this.productRelated.at(index).value;
    const postRemove = this.apiPostRelatedProduct(prevRelated, 'remove', this.productRelated, index);
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
        log.debug('productBundling', this.productBundling.value);
        const currentQty = this.productBundling.at(isSameProduct).value.quantity;
        this.productBundling.at(isSameProduct).patchValue({quantity: Number(currentQty) + 1});
        log.debug('productBundling', this.productBundling.value);
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
        log.debug(this.productBundling);
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
    const bundle: Array<{product: string, quantity: number}> = [];
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

      log.debug(this.productBundling);
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
        const removeImage = this.mediaHost.entities.findIndex((x) => {
          return (x.product === product.href || x.product === product.product.href) && x.type === 'image';
        });
        if (removeImage !== -1) {
          this.mediaHost.remove(removeImage);
        }
        const removeVideo = this.mediaHost.entities.findIndex((x) => {
          return (x.product === product.href || x.product === product.product.href) && x.type === 'you_tube';
        });
        if (removeVideo !== -1) {
          this.mediaHost.remove(removeVideo);
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
}
