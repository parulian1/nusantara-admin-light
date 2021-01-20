import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AbstractEditingComponent } from '@nusantara/core';
import { products } from '@nusantara/models';

@Component({
  selector: 'nus-product-attribute-host',
  template: `
    <h3>Attributes</h3>

    <table>
      <thead>
      <tr>
        <th>Name</th>
        <th>Enabled</th>
        <th>Value</th>
      </tr>
      </thead>
      <tbody *ngIf="!!originalAttributeValues">
        <nus-product-attribute-value
          *ngFor="let attr of attributeDefinitions; let i=index"
          [attributeDefinition]="attr"
          [control]="getFormControlForAttribute(attr)">
        </nus-product-attribute-value>
      </tbody>
    </table>
  `,
  styles: [
    'h3 {font-size: 16px; font-weight: 400}',
    `
    table {
      box-shadow: none;
      border: 3px solid #f4f4f4;
      border-collapse: separate;
      border-radius: 8px;
      border-spacing: 0;
      margin-bottom: 10px;
    }
    
    thead {
      font-size: 16px;
      font-weight: bold;
      line-height: 24px;
      background: #f4f4f4;
      color: #5a5a5a;
    }

    th {
      padding: 16px;
      text-align: left;
    }

    `
  ]
})
export class ProductAttributeHostComponent extends AbstractEditingComponent implements OnInit {

  productClasses: Array<products.IProductClass> = [];

  @Input() productClass: FormControl; // href
  @Input() originalAttributeValues: {[key: string]: string|number|boolean};

  constructor(protected route: ActivatedRoute, protected fb: FormBuilder) { super(); }

  ngOnInit() {
    this.route.data.subscribe((data: {productClasses: products.IProductClass[]}) => {
      this.productClasses = data.productClasses;
    });
  }

  getFormControlForAttribute(attrDefinition: products.IProductAttribute): FormControl {
    // if the control hasn't yet been created, create it with the values from the original object
    if (!this.form.contains(attrDefinition.href)) {
      this.form.addControl(
        attrDefinition.href,
        new FormControl(this.originalAttributeValues[attrDefinition.href])
      );
    }
    return this.form.controls[attrDefinition.href] as FormControl;
  }

  get attributeDefinitions(): products.IProductAttribute[] {
    if (!this.productClass.value) {
      return [];
    }
    let productClassHref = this.productClass.value?.href ?? this.productClass.value;
    const productClass = this.productClasses.filter(e => e.href === productClassHref)[0];
    return productClass.attributes;
  }
}
