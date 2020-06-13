import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ICategory, IProduct, IProductAttribute, IProductClass, IVendor } from '@nusantara/models';
import { ProductService } from '@nusantara/services';
import { AbstractDetailComponent } from '@nusantara/core/components';
import { PagedResponse } from '@nusantara/core/pagination';

@Component({
  selector: 'nus-product-detail',
  template: `
    <nus-detail-title [originalName]="entityName" typeName="Product"></nus-detail-title>

    <form [formGroup]="form" (ngSubmit)="submit()" class="entity-detail-form">

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

      <div class="actions-container">
        <button type="submit" [disabled]="!form.valid">Save</button>
        <button (click)="navigateToParent(true)">Cancel</button>
        <button (click)="delete()" *ngIf="!isNew">Delete</button>
      </div>

    </form>
  `,
  styles: [ ]
})
export class ProductDetailComponent extends AbstractDetailComponent<IProduct> implements OnInit {

  public entityName: string;

  productClasses: Array<IProductClass>;
  categories: Array<ICategory>;
  vendors: Array<IVendor>;
  attribute: Array<IProductAttribute>;

  public isBusy = false;

  constructor(public service: ProductService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              public router: Router) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();

    // todo:
    // - product type selection
    // - product category selection
    // - whole mess of attributes
    this.route.data.subscribe((data: {
        categories: PagedResponse<ICategory>,
        vendors: PagedResponse<IVendor>,
        productClasses: PagedResponse<IProductClass> }) => {

      // reference data
      this.vendors = data.vendors.entities;
      this.categories = data.categories.entities;
      this.productClasses = data.productClasses.entities;
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
      media: [entity?.media, [Validators.required]],
      // related products
      // attributes =(
    });

    // listen for any changes to this so we can disable weight when appropriate
    this.form.get('productClass').valueChanges.subscribe(
      val => this.onProductClassChanged(val)
    );
    this.onProductClassChanged(this.form.get('productClass').value);
  }

  /**
   * Disables irrelevant/invalid product values for certain classes
   * of product.
   */
  onProductClassChanged(newValue: string) {
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

  submit() {
    this.isBusy = true;
    this.service.save(this.form.value as IProduct);
  }

  delete() {

  }
}
