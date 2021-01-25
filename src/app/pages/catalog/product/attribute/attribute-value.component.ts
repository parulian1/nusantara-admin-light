import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { IProductAttribute } from '@nusantara/models/products';

@Component({
  selector: 'nus-product-attribute-value',
  template: `
    <tr *ngIf="!(attributeDefinition.type === 'combo box' || attributeDefinition.type === 'dropdown')">
      <td>{{ attributeDefinition.name }}</td>
      <td>
        <input type="checkbox" class="toggle"/>
      </td>

      <td [ngClass]="{'color-input': attributeDefinition.type === 'color'}">
        <input type="text"
               *ngIf="attributeDefinition.type === 'text'"
               [formControl]="control">

        <textarea *ngIf="attributeDefinition.type === 'markdown'"
                  [formControl]="control"></textarea>

        <input type="color" *ngIf="attributeDefinition.type === 'color'"
               [formControl]="control">

        <input type="number"
               *ngIf="attributeDefinition.type === 'decimal'"
               [min]="attributeDefinition.minValue"
               [max]="attributeDefinition.maxValue"
               [formControl]="control">

        <input type="number"
               *ngIf="attributeDefinition.type === 'integer'"
               [min]="attributeDefinition.minValue"
               [max]="attributeDefinition.maxValue"
               step="1"
               [formControl]="control">

        <input type="file"
               *ngIf="attributeDefinition.type === 'image'"
               [formControl]="control">

        <input type="checkbox"
               *ngIf="attributeDefinition.type === 'boolean'"
               [formControl]="control">
      </td>
    </tr>
  `,
  styles: [
    ':host { display: contents; }',
    'textarea { height: 120px; }',
    '.color-input { text-align: left; }',
    '.color-input input { width: 36px; height: 36px }',
    'input { height: 40px; }',
  ]
})
export class AttributeValueComponent {

  @Input() attributeDefinition: IProductAttribute;
  @Input() control: FormControl;

  constructor() {  }

}
