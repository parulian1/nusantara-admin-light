import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
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

/**
 * Allows the user to edit/create a single product.
 */
@Component({
  selector: 'nus-product',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Product">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()" class="entity-detail-form">

      <label>
        <span>Name</span>
        <input type="text" [formControl]="name" name="name">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>
      <label>
        <span>Is Active</span>
        <input type="checkbox" [formControl]="isActive">
        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>


      <label *ngIf="structure.value === 'parent'">
        <span>Product Class</span>
        <select [formControl]="productClass" name="product-class">
          <option *ngFor="let pc of productClasses" [ngValue]="pc.href">
            {{ pc.name }}
          </option>
        </select>
        <nus-field-errors [control]="productClass"></nus-field-errors>
      </label>

      <label *ngIf="structure.value === 'parent'">
        <span>Category</span>
        <select [formControl]="category" name="category">
          <option *ngFor="let c of categories" [ngValue]="c.href">
            {{ c.pathName }}
          </option>
        </select>
        <nus-field-errors [control]="category"></nus-field-errors>
      </label>

      <label *ngIf="structure.value === 'parent'">
        <span>Vendor</span>
        <select [formControl]="vendor" name="vendor">
          <option *ngFor="let v of vendors" [ngValue]="v.href">
            {{ v.name }}
          </option>
        </select>
        <nus-field-errors [control]="vendor"></nus-field-errors>
      </label>

      <label>
        <span>UPC</span>
        <input type="text" [formControl]="upc" name="upc">
        <nus-field-errors [control]="upc"></nus-field-errors>
      </label>

      <div class="rich-text-container">
        <label for="content" class="external"><span>Description</span></label>
        <ckeditor [editor]="Editor"
                  [formControl]="description" id="description"></ckeditor>
        <nus-field-errors [control]="description"></nus-field-errors>
      </div>

      <label>
        <span>Weight (kg)</span>
        <input type="number" [formControl]="weight" name="weight">
        <nus-field-errors [control]="weight"></nus-field-errors>
      </label>

      <nus-product-attribute-host
        [form]="attributes"
        [productClass]="productClass"
        [originalAttributeValues]="originalAttributeValues"
        *ngIf="originalAttributeValues">
      </nus-product-attribute-host>

      <nus-price-list-host [form]="priceLists"></nus-price-list-host>

      <nus-product-subscription [form]="subscription" *ngIf="isProductOptionDomain"></nus-product-subscription>

      <nus-product-media-host [form]="media"></nus-product-media-host>

      <div *ngIf="structure.value === 'parent'">
        <h2>Variants</h2>
        <p>Create product SKUs that are similar to this product.</p>
        <table>
          <thead>
          <tr>
            <th>Name</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let v of variants">
            <td><a [routerLink]="['variants', v.href|entityToSlug]">{{ v.name }}</a></td>
          </tr>
          <tr>
            <td><button [disabled]="isNew" (click)="addVariant()" type="button" class="add-button">Add Variant</button></td>
          </tr>
          </tbody>
        </table>
      </div>

      <h2>Tags</h2>
      <table>
        <thead>
        <tr><th>Tag</th><th></th></tr>
        </thead>
        <tbody>
        <tr *ngFor="let t of tags.controls; let i = index">
          <td>
            <input type="text" [formControl]="t">
          </td>
          <td>
            <button type="button"
                    class="remove-button"
                    (click)="tags.removeAt(i)">
              <i class="material-icons">remove_circle_outline</i>
            </button>
          </td>
        </tr>
        <tr>
          <td colspan="2"><button (click)="addTag()" type="button" class="add-button">Add Tag</button></td>
        </tr>
        </tbody>
      </table>

      <h2>Recommended Products</h2>
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let r of related.controls; let i = index">
          <td>{{ r.get('name').value }}</td>
          <td>
            <button type="button" class="remove-button" (click)="related.removeAt(i)">
              <i class="material-icons">remove_circle_outline</i>
            </button>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <button type="button" (click)="addRelatedProduct()" class="add-button">
              Add Related Product
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <h2>SEO</h2>
      <label>
        <span>Meta Keywords</span>
        <input type="text" [formControl]="seoMeta" name="seoMeta">
        <nus-field-errors [control]="seoMeta"></nus-field-errors>
      </label>

      <label>
        <span>Description</span>
        <input type="text" [formControl]="seoDescription" name="seoDescription">
        <nus-field-errors [control]="seoDescription"></nus-field-errors>
      </label>

      <nus-stock-search [productHref]="entity.href" *ngIf="!!entity"></nus-stock-search>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()"
        [hideDelete]="!entity.isActive"
      >
      </nus-detail-actions>

    </form>
  `,
  styles: [
    '.rich-text-container { padding-bottom: 14px; }', // double standard label padding
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

  Editor = ClassicEditor;

  @ViewChild(ProductMediaHostComponent) mediaHost!: ProductMediaHostComponent;
  @ViewChild(PriceListHostComponent) priceListHost!: PriceListHostComponent;
  @ViewChild(ProductAttributeHostComponent) attributeHost!: ProductAttributeHostComponent;
  @ViewChild(ProductSubscriptonHostComponent) subscriptionHost!: ProductSubscriptonHostComponent;

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

  get parent(): FormControl { return this.form.get('parent') as FormControl; }
  get structure(): FormControl { return this.form.get('structure') as FormControl; }

  get tags(): FormArray { return this.form.get('tags') as FormArray; }
  get seoMeta(): FormControl { return this.form.get('seoMeta') as FormControl; }
  get seoDescription(): FormControl { return this.form.get('seoDescription') as FormControl; }

  get subscription(): FormControl { return this.form.get('subscription') as FormControl; }

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
      productClass: this.fb.group({href: [entity?.productClass.href, [Validators.required]]}),
      category: this.fb.group({href: [entity?.category.href, [Validators.required]]}),
      vendor: this.fb.group({href: [entity?.vendor.href, [Validators.required]]}),
      media: this.fb.array([]),
      attributes: this.fb.group({}, []),
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
          if (this.isProductOptionDomain) this.subscriptionHost.save(resp.entity).subscribe(() => { });

          this.mediaHost.saveAll(resp.entity).subscribe(() => { });
          this.priceListHost.saveAll(resp.entity).pipe(catchError(child_err => {
            if (child_err instanceof HttpErrorResponse) {
              return of(new ErrorResult<IError>(child_err.error, child_err.status));
            } else {
              return of(new ErrorResult<IError>({message: 'Network error.. probably?'}, child_err.status));
            }
          })).subscribe( (child_resp) => {
              if (child_resp instanceof ErrorResult) {
                this.onSaveError(child_resp);
              } else {
                this.onSaveSuccess(resp);
              }
            }
          );
        }
      }
    );
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
    if (pc.type === 'physical') {
      this.weight.enable();
    } else {
      this.weight.disable();
    }
  }
}
