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

      <label>
        <span>Product Class</span>
        <select [formControl]="productClass">
          <option *ngFor="let pc of productClasses" [ngValue]="pc.href">
            {{ pc.name }}
          </option>
        </select>
        <nus-field-errors [control]="productClass"></nus-field-errors>
      </label>

      <label>
        <span>Category</span>
        <select [formControl]="category">
          <option *ngFor="let c of categories" [ngValue]="c.href">
            {{ c.pathName }}
          </option>
        </select>
        <nus-field-errors [control]="category"></nus-field-errors>
      </label>

      <label>
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
        [productClass]="productClass">
      </nus-product-attribute-host>

      <nus-price-list-host [form]="priceLists"></nus-price-list-host>

      <nus-product-media-host [form]="media"></nus-product-media-host>

      <div *ngIf="structure.value === 'parent'">
        <h2>Variants</h2>
        <button [disabled]="isNew">Add</button>
        <p>Create product SKUs that are similar to this product.</p>
        <table>
          <thead></thead>
          <tbody></tbody>
        </table>
      </div>

      <h2>Recommended Products</h2>
      <table>
        <thead></thead>
        <tbody></tbody>
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
  get structure(): FormControl { return this.form.get('structure') as FormControl; }
  get weight(): FormControl { return this.form.get('weight') as FormControl; }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((data: { categories: ICategory[],
                                             vendors: PagedResponse<IVendor>,
                                             productClasses: products.IProductClass[],
                                             mediaTypes: drf.IChoice[]}) => {
      this.vendors = data.vendors.entities;
      this.categories = data.categories;
      this.productClasses = data.productClasses;
      this.mediaTypes = data.mediaTypes;
    });
  }

  initializeForm(entity?: products.IProduct) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, ]],
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
      // variants
    });

    // initialize the attribute controls
    for (const [attrDefHref, attrVal] of Object.entries(entity.attributes)) {
      this.attributes.addControl(attrDefHref, new FormControl(attrVal));
    }

    // listen for any changes to this so we can disable weight when appropriate
    this.productClass.valueChanges.subscribe(val => this.onProductClassChanged(val));
    this.onProductClassChanged(this.productClass.value);
  }

  initializeSubViewForms(entity?: products.IProduct) {
    for (const priceList of entity?.priceLists ?? []) {
      this.priceListHost.addPriceList(priceList);
    }
    for (const media of entity?.media ?? []) {
      this.mediaHost.add(media);
    }
    // for (const [attrDefHref, attrVal] of Object.entries(entity?.attributes ?? {})) {
    //   this.attributeHost.initializeAttributeValue(attrDefHref, attrVal);
    // }
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
