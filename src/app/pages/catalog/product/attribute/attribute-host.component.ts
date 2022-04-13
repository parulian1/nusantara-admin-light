import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractEditingComponent } from '@nusantara/core';
import { INamedHrefEntity, products } from '@nusantara/models';
import { IProductClass } from '@nusantara/models/products';

@Component({
  selector: 'nus-product-attribute-host',
  template: `
    <h4 class="subheading-2 attr-host" i18n>
      <label>Attributes</label>
      <span *ngIf="!!parentProduct">
        <input type="checkbox" class="toggle" [(ngModel)]="isSameAsParent"
               (click)="resetAttributeValuesSameAsParent()"/> Data same as parent
      </span>
    </h4>

    <table>
      <thead>
      <tr>
        <th i18n>Name</th>
        <th class="centered" i18n *ngIf="!parentProduct">Variant</th>
        <th i18n>Value</th>
      </tr>
      </thead>
      <tbody *ngIf="!!originalAttributeValues">
        <nus-product-attribute-value
          *ngFor="let attr of attributeDefinitions; let i=index"
          [attributeDefinition]="attr"
          [control]="getFormControlForAttribute(attr)"
          [enabledAttributes]="enabledAttributes" [showEnabled]="!parentProduct"
          (validateChange)="validateIsValueSameAsParent()">
        </nus-product-attribute-value>
        <tr>
          <td colspan="3">
            <a (click)="goToClass()" class="manage-attr" i18n>Manage Attribute</a>
          </td>
        </tr>
      </tbody>
    </table>

  `,
  styles: [
    'h4 { margin-bottom: 4px; }',
    'h4.attr-host { overflow: hidden; }',
    'h4.attr-host label { display: inline-table; width: 80%; min-height: 18px; }',
    'h4.attr-host span { display: inline-table; font-weight: normal; }',
  ]
})
export class ProductAttributeHostComponent extends AbstractEditingComponent implements OnInit, OnChanges {

  productClasses: Array<products.IProductClass> = [];
  productAttributeTypesHide: string[] = ['image', 'markdown'];

  @Input() productClass: FormControl; // href
  @Input() originalAttributeValues: {[key: string]: string|number|boolean};
  @Input() selectedProductClass: IProductClass;
  @Input() enabledAttributes: INamedHrefEntity[];
  @Input() parentProduct?: products.IProduct;

  formGroup: FormGroup;
  isSameAsParent: boolean = false;

  constructor(protected route: ActivatedRoute, protected fb: FormBuilder, private router: Router) { super(); }

  ngOnInit() {
    // this.route.data.subscribe((data: {productClasses: products.IProductClass[]}) => {
    //   this.productClasses = data.productClasses;
    // });
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'selectedProductClass': {
             break;
          }
        }
      }
    }
  }

  getFormControlForAttribute(attrDefinition: products.IProductAttribute): FormControl {
    // if the control hasn't yet been created, create it with the values from the original object
    if (!this.form.contains(attrDefinition.href)) {
      let defaultValue = this.originalAttributeValues[attrDefinition.href];
      if (attrDefinition.type === 'color' && !defaultValue) {
        defaultValue = "#000000";
      }
      this.form.addControl(
        attrDefinition.href,
        new FormControl(defaultValue)
      );
      this.form.markAsTouched();
    }
    return this.form.controls[attrDefinition.href] as FormControl;
  }

  get attributeDefinitions(): products.IProductAttribute[] {
    if (!this.productClass.value) {
      return [];
    }
    const productClassHref = this.productClass.value?.href ?? this.productClass.value;
    const productClass = this.selectedProductClass;

    // #69558, image and richText (markdown) be hide
    return productClass?.attributes?.filter(
      attribute => !this.productAttributeTypesHide.includes(attribute.type)
    );
  }

  goToClass(): void {
    const slugs = this.productClass.value.split('/').reverse();
    const productClassSlug = slugs[0] ? slugs[0] : slugs[1];
    this.router.navigate(['/catalog/product-classes', productClassSlug]);
  }

  resetAttributeValuesSameAsParent() {
    this.isSameAsParent = !this.isSameAsParent;
    if (!!this.parentProduct && !!this.isSameAsParent) {
      Object.keys(this.parentProduct.attributes).forEach((key) => {
        this.form.controls[key].setValue(this.parentProduct.attributes[key]);
      });
    }
  }

  validateIsValueSameAsParent() {
    const differentAttrValue = !!this.parentProduct ? this.attributeDefinitions.find((attrDef) => {
      if (['integer', 'decimal'].indexOf(attrDef.type) > -1) {
        return parseFloat(this.parentProduct.attributes[attrDef.href].toString()) !==
          parseFloat(this.form.controls[attrDef.href].value.toString());
      } else {
        return this.parentProduct.attributes[attrDef.href] !== this.form.controls[attrDef.href].value;
      }
    }) : false;
    if (!!differentAttrValue) {
      this.isSameAsParent = false;
    } else {
      this.isSameAsParent = true;
    }
  }
}
