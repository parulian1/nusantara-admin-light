import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { products, ISubLocation } from '@nusantara/models';
import {IProductClass} from '@nusantara/models/products';

@Component({
  selector: 'nus-inventory-receiving-detail-item',
  template: `
    <tr [formGroup]="form">
      <td>{{ displayedProductName }}</td>
      <td class="immediate-error-display">
<!--        <input type="text" [formControl]="sku" data-qa="sku">-->
        {{sku.value}}
      </td>
      <td>
<!--        <input type="number" min="1" [formControl]="originalQuantity" data-qa="original-quantity">-->
        {{originalQuantity.value}}
      </td>
      <td [formGroup]="location">
        <select formControlName="href" data-qa="location">
          <option [ngValue]="null">---</option>
          <option *ngFor="let loc of availableSubLocations" [ngValue]="loc.href">
            {{ loc.name }} ({{ loc.code }})
          </option>
        </select>
      </td>
      <td>
        <div *ngFor="let control of locator.controls; index as ctr" style="display:flex; margin-bottom: 15px;">
          <input [formControl]="control" name="locator" data-qa="locator">
          <button (click)="locator.removeAt(ctr)" type="button" class="remove-button" data-qa="remove-locator-button">
            <i class="material-icons">remove_circle_outline</i>
          </button>
        </div>
        <button (click)="addLocator()" type="button" class="new-add-button wide" data-qa="add-locator-button">Add</button>
      </td>
      <td>
        <input type="text" [formControl]="batchNumber" data-qa="batch-number">
      </td>
      <td class="immediate-error-display">
        <input *ngIf="isPerishable" type="date" [formControl]="expiryDate" data-qa="expiry-date">
      </td>
      <td>
        <input type="number" [formControl]="cost" data-qa="cost">
      </td>
    </tr>
  `,
  styles: [
    ':host { display: contents; }',
  ]
})
export class InventoryReceivingDetailItemComponent implements OnInit, AfterViewInit {

  @Input() availableSubLocations: ISubLocation[] = [];
  @Input() productClasses: IProductClass[];
  @Input() form: FormGroup;

  constructor(public route: ActivatedRoute,
              public router: Router) {
  }

  get displayedProductName(): string {
    const p = this.product.value as products.IProduct;
    return `${p.name}`;
  }

  get isPerishable(): boolean {
    const p = this.product.value as products.IProduct;
    let currentPc = [];
    if (!!this.productClasses) {
      currentPc = this.productClasses.filter(pc => pc.href === p.productClass.href);
    }

    if (currentPc.length > 0) {
      return currentPc[0].isPerishable;
    } else {
      return false;
    }
  }

  get product(): FormControl { return this.form.get('product') as FormControl; }
  get sku(): FormControl { return this.form.get('sku') as FormControl; }
  get originalQuantity(): FormControl { return this.form.get('originalQuantity') as FormControl; }
  get location(): FormGroup { return this.form.get('location') as FormGroup; }
  get locator(): FormArray { return this.form.get('locator') as FormArray; }
  get expiryDate(): FormControl { return this.form.get('expiryDate') as FormControl; }
  get batchNumber(): FormControl { return this.form.get('batchNumber') as FormControl; }
  get cost(): FormControl { return this.form.get('cost') as FormControl; }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.isPerishable) {
      this.expiryDate.setValidators([Validators.required, ]);
    } else {
      this.expiryDate.clearValidators();
    }
  }

  addLocator() {
    this.locator.push(new FormControl(''));
  }
}
