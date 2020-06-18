import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ICategory, IProduct, IProductAttribute, IProductClass, IProductMedia, IVendor } from '@nusantara/models';
import { ProductService } from '@nusantara/services';
import { IChoiceFieldChoice } from '@nusantara/core';
import { AbstractDetailComponent } from '@nusantara/core/components';
import { PagedResponse } from '@nusantara/core/pagination';

@Component({
  selector: 'nus-product-detail',
  template: `
    <nus-detail-title [originalName]="entityName" typeName="Product"></nus-detail-title>

    <form [formGroup]="form" (ngSubmit)="save()" class="entity-detail-form">

      <label>
        <span>Name</span>
        <input type="text" formControlName="name"></label>

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

      <h2>Inventory</h2>

      <h2>Media
        <button (click)="addMedia()" type="button">Add</button>
      </h2>
      <table>
        <thead>
        <tr>
          <th>Type</th>
          <th>Value</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <nus-product-media-row
          *ngFor="let m of media.controls; let i=index"
          [form]="m"
          [mediaTypes]="mediaTypes"
          (remove)="removeMedia(i)">
        </nus-product-media-row>
        </tbody>
      </table>

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
  styles: [`
  `]
})
export class ProductDetailComponent extends AbstractDetailComponent<IProduct> implements OnInit {

  public entityName: string;

  productClasses: Array<IProductClass>;
  categories: Array<ICategory>;
  vendors: Array<IVendor>;
  attribute: Array<IProductAttribute>;
  mediaTypes: Array<IChoiceFieldChoice>;

  constructor(public service: ProductService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              public router: Router) {
    super();
  }

  get media(): FormArray { return this.form.get('media') as FormArray; }
  get productClass(): FormControl { return this.form.get('productClass') as FormControl; }

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
      attributes: this.fb.array([]),
      // related products
      // variants
    });

    // todo: disable changing the product type
    for (const media of entity?.media ?? []) {
      this.addMedia(media);
    }

    // listen for any changes to this so we can disable weight when appropriate
    this.form.get('productClass').valueChanges.subscribe(
      val => this.onProductClassChanged(val)
    );
    this.onProductClassChanged(this.form.get('productClass').value);
  }

  addMedia(media?: IProductMedia) {
    const f = this.fb.group({
      type: [media?.type || this.mediaTypes[0].value, []],
      href: [media?.href, []],
      image: [media?.image, []],
      youtubeVideoId: [media?.youtubeVideoId, []]
    });
    this.media.push(f);
  }
  removeMedia(index: number) {
    this.media.removeAt(index);
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
