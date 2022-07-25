import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { products, ISubLocation, INamedHrefEntity } from '@nusantara/models';
import { IProductClass } from '@nusantara/models/products';

@Component({
  selector: 'nus-inventory-transfer-detail-item',
  template: `
    <tr [formGroup]="form">
      <td title="{{ displayedProductName }}">{{ displayedProductName }} / {{ displayLocationName }}</td>
      <td class="immediate-error-display" title="{{ sku.value }}">
        {{ sku.value }}
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
        {{ requestingStock.value }}
      </td>
      <td [formGroup]="receivingLocation">
        <ng-container *ngIf="status === 'pending'; else nonPendingLocation;">
          <select formControlName="href" data-qa="receivinglocation">
            <option [ngValue]="null">---</option>
            <option *ngFor="let loc of availableSubLocations" [ngValue]="loc.href">
              {{ loc.name }} ({{ loc.type }})
            </option>
          </select>
        </ng-container>
        <ng-template #nonPendingLocation>
          {{receivingLocation.value.name}}
        </ng-template>
      </td>
      <td>
        <ng-container *ngIf="status === 'pending'; else nonPendingLocator;">
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
        </ng-container>
        <ng-template #nonPendingLocator>
          <label>
            {{getLocatorValues()}}
          </label>
        </ng-template>
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
export class InventoryTransferDetailItemComponent {

  @Input() availableSubLocations: ISubLocation[] = [];
  @Input() productClasses: IProductClass[];
  @Input() form: FormGroup;
  @Input() status: string;
  constructor(public route: ActivatedRoute,
              public router: Router) {
  }

  get displayedProductName(): string {
    const p = this.product.value as products.IProduct;
    let displayWord = `${p.name}`;
    if (!!p.upc) {
      displayWord += ` (${p.upc})`;
    }
    return displayWord;
  }

  get displayLocationName(): string {
    const l = this.location.value as INamedHrefEntity;
    return l.name;
  }

  get product(): FormControl { return this.form.get('product') as FormControl; }
  get sku(): FormControl { return this.form.get('sku') as FormControl; }
  get originalQuantity(): FormControl { return this.form.get('originalQuantity') as FormControl; }
  get location(): FormGroup { return this.form.get('location') as FormGroup; }
  get locator(): FormArray { return this.form.get('locator') as FormArray; }
  get expiryDate(): FormControl { return this.form.get('expiryDate') as FormControl; }
  get batchNumber(): FormControl { return this.form.get('batchNumber') as FormControl; }
  get cost(): FormControl { return this.form.get('cost') as FormControl; }
  get receivingLocation(): FormGroup { return this.form.get('receivingLocation') as FormGroup; }
  get requestingStock(): FormControl { return this.form.get('requestingStock') as FormControl; }

  addLocator() {
    this.locator.push(new FormControl(''));
  }

  getLocatorValues(): string {
    let values = [];
    this.locator.controls.forEach((control) => {
      values.push(control.value);
    });
    return values.join(',');
  }
}
