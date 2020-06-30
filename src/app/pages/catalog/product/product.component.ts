import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { zip } from 'rxjs';

import { ICategory, IProduct, IProductAttribute, IProductClass, IVendor } from '@nusantara/models';
import { ProductService } from '@nusantara/services';
import { IChoiceFieldChoice, ToastService } from '@nusantara/core';
import { AbstractDetailComponent } from '@nusantara/core/components';
import { PagedResponse } from '@nusantara/core/pagination';

import { PriceListHostComponent } from './price-list-host.component';
import { ProductMediaHostComponent } from './product-media-host.component';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { NewProductImageComponent } from '@nusantara/pages/catalog/product/media';

@Component({
  selector: 'nus-product',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Product"></nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()" class="entity-detail-form">

      <label>
        <span>Name</span>
        <input type="text" formControlName="name">
      </label>

      <label>
        <span>Product Class</span>
        <select formControlName="productClass">
          <option *ngFor="let pc of productClasses" [ngValue]="pc.href">
            {{ pc.name }}
          </option>
        </select>
      </label>

      <label>
        <span>Category</span>
        <select formControlName="category">
          <option *ngFor="let c of categories" [ngValue]="c.href">
            {{ c.name }}
          </option>
        </select>
      </label>

      <label>
        <span>Vendor</span>
        <select formControlName="vendor">
          <option *ngFor="let v of vendors" [ngValue]="v.href">
            {{ v.name }}
          </option>
        </select>
      </label>

      <label>
        <span>UPC</span>
        <input type="text" formControlName="upc"></label>
      <label>
        <span>Description</span>
        <textarea formControlName="description"></textarea>
      </label>
      <label>
        <span>Weight (kg)</span>
        <input type="number" formControlName="weight">
      </label>

      <div *ngIf="!isNew">
        <h2>Inventory (Read-Only)</h2>
      </div>

      <h2>Pricing</h2>
      <nus-price-list-host [form]="priceLists"></nus-price-list-host>

      <nus-product-media-host [form]="media">
      </nus-product-media-host>

      <h2>Attributes</h2>


      <h2>Variants</h2>

      <h2>Related Products</h2>

      <div class="actions-container">
        <button type="submit" [disabled]="!form.valid">Save</button>
        <button (click)="navigateToParent(true)">Cancel</button>
        <button (click)="delete()" *ngIf="!isNew">Delete</button>
      </div>

    </form>
  `,
  styles: []
})
export class ProductComponent extends AbstractDetailComponent<IProduct> implements OnInit, AfterViewInit {

  productClasses: Array<IProductClass>;
  categories: Array<ICategory>;
  vendors: Array<IVendor>;
  attribute: Array<IProductAttribute>;
  mediaTypes: Array<IChoiceFieldChoice>;

  @ViewChild(ProductMediaHostComponent) mediaHost!: ProductMediaHostComponent;
  @ViewChild(PriceListHostComponent) priceListHost!: PriceListHostComponent;

  constructor(public service: ProductService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              public toast: ToastService,
              public router: Router,
              public modal: NgxSmartModalService) {
    super();
  }

  get productClass(): FormControl { return this.form.get('productClass') as FormControl; }
  get media(): FormArray { return this.form.get('media') as FormArray; }
  get priceLists(): FormArray { return this.form.get('priceLists') as FormArray; }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((data: { categories: PagedResponse<ICategory>,
                                             vendors: PagedResponse<IVendor>,
                                             productClasses: PagedResponse<IProductClass>,
                                             mediaTypes: IChoiceFieldChoice[]}) => {
      this.vendors = data.vendors.entities;
      this.categories = data.categories.entities;
      this.productClasses = data.productClasses.entities;
      this.mediaTypes = data.mediaTypes;
    });
  }

  initializeForm(entity?: IProduct) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, ]],
      href: [entity?.href],
      upc: [entity?.upc, [Validators.required, ]],
      description: [entity?.description, [Validators.required, ]],
      weight: [entity?.weight, [Validators.required, ]],
      productClass: [entity?.productClass, [Validators.required, ]],
      category: [entity?.category, [Validators.required]],
      vendor: [entity?.vendor, [Validators.required]],
      media: this.fb.array([]),
      attributes: [{}, ], // this.fb.array([]),
      priceLists: this.fb.array([]),
      // related products
      // variants
    });

    // listen for any changes to this so we can disable weight when appropriate
    this.productClass.valueChanges.subscribe(val => this.onProductClassChanged(val));
    this.onProductClassChanged(this.productClass.value);
  }

  initializeSubViewForms(entity?: IProduct) {
    for (const priceList of entity?.priceLists ?? []) {
      this.priceListHost.add(priceList);
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
    // todo: delete sub entities that shouldn't be saved on the primary object
    // .. like price-lists, media, dll.
    delete (formValue as IProduct).media;
    return formValue;
  }

  save() {
    this.service.save(this.getFormValue()).subscribe(
      resp => {
        if (resp.success) {
          // todo: add all the sub entities that are saved indepentently..
          // -- price lists
          // -- variants??
          // zip(
          //   ...this.viewMedia.map(m => m.save(resp.entity.href))
          // ).subscribe(r => {
          //     this.onSaveSuccess(resp);
          // });
        } else {
          this.onSaveError(resp);
        }
      }
    );
  }



  /**
   * Disables irrelevant/invalid product values for certain classes
   * of product.
   */
  onProductClassChanged(newValue: string) {

    // protect against triggering during initialization
    if (!newValue || !this.productClasses) {
      return;
    }

    const matches = this.productClasses.filter(
      e => e.href === newValue
    );
    const pc = (matches.length > 0) ? matches[0] : null;
    if (pc?.type === 'physical') {
      this.form.get('weight').enable();
    } else {
      this.form.get('weight').disable();
    }

  }
}
