import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IProduct } from '@nusantara/models';
import { ProductService } from '@nusantara/services';
import { AbstractDetailComponent } from '@nusantara/core/components';
import { IEntityHref } from '@nusantara/core';

@Component({
  selector: 'nus-product-detail',
  template: `
    <nus-detail-title [originalName]="entityName" typeName="Product"></nus-detail-title>

    <form [formGroup]="form" (ngSubmit)="submit()" class="entity-detail-form">

      <label>
        <span>Name</span>
        <input type="text" formControlName="name"></label>
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
export class ProductDetailComponent extends AbstractDetailComponent implements OnInit {

  public entityName: string;
  public isBusy = false;

  constructor(public service: ProductService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              public router: Router) {
    super();
  }

  ngOnInit(): void {
    // todo:
    // - product type selection
    // - product category selection
    // - whole mess of attributes
    this.route.data.subscribe((data: { entity: IProduct, categories: IEntityHref, classes: IEntityHref }) => {
      this.form = this.fb.group({
        name: [data.entity?.name, [Validators.required, ]],
        href: [data.entity?.href],
        upc: [data.entity?.upc, [Validators.required, ]],
        description: [data.entity?.description, [Validators.required, ]],
        weight: [data.entity?.weight, [Validators.required, ]],
        // vendor
        // class
        // media[]
        // category
        // related products
        // attributes =(
      });

      this.entityName = data.entity?.name;
    });
  }

  submit() {
    this.isBusy = true;
    let obs = this.service.save(this.form.value as IProduct);
  }

  delete() {

  }
}
