import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@gdnnusantara/ckeditor5-build/build/ckeditor';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ToastService, AbstractDetailComponent, PagedResponse, getSlugFromHref, NusantaraValidators, ErrorResult } from '@nusantara/core';
import { ICategory, IVendor, drf, products } from '@nusantara/models';
import { IError } from '@nusantara/models/base/error';
import { ProductService } from '@nusantara/services';
import { PriceListHostComponent } from './price';
import { ProductMediaHostComponent } from './media';
import { ProductAttributeHostComponent } from './attribute';
import { ProductSubscriptonHostComponent } from './subscription';
import { MarketplaceInfoHostComponent } from './marketplace';

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

        <form [formGroup]="form" (ngSubmit)="save()" class="fluid">
          <div id="general-info" class="wrapper">
            <h1 class="heading-1">General Information</h1>
            <label>
              <span>Name</span>
              <input type="text" [formControl]="name" placeholder="Input Name"/>
              <nus-field-errors [control]="name"></nus-field-errors>
            </label>
            <label class="toggle">
              <input id="s2" type="checkbox" class="toggle"[formControl]="isActive"/>
              <span>Is Active</span>
              <nus-field-errors [control]="isActive"></nus-field-errors>
            </label>

            <label *ngIf="structure.value === 'parent'">
              <span>Product Category</span>
              <div class="manage">
                <div>
                  <select [formControl]="category" aria-placeholder="Select Category">
                    <option *ngFor="let c of categories" [ngValue]="c.href">
                      {{ c.pathName }}
                    </option>
                  </select>
                  <nus-field-errors [control]="category"></nus-field-errors>
                </div>
                <div><a [routerLink]="['/catalog', 'categories']"> Manage Category</a></div>
              </div>
            </label>

            <label *ngIf="structure.value === 'parent'">
              <span>Product Class</span>
              <div class="manage">
                <div>
                  <select [formControl]="productClass">
                    <option *ngFor="let pc of productClasses" [ngValue]="pc.href">
                      {{ pc.name }}
                    </option>
                  </select>
                  <nus-field-errors [control]="productClass"></nus-field-errors>
                </div>
                <div><a [routerLink]="['/catalog', 'product-classes']">Manage Class</a>
                </div>
              </div>
            </label>
            <div *ngIf="productClass.value">
              <nus-product-attribute-host
                [form]="attributes"
                [productClass]="productClass"
                [originalAttributeValues]="originalAttributeValues"
                *ngIf="originalAttributeValues">
              </nus-product-attribute-host>
            </div>
          </div>

          <div id="product-info" class="wrapper">
            <h1 class="heading-1">Product Information</h1>

            <div class="rich-text-container">
              <label for="content" class="external"><span>Description</span></label>
              <ckeditor [editor]="Editor" [formControl]="description" id="description"></ckeditor>
              <nus-field-errors [control]="description"></nus-field-errors>
            </div>

            <label *ngIf="structure.value === 'parent'">
              <span>Vendor</span>
              <div class="manage">
                <div>
                  <select [formControl]="vendor">
                    <option *ngFor="let v of vendors" [ngValue]="v.href">
                      {{ v.name }}
                    </option>
                  </select>
                  <nus-field-errors [control]="vendor"></nus-field-errors>
                </div>
                <div><a [routerLink]="['/catalog', 'vendors']"> Manage Vendor </a></div>
              </div>
            </label>
          </div>

          <div id="product-management" class="wrapper">
            <h1 class="heading-1">Product Management</h1>
            <ng-template [ngIf]="structure.value === 'parent'">
              <label>
                <span>Variant Table</span>
                <table>
                  <thead>
                    <tr><th>Name</th></tr>
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
                          <i class="material-icons">add</i> Add Variant
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </label>
            </ng-template>

            <label>
              <span>UPC</span>
              <input type="text" [formControl]="upc" />
              <nus-field-errors [control]="upc"></nus-field-errors>
            </label>

            <nus-price-list-host [form]="priceLists"></nus-price-list-host>
          </div>

          <div id="product-media" class="wrapper">
            <h1 class="heading-1">Media</h1>
            <nus-product-media-host [form]="media"></nus-product-media-host>
          </div>

          <div id="product-packaging" class="wrapper">
            <h1 class="heading-1">Product Packaging</h1>
            <label>
              <span>Package Weight (kg)</span>
              <input type="number" [formControl]="weight" placeholder="Input Weight"/>
              <nus-field-errors [control]="weight"></nus-field-errors>
            </label>
            <div formGroupName="dimensions" class="product-dimension">
              <label>
                <span>Length (cm)</span>
                <input
                  type="number"
                  class="dimension-input"
                  formControlName="current_length"
                  placeholder="Input Length"/>
                <nus-field-errors [control]="length"></nus-field-errors>
              </label>
              <label>
                <span>Width (cm)</span>
                <input
                  type="number"
                  class="dimension-input"
                  formControlName="current_width"
                  placeholder="Input Width"/>
                <nus-field-errors [control]="width"></nus-field-errors>
              </label>
              <label>
                <span>Height (cm)</span>
                <input
                  type="number"
                  class="dimension-input"
                  formControlName="current_height"
                  placeholder="Input Height"/>
                <nus-field-errors [control]="height"></nus-field-errors>
              </label>
            </div>
          </div>

          <div id="product-tag" class="wrapper">
            <h1 class="heading-1">Product Tag</h1>
            <label *ngFor="let t of tags.controls; let i = index">    
              <span>Tag {{ i + 1 }}</span>
              <div style="display: flex;">
                <input type="text" [formControl]="t" />
                <button type="button" class="delete" (click)="tags.removeAt(i)">
                  <i class="material-icons">delete_outline</i>
                </button>
              </div>
            </label>
            <button (click)="addTag()" type="button" class="new-add-button wide">
              <i class="material-icons">add</i> Add Tag
            </button>
          </div>

          <div id="product-other" class="wrapper">
            <h1 class="heading-1">Other</h1>
            <label>
              <span>Meta Description</span>
              <textarea
                [formControl]="seoDescription"
                id=""
                cols="30"
                rows="10"
              ></textarea>
              <nus-field-errors [control]="seoDescription"></nus-field-errors>
            </label>
            <label>
              <span>Meta Keywords</span>
              <input type="text" [formControl]="seoMeta" />
              <nus-field-errors [control]="seoMeta"></nus-field-errors>
            </label>
          </div>

          <nus-marketplace-info id="marketplace-information" 
            *ngIf="!isNew && selectedProductClass.type === 'physical'"
            [form]="marketplace"
            [productClass]="selectedProductClass">
          </nus-marketplace-info>

          <div *ngIf="!isNew" class="wrapper" id="product-inventory">
            <ng-container *ngIf="!!entity">
              <nus-stock-search [productHref]="entity?.href"></nus-stock-search>
            </ng-container>
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
            <a (click)="scrollTo('general-info')">General Information</a>
          </li>
          <li [ngClass]="{ active: currentActive === 'product-info' }">
            <a (click)="scrollTo('product-info')">Product Information</a>
          </li>
          <li [ngClass]="{ active: currentActive === 'product-management' }">
            <a (click)="scrollTo('product-management')">Product Management</a>
          </li>
          <li [ngClass]="{ active: currentActive === 'product-media' }">
            <a (click)="scrollTo('product-media')">Media</a>
          </li>
          <li [ngClass]="{ active: currentActive === 'product-packaging' }">
            <a (click)="scrollTo('product-packaging')">Product Packaging</a>
          </li>
          <li [ngClass]="{ active: currentActive === 'product-tag' }">
            <a (click)="scrollTo('product-tag')">Product Tag</a>
          </li>
          <li [ngClass]="{ active: currentActive === 'product-other' }">
            <a (click)="scrollTo('product-other')">Other</a>
          </li>
          <li *ngIf="!isNew" [ngClass]="{ active: currentActive === 'marketplace-information' }">
            <a (click)="scrollTo('marketplace-information')">Marketplace Information</a>
          </li>
          <li *ngIf="!isNew" [ngClass]="{ active: currentActive === 'product-inventory' }">
            <a (click)="scrollTo('product-inventory')">Product Inventory</a>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [
    '.container { display: grid; grid-template-columns: 3fr 1fr; grid-column-gap: 24px; }',
    '.wrapper { padding: 16px 24px; border: solid 1px var(--grey); border-radius: 4px; margin-bottom: 24px; }',
    '.manage { display: grid; grid-template-columns: 7fr 1fr; grid-gap: 20px; align-items: center; }',
    '.product-dimension { display: grid; grid-template-columns: repeat(3, 1fr); grid-column-gap: 16px; }',
    '.heading-1 { margin-bottom: 16px; }',
    'label.toggle { padding-bottom: 20px 0; width: fit-content; min-height: 0; }',
    'label.toggle > input { margin-right: 16px }',
    '.rich-text-container { padding-bottom: 16px; margin: 0 !important; }',
    'ul { list-style: none }',
    '.side-nav li { font-size: 14px; line-height: 20px; font-weight: bold; color: var(--tertiary); padding: 10px 32px; cursor: pointer; }',
    '.side-nav li.active { padding: 10px 24px; color: white; background: var(--tertiary-lighten); border-left: solid 8px var(--secondary); border-radius: 4px; }',
    '.side-nav li a { text-decoration: none; color: inherit; }',
    '.delete { background: none; border: none; outline: none; font-size: 18px; cursor: pointer; opacity: .5; }',
    
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
  originalAttributeValues: {[key: string]: string|number|boolean};
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

  @ViewChild(ProductMediaHostComponent) mediaHost!: ProductMediaHostComponent;
  @ViewChild(PriceListHostComponent) priceListHost!: PriceListHostComponent;
  @ViewChild(ProductAttributeHostComponent) attributeHost!: ProductAttributeHostComponent;
  @ViewChild(ProductSubscriptonHostComponent) subscriptionHost!: ProductSubscriptonHostComponent;
  @ViewChild(MarketplaceInfoHostComponent) marketplaceHost!: MarketplaceInfoHostComponent;

  constructor(service: ProductService,
              private fb: FormBuilder,
              route: ActivatedRoute,
              toast: ToastService,
              router: Router,
              public modal: NgxSmartModalService) {
    super(route, router, toast, service);
  }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get isActive(): FormControl { return this.form.get('isActive') as FormControl; }
  get upc(): FormControl { return this.form.get('upc') as FormControl; }
  get productClass(): FormControl { return this.form.get('productClass').get('href') as FormControl; }
  get category(): FormControl { return this.form.get('category').get('href') as FormControl; }
  get vendor(): FormControl { return this.form.get('vendor').get('href') as FormControl; }
  get description(): FormControl { return this.form.get('description') as FormControl; }
  get media(): FormArray { return this.form.get('media') as FormArray; }
  get priceLists(): FormArray { return this.form.get('priceLists') as FormArray; }
  get attributes(): FormGroup { return this.form.get('attributes') as FormGroup; }
  get related(): FormArray { return this.form.get('related') as FormArray; }
  get weight(): FormControl { return this.form.get('weight') as FormControl; }

  get dimensions(): FormArray { return this.form.get('dimensions') as FormArray; }
  get length(): FormControl { return this.form.get('length') as FormControl; }
  get width(): FormControl { return this.form.get('width') as FormControl; }
  get height(): FormControl { return this.form.get('height') as FormControl; }
  
  get parent(): FormControl { return this.form.get('parent') as FormControl; }
  get structure(): FormControl { return this.form.get('structure') as FormControl; }
  get tags(): FormArray { return this.form.get('tags') as FormArray; }
  get seoMeta(): FormControl { return this.form.get('seoMeta') as FormControl; }
  get seoDescription(): FormControl { return this.form.get('seoDescription') as FormControl; }
  get subscription(): FormControl { return this.form.get('subscription') as FormControl; }
  get marketplace(): FormGroup { return this.form.get('marketplace') as FormGroup; }
 

  get isProductOptionDomain(): boolean {
    const pc = this.productClasses.filter(e => e.href === (this.form.get('productClass').get('href') as FormControl)?.value)[0];
    if (pc && (pc.type === 'subscription' && pc.option)) {
      return true;
    }
    return false;
  }

  ngOnInit(): void {
    this.route.data.subscribe((
      data: { entity: products.IProduct, categories: ICategory[], parent: products.IProduct, vendors: PagedResponse<IVendor>,
        productClasses: products.IProductClass[], mediaTypes: drf.IChoice[]}) => {
      this.parentProduct = data.parent;
      this.vendors = data.vendors.entities;
      this.categories = data.categories;
      this.productClasses = data.productClasses;
      this.mediaTypes = data.mediaTypes;
      this.entity = data.entity;
    });

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

    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, Validators.maxLength(120), ]],
      isActive: [entity?.isActive, []],
      parent: [entity?.parent ],
      href: [entity?.href],
      upc: [entity?.upc, [Validators.required, ]],
      structure: [entity?.structure ?? 'parent', [Validators.required, ]],
      description: [entity?.description, [Validators.required, ]],
      weight: [entity?.weight, [Validators.required, ]],
      dimensions: this.fb.group({
        current_length:[entity?.dimensions.currentLength,],
        current_width:[entity?.dimensions.currentWidth,],
        current_height:[entity?.dimensions.currentHeight,]
      }),
      productClass: this.fb.group({href: [entity?.productClass.href, [Validators.required]]}),
      category: this.fb.group({href: [entity?.category.href, [Validators.required]]}),
      vendor: this.fb.group({href: [entity?.vendor?.href, [Validators.required]]}),
      media: this.fb.array([]),
      attributes: this.fb.group({}, []),
      marketplace: this.fb.group({}, []),
      priceLists: this.fb.array([]),
      related: this.fb.array([]),
      seoMeta: [entity?.seoMeta, []],
      seoDescription: [entity?.seoDescription, []],
      tags: this.fb.array([], [NusantaraValidators.preventArrayDuplicates(), ]),
      subscription: this.fb.group({}, []),
    });

    // new product variant
    if (!entity && !!this.parentProduct) {
      this.parent.setValue(this.parentProduct.href);
      this.structure.setValue('child');

      // mandatory inheritance from parent
      this.productClass.setValue(this.parentProduct.productClass.href);
      this.category.setValue(this.parentProduct.category.href);
      this.vendor.setValue(this.parentProduct.vendor.href);

      // optional inheritance from parent
      this.description.setValue(this.parentProduct.description);
    }

    this.variants = entity?.variants ?? [];
    this.originalAttributeValues = entity?.attributes ?? {};

    for (const relatedProduct of entity?.related ?? []) {
      this.related.push(
        this.fb.control({
          name: [relatedProduct.name],
          href: [relatedProduct.href],
          image: [relatedProduct.image],
          vendor: [relatedProduct.vendor],
        })
      );
    }

    for (const t of entity?.tags ?? []) {
      this.addTag(t);
    }

    // listen for any changes to this so we can disable weight when appropriate
    this.productClass.valueChanges.subscribe(val => this.onProductClassChanged(val));
    this.onProductClassChanged(this.productClass.value?.href ?? this.productClass.value );
  }

  initializeSubViewForms(entity?: products.IProduct) {
    for (const priceList of entity?.priceLists ?? []) {
      this.priceListHost.addPriceList(priceList);
    }
    // if the product doesn't have a pricelist, we automatically add one.
    if (!entity?.priceLists.length) {
      this.priceListHost.addPriceList({
        href: null,
        product: this.href.value,
        type: 'default',
        platforms: [],
        locations: [],
        isProgressive: false,
        ranges: [
          { href: null, priceList: null, price: null, minQuantity: 1, maxQuantity: null },
        ]
      });
    }

    for (const media of entity?.media ?? []) {
      this.mediaHost.add(media);
    }

    if (entity?.subscription) {
      this.subscriptionHost.add(entity?.subscription);
    }
  }

  /**
   * Overridden implementation: This form hosts several sub-views, which must
   * be saved separate of the main product:  Because of that, the data
   * must be deleted from the data we pass to the product service.
   */
  getFormValue(): any {
    const formValue = {};

    Object.assign(formValue, this.form.value);
    // delete sub entities that shouldn't be saved on the primary object
    // like price-lists, media, dll.
    delete (formValue as products.IProduct).media;
    delete (formValue as products.IProduct).priceLists;
    
    delete (this.form.value.marketplace);

    return formValue;
  }

  save() {

    this.service.save(this.getFormValue()).pipe(catchError(err => {
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
            this.subscriptionHost.save(resp.entity).subscribe(() => { });
          }

          this.mediaHost.saveAll(resp.entity).subscribe(() => { });
          this.priceListHost.saveAll(resp.entity).pipe(catchError(childErr => {
            if (childErr instanceof HttpErrorResponse) {
              return of(new ErrorResult<IError>(childErr.error, childErr.status));
            } else {
              return of(new ErrorResult<IError>({message: 'Network error.. probably?'}, childErr.status));
            }
          })).subscribe( (childResp) => {
              if (childResp instanceof ErrorResult) {
                this.onSaveError(childResp);
              } else {
                this.onSaveSuccess(resp);
              }
            }
          );
        }
      }
    );

    if(!this.isNew) {
      this.marketplaceHost.saveAll();
    }

    this.form.disable();
  }

  addVariant() {
    this.router.navigate(['./variants/new'], {relativeTo: this.route});
  }


  addTag(value?: string) {
    this.tags.push(
      this.fb.control(value, [Validators.required, ])
    );
  }

  addRelatedProduct() {
    throw Error('Not Implemented');
  }

  navigateToParent(warnOnDirty: boolean = false) {
    if (this.structure.value === 'parent') {
      super.navigateToParent(warnOnDirty);
    } else {
      this.router.navigate([`/catalog/products/${getSlugFromHref(this.parentProduct.href)}`]);
    }
  }

  /**
   * Disables irrelevant/invalid product values for certain classes of product.
   */
  onProductClassChanged(newValue: any) {
    // protect against triggering during initialization
    if (!newValue || !this.productClasses) { return; }
    const pc = this.productClasses.filter(e => e.href === newValue)[0];
    this.selectedProductClass =  pc;
  
    if (pc.type === 'physical') {
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
}
