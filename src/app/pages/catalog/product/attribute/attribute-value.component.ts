import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { IProductAttribute } from '@nusantara/models/products';

@Component({
  selector: 'nus-product-attribute-value',
  template: `
    <tr *ngIf="!(attributeDefinition.type === 'combo box' || attributeDefinition.type === 'dropdown')">
      <td>{{ attributeDefinition.name }}</td>
      <td>
        <label class="switcher">
          <input type="checkbox" />
          <span class="slider"></span>
        </label>
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
    `    
      tr {
        border-bottom: none;
      }
      
      td {
        padding: 7px 16px;
        text-align: left;
        vertical-align: middle;
      }

      .switcher {
        position: relative;
        display: inline-block;
        width: 34px;
        height: 14px;
        min-height: 0;
      }

      .switcher input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .switcher .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        border-radius: 20px;
        -webkit-transition: 0.4s;
        transition: 0.4s;
      }

      .switcher .slider:before {
        position: absolute;
        content: '';
        height: 20px;
        width: 20px;
        bottom: 0;
        margin-left: -3px;
        margin-bottom: -3px;
        background-color: #ff7d09;
        border-radius: 50%;
        -webkit-transition: 0.4s;
        transition: 0.4s;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.16),
          0px -2px 6px rgba(0, 0, 0, 0.08);
      }

      .switcher input:checked + .slider {
        background-color: rgb(255, 125, 9, 0.5);
      }

      .switcher input:focus + .slider {
        box-shadow: 0 0 1px #2196f3;
      }

      .switcher input:checked + .slider:before {
        -webkit-transform: translateX(20px);
        -ms-transform: translateX(20px);
        transform: translateX(20px);
      }
    `
  ]
})
export class AttributeValueComponent {

  @Input() attributeDefinition: IProductAttribute;
  @Input() control: FormControl;

  constructor() {  }

}
