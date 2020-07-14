import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AbstractEditingComponent } from '@nusantara/core';
import { products } from '@nusantara/models';

@Component({
  selector: 'nus-product-attribute-host',
  template: `
    <h2>Attributes</h2>

    <table>
      <thead>
      <tr>
        <th>Name</th>
        <th>Enabled</th>
        <th>Value</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let attr of attributeDefinitions; let i=index">
        <td>{{ attr.name }}</td>
        <td><input type="checkbox" [></td>
        <td>
          <input type="text" *ngIf="attr.type === 'text'">
          <textarea *ngIf="attr.type === 'markdown'"></textarea>
          <input type="color" *ngIf="attr.type === 'color'">
          <input type="number" *ngIf="attr.type === 'decimal'" [min]="attr.minValue" [max]="attr.maxValue">
          <input type="number" *ngIf="attr.type === 'integer'" [min]="attr.minValue" [max]="attr.maxValue" step="1">
          <input type="file" *ngIf="attr.type === 'image'">
          <input type="checkbox" *ngIf="attr.type === 'boolean'">
        </td>
      </tr>
      </tbody>
    </table>
    <code><pre>{{ selectedProductClass | json }}</pre></code>
  `,
  styles: [ ]
})
export class ProductAttributeHostComponent extends AbstractEditingComponent implements OnInit, AfterViewInit {

  productClasses: Array<products.IProductClass> = [];

  @Input() selectedProductClass: string;

  constructor(protected route: ActivatedRoute, protected fb: FormBuilder) { super(); }

  ngOnInit() {
    this.route.data.subscribe((data: {productClasses: products.IProductClass[]}) => {
      this.productClasses = data.productClasses;
    });
  }

  initializeForm() {
    // initially set all the attributes, with disabled
    // form is gonna be have { 'href' -> 'value' }

    // empty all the controls (if any exist)
    const controlNames = Object.keys(this.form.controls);
    for (const ctrlName of controlNames) {
      this.form.removeControl(ctrlName);
    }

    for (const attr of this.attributeDefinitions) {
      this.form.addControl(attr.href, new FormControl());
    }
  }

  get attributeDefinitions(): products.IProductAttribute[] {
    if (!this.selectedProductClass) {
      return [];
    }
    const productClass = this.productClasses.filter(e => e.href === this.selectedProductClass)[0];
    return productClass.attributes;
  }

  ngAfterViewInit() {

  }

  initializeAttributeValue(attributeDefHref: string, attributeValue: any) {
    const ctrl = this.form.get(attributeDefHref);
    if (ctrl) {
      ctrl.setValue(attributeValue);
    }
  }

}
