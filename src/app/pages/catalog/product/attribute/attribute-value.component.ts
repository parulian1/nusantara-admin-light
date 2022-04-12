import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { FormControl } from '@angular/forms';

import { IProductAttribute } from '@nusantara/models/products';
import {INamedHrefEntity} from "@nusantara/models";

@Component({
  selector: 'nus-product-attribute-value',
  template: `
    <tr *ngIf="!(attributeDefinition.type === 'combo box' || attributeDefinition.type === 'dropdown')">
      <td [ngClass]="{'vertical-aligned': attributeDefinition.type === 'markdown'}">
        {{ attributeDefinition.name }}
      </td>
      <td class="centered" [ngClass]="{'vertical-aligned': attributeDefinition.type === 'markdown'}"
          *ngIf="showEnabled">
        <input type="checkbox" class="toggle" [(ngModel)]="isEnabled" (click)="setInputDisabledProp()"/>
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
    '.color-input input { width: 40px; height: 40px; border-radius: 4px; padding: 0; }',
    'input { height: 40px; }',
    'td { border-bottom: solid 1px var(--grey) !important; }',
    '::ng-deep mat-slide-toggle label { min-height: 40px; }'
  ]
})
export class AttributeValueComponent implements OnInit, OnChanges {

  @Input() attributeDefinition: IProductAttribute;
  @Input() control: FormControl;
  @Input() enabledAttributes: INamedHrefEntity[];
  @Input() showEnabled?: boolean;
  isEnabled = false;

  constructor() {
  }

  ngOnInit(){
    this.isEnabled = this.getEnabledValueFromKeyControl();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!this.control.value) {
      this.isEnabled = true;
    }
    // if (!this.isEnabled) {
    //   this.control.disable();
    // } else {
    //   this.control.enable();
    // }
    this.control.markAsTouched();
  }

  setInputDisabledProp() {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      // this.control.setValue(null);
      // this.control.disable();
      const controlIndex = this.enabledAttributes?.findIndex((enabledAttribute) => {
        return enabledAttribute.href === this.attributeDefinition.href;
      });
      if (controlIndex > -1) {
        this.enabledAttributes.splice(controlIndex, 1);
      }
    } else {
      // this.control.enable();
      this.enabledAttributes.push({
        name: this.attributeDefinition.name,
        href: this.attributeDefinition.href
      })
    }
  }

  getEnabledValueFromKeyControl(): boolean {
    return !!this.enabledAttributes?.find((enabledAttribute) => {
      return enabledAttribute.href === this.attributeDefinition.href;
    });
  }
}
