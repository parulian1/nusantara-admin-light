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

    <form [formGroup]="form" (ngSubmit)="submit()">

      <div>
        <button type="submit" [disabled]="!form.valid">Save</button>
      </div>

      <div>
        <code><pre>{{ form.value | json }}</pre></code>
      </div>
    </form>

  `,
  styles: [ ]
})
export class ProductDetailComponent extends AbstractDetailComponent implements OnInit {

  public isNew = true;
  public entityName: string;
  public isBusy = false;
  public form: FormGroup;

  constructor(private service: ProductService,
              private fb: FormBuilder,
              protected route: ActivatedRoute,
              protected router: Router) {
    super();
  }

  ngOnInit(): void {
    // todo:
    // - product type selection
    // - product category selection
    // - whole mess of attributes
    this.route.data.subscribe((data: { entity: IProduct, categories: IEntityHref, classes: IEntityHref }) => {
      this.form = this.fb.group({
        name: [data.entity?.name, [Validators.required,]],
        href: [data.entity?.href],
        upc: [data.entity?.upc, [Validators.required]],
        description: [data.entity?.description, [Validators.required]],
        weight: [data.entity?.weight, [Validators.required]],
        // vendor
        // class
        // media[]
        // category
        // related products
        // attributes =(
      });

      this.isNew = !data.entity;
      this.entityName = data.entity?.name;
    });
  }

  submit() {
    this.isBusy = true;
    let obs = this.service.save(this.form.value as IProduct);
  }
}
