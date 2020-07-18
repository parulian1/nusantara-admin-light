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
        <nus-product-attribute-value
          *ngFor="let attr of attributeDefinitions; let i=index"
          [attributeDefinition]="attr"
          [control]="getFormControlForAttribute(attr)">
        </nus-product-attribute-value>
      </tbody>
    </table>
  `,
  styles: [ ]
})
export class ProductAttributeHostComponent extends AbstractEditingComponent implements OnInit, AfterViewInit {

  productClasses: Array<products.IProductClass> = [];

  @Input() productClass: FormControl; // href

  constructor(protected route: ActivatedRoute, protected fb: FormBuilder) { super(); }

  ngOnInit() {
    this.route.data.subscribe((data: {productClasses: products.IProductClass[]}) => {
      this.productClasses = data.productClasses;
    });
    this.initializeForm();
  }

  getFormControlForAttribute(attrDefinition: products.IProductAttribute): FormControl {
    if (!this.form.contains(attrDefinition.href)) {
      this.form.addControl(attrDefinition.href, new FormControl());
    }
    return this.form.controls[attrDefinition.href] as FormControl;
  }

  initializeForm() {

    // add (re-add) all the possible attribute definitions
    // console.log('current attr defs', this.attributeDefinitions);
    // for (const attr of this.attributeDefinitions) {
    //
    //   if (this.form.contains(attr.href)) {
    //     console.log('Form has the attribute def', attr.href);
    //     console.log('... with value', this.form.controls[attr.href]);
    //
    //   } else {
    //     console.log('Form did not have the attribute def.. adding');
    //     this.form.addControl(attr.href, new FormControl());
    //   }
    // }

    // todo: look for attributes not in attrdefs and remove
    // todo: look for attrdefs missing frrom attributes and add
  }

  get attributeDefinitions(): products.IProductAttribute[] {
    if (!this.productClass.value) {
      return [];
    }
    const productClass = this.productClasses.filter(e => e.href === this.productClass.value)[0];
    return productClass.attributes;
  }

  ngAfterViewInit() {

  }

}
