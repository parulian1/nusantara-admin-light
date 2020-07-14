import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { IProductAttribute } from '@nusantara/models/products';

@Component({
  selector: 'nus-product-attribute-value',
  template: `
    <tr>
      <td>{{ attributeDefinition.name }}</td>
      <td><input type="checkbox" [checked]="control.enabled"></td>

      <td>
        <input type="text" *ngIf="attributeDefinition.type === 'text'">

        <textarea *ngIf="attributeDefinition.type === 'markdown'"></textarea>

        <input type="color" *ngIf="attributeDefinition.type === 'color'">

        <input type="number"
               *ngIf="attributeDefinition.type === 'decimal'"
               [min]="attributeDefinition.minValue"
               [max]="attributeDefinition.maxValue">

        <input type="number"
               *ngIf="attributeDefinition.type === 'integer'"
               [min]="attributeDefinition.minValue"
               [max]="attributeDefinition.maxValue"
               step="1">

        <input type="file"
               *ngIf="attributeDefinition.type === 'image'">

        <input type="checkbox"
               *ngIf="attributeDefinition.type === 'boolean'">
      </td>
    </tr>
  `,
  styles: [ ]
})
export class AttributeValueComponent {

  @Input() attributeDefinition: IProductAttribute;
  @Input() attributeValue: string|number|boolean;
  @Input() control: FormControl;

  constructor() {  }

}
