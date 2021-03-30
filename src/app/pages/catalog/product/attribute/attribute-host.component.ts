import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractEditingComponent } from '@nusantara/core';
import { products } from '@nusantara/models';

@Component({
  selector: 'nus-product-attribute-host',
  template: `
    <h4 class="subheading-2">Attributes</h4>

    <table>
      <thead>
      <tr>
        <th>Name</th>
        <th class="centered">Enabled</th>
        <th>Value</th>
      </tr>
      </thead>
      <tbody *ngIf="!!originalAttributeValues">
        <nus-product-attribute-value
          *ngFor="let attr of attributeDefinitions; let i=index"
          [attributeDefinition]="attr"
          [control]="getFormControlForAttribute(attr)">
        </nus-product-attribute-value>
        <tr>
          <td colspan="3">
            <a (click)="goToClass()" class="manage-attr">Manage Attribute</a>
          </td>
        </tr>
      </tbody>
    </table>

  `,
  styles: [
    'h4 { margin-bottom: 4px; }',
  ]
})
export class ProductAttributeHostComponent extends AbstractEditingComponent implements OnInit {

  productClasses: Array<products.IProductClass> = [];
  productAttributeTypesHide: string[] = ['image', 'markdown'];

  @Input() productClass: FormControl; // href
  @Input() originalAttributeValues: {[key: string]: string|number|boolean};

  constructor(protected route: ActivatedRoute, protected fb: FormBuilder, private router: Router) { super(); }

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
    const productClassHref = this.productClass.value?.href ?? this.productClass.value;
    const productClass = this.productClasses.filter(e => e.href === productClassHref)[0];

    // #69558, image and richText (markdown) be hide
    return productClass.attributes.filter(
      attribute => !this.productAttributeTypesHide.includes(attribute.type)
    );
  }

  goToClass(): void {
    const slugs = this.productClass.value.split('/').reverse();
    const productClassSlug = slugs[0] ? slugs[0] : slugs[1];
    this.router.navigate(['/catalog/product-classes', productClassSlug]);
  }
}
