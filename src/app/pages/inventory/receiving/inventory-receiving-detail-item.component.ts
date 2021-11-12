import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { products, ISubLocation } from '@nusantara/models';
import { IProductClass } from '@nusantara/models/products';

@Component({
  selector: 'nus-inventory-receiving-detail-item',
  template: `
    <tr [formGroup]="form">
      <td>{{ displayedProductName }}</td>
      <td class="immediate-error-display">
        {{ sku.value }}
      </td>
      <td>
        {{ originalQuantity.value }}
      </td>
      <td>
        <span *ngIf="batchNumber.value">{{ batchNumber.value }}</span>
        <span *ngIf="!batchNumber.value"> - </span>
      </td>
      <td>
        <span *ngIf="!expiryDate.value"> - </span>
        <span *ngIf="expiryDate.value">{{ expiryDate.value|date: 'dd MMM yyyy HH:mm' }}</span>
      </td>
      <td>
        <span *ngIf="!cost.value"> - </span>
        <span *ngIf="cost.value">{{ cost.value | currency:'IDR':'symbol-narrow':'1.0' }}</span>
      </td>
      <td [formGroup]="location">
        <select formControlName="href" data-qa="location">
          <option [ngValue]="null">---</option>
          <option *ngFor="let loc of availableSubLocations" [ngValue]="loc.href">
            {{ loc.name }} ({{ loc.type }})
          </option>
        </select>
      </td>
      <td>
        <div class="locator-item-container" *ngFor="let control of locator.controls; index as ctr">
          <div class="locator-item-container__input">
            <input [formControl]="control" name="locator" data-qa="locator" maxlength="5">
            <button (click)="locator.removeAt(ctr)" type="button" class="remove-button" data-qa="remove-locator-button">
              <i class="material-icons">delete_outline</i>
            </button>
          </div>
          <nus-field-errors [control]="control"></nus-field-errors>
        </div>
        <button (click)="addLocator()" type="button" class="new-add-button wide" data-qa="add-locator-button" i18n>Add</button>
      </td>
    </tr>
  `,
  styles: [
    ':host { display: contents; }',
    `
      .locator-item-container { margin-bottom: 15px; }
      .locator-item-container__input { display: flex; }
      tr {border: solid 1px #B4B4B4}
      tr td { vertical-align: top;}
    `,
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

  get product(): FormControl { return this.form.get('product') as FormControl; }
  get sku(): FormControl { return this.form.get('sku') as FormControl; }
  get originalQuantity(): FormControl { return this.form.get('originalQuantity') as FormControl; }
  get location(): FormGroup { return this.form.get('location') as FormGroup; }
  get locator(): FormArray { return this.form.get('locator') as FormArray; }
  get expiryDate(): FormControl { return this.form.get('expiryDate') as FormControl; }
  get batchNumber(): FormControl { return this.form.get('batchNumber') as FormControl; }
  get cost(): FormControl { return this.form.get('cost') as FormControl; }

  ngOnInit() {}

  ngAfterViewInit() {}

  addLocator() {
    this.locator.push(new FormControl(''));
  }
}
