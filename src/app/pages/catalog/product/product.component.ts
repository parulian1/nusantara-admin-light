import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { zip } from 'rxjs';

import { ToastService, AbstractDetailComponent, PagedResponse } from '@nusantara/core';
import { ICategory, IVendor, drf, products } from '@nusantara/models';
import { ProductService } from '@nusantara/services';
import { PriceListHostComponent } from './price';
import { ProductMediaHostComponent } from './media';
import { ProductAttributeHostComponent } from './attribute';
import { getSlugFromHref } from '@nusantara/shared/helpers';

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
        <input type="text" [formControl]="name">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label *ngIf="structure.value === 'parent'">
        <span>Product Class</span>
        <select [formControl]="productClass">
          <option *ngFor="let pc of productClasses" [ngValue]="pc.href">
            {{ pc.name }}
          </option>
        </select>
        <nus-field-errors [control]="productClass"></nus-field-errors>
      </label>

      <label *ngIf="structure.value === 'parent'">
        <span>Category</span>
        <select [formControl]="category">
          <option *ngFor="let c of categories" [ngValue]="c.href">
            {{ c.pathName }}
          </option>
        </select>
        <nus-field-errors [control]="category"></nus-field-errors>
      </label>

      <label *ngIf="structure.value === 'parent'">
        <span>Vendor</span>
        <select [formControl]="vendor">
          <option *ngFor="let v of vendors" [ngValue]="v.href">
            {{ v.name }}
          </option>
        </select>
        <nus-field-errors [control]="vendor"></nus-field-errors>
      </label>

      <label>
        <span>UPC</span>
        <input type="text" [formControl]="upc">
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
        <input type="number" [formControl]="weight">
        <nus-field-errors [control]="weight"></nus-field-errors>
      </label>

      <nus-product-attribute-host
        [form]="attributes"
        [productClass]="productClass"
        [originalAttributeValues]="originalAttributeValues"
        *ngIf="originalAttributeValues">
      </nus-product-attribute-host>

      <nus-price-list-host [form]="priceLists"></nus-price-list-host>

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
            <td><button [disabled]="isNew" (click)="addVariant()" type="button" class="add-button">Add</button></td>
          </tr>
          </tbody>
        </table>
      </div>

      <h2>Recommended Products</h2>
      <table>
        <thead></thead>
        <tbody>
        </tbody>
      </table>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
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

  Editor = ClassicEditor;

  @ViewChild(ProductMediaHostComponent) mediaHost!: ProductMediaHostComponent;
  @ViewChild(PriceListHostComponent) priceListHost!: PriceListHostComponent;
  @ViewChild(ProductAttributeHostComponent) attributeHost!: ProductAttributeHostComponent;

  constructor(public service: ProductService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              public toast: ToastService,
              public router: Router,
              public modal: NgxSmartModalService) {
    super();
  }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get upc(): FormControl { return this.form.get('upc') as FormControl; }
  get productClass(): FormControl { return this.form.get('productClass') as FormControl; }
  get category(): FormControl { return this.form.get('category') as FormControl; }
  get vendor(): FormControl { return this.form.get('vendor') as FormControl; }
  get description(): FormControl { return this.form.get('description') as FormControl; }
  get media(): FormArray { return this.form.get('media') as FormArray; }
  get priceLists(): FormArray { return this.form.get('priceLists') as FormArray; }
  get attributes(): FormGroup { return this.form.get('attributes') as FormGroup; }

  get weight(): FormControl { return this.form.get('weight') as FormControl; }

  get parent(): FormControl { return this.form.get('parent') as FormControl; }
  get structure(): FormControl { return this.form.get('structure') as FormControl; }

  ngOnInit(): void {
    this.route.data.subscribe((
      data: { categories: ICategory[], parent: products.IProduct, vendors: PagedResponse<IVendor>,
        productClasses: products.IProductClass[], mediaTypes: drf.IChoice[]}) => {
      this.parentProduct = data.parent;
      this.vendors = data.vendors.entities;
      this.categories = data.categories;
      this.productClasses = data.productClasses;
      this.mediaTypes = data.mediaTypes;
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
      name: [entity?.name, [Validators.required, Validators.maxLength(50), ]],
      parent: [entity?.parent ],
      href: [entity?.href],
      upc: [entity?.upc, [Validators.required, ]],
      structure: [entity?.structure ?? 'parent', [Validators.required, ]],
      description: [entity?.description, [Validators.required, ]],
      weight: [entity?.weight, [Validators.required, ]],
      productClass: [entity?.productClass, [Validators.required, ]],
      category: [entity?.category, [Validators.required]],
      vendor: [entity?.vendor, [Validators.required]],
      media: this.fb.array([]),
      attributes: this.fb.group({}, []),
      priceLists: this.fb.array([]),
      // related products
    });

    // new product variant
    if (!entity && !!this.parentProduct) {
      this.parent.setValue(this.parentProduct.href);
      this.structure.setValue('child');

      // manditory inheritance from parent
      this.productClass.setValue(this.parentProduct.productClass);
      this.category.setValue(this.parentProduct.category);
      this.vendor.setValue(this.parentProduct.vendor);

      // optional inheritance from parent
      this.description.setValue(this.parentProduct.description);
    }

    // todo: if new product, create an initial pricelist

    this.variants = entity?.variants ?? [];
    this.originalAttributeValues = entity?.attributes ?? {};

    // listen for any changes to this so we can disable weight when appropriate
    this.productClass.valueChanges.subscribe(val => this.onProductClassChanged(val));
    this.onProductClassChanged(this.productClass.value);
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
    // todo: these are basically ignoring the results of saving
    // the child objects.  This shouldn't be -- see a clean way of preparing
    // when calling zip(), it didn't seem to trigger the sub results from pricelist saving
    // it also might be better from API-side to just implement returning of PKs
    // so that drf nested serializers can work properly.
    this.service.save(this.getFormValue()).subscribe(resp => {
      this.mediaHost.saveAll(resp.entity).subscribe(() => { });
      this.priceListHost.saveAll(resp.entity).subscribe(
        () => { this.onSaveSuccess(resp); },
        (err) => { this.onSaveError(err); }
      );
      },
      (err) => this.onSaveError(err)
    );

    this.form.disable();
  }

  addVariant() {
    this.router.navigate(['./variants/new'], {relativeTo: this.route});
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
  onProductClassChanged(newValue: string) {
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
