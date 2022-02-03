import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormArray, FormControl, FormGroup } from '@angular/forms';

import { products, ISubLocation } from '@nusantara/models';
import { IProductClass } from '../../../models/products';

@Component({
  selector: 'nus-inventory-transfer-line',
  template: `
    <tr [formGroup]="form">
      <td><a>{{ displayedProductName }}</a></td>
      <td class="immediate-error-display" [formGroup]="location">
        <select formControlName="href" data-qa="location">
          <option [ngValue]="null">---</option>
          <option *ngFor="let loc of availableSubLocations" [ngValue]="loc.href">
            {{ loc.name }} ({{ loc.code }})
          </option>
        </select>
      </td>
      <td>
        <input type="number" min="1" [formControl]="originalQuantity" data-qa="original-quantity">
        <nus-field-errors [control]="originalQuantity"></nus-field-errors>
      </td>
      <td class="immediate-error-display">
        <input type="text" [formControl]="sku" data-qa="sku">
        <nus-field-errors [control]="sku"></nus-field-errors>
      </td>
      <td>
        <input type="text" [formControl]="batchNumber" data-qa="batch-number">
      </td>
      <td *ngIf="!!locator.controls">
        <div class="locator-item-container" *ngFor="let child_control of locator.controls; index as ctr">
          <div class="locator-item-container__input">
            <input [formControl]="child_control" name="locator" data-qa="locator" maxlength="5">
            <button (click)="locator.removeAt(ctr)" type="button" class="remove-button" data-qa="remove-locator-button">
              <i class="material-icons">remove_circle_outline</i>
            </button>
          </div>
          <nus-field-errors [control]="child_control"></nus-field-errors>
        </div>
        <button (click)="addLocator()" type="button" class="new-add-button wide" data-qa="add-locator-button">Add</button>
      </td>
      <td class="immediate-error-display">
        <input *ngIf="isPerishable" type="date" formControlName="expiryDate" data-qa="expiry-date">
        <nus-field-errors [control]="expiryDate"></nus-field-errors>
      </td>
      <td *ngIf="!!cost">
        <input type="number" [formControl]="cost" data-qa="cost" maxlength="20">
        <nus-field-errors [control]="cost"></nus-field-errors>
      </td>
      <td>
        <button (click)="remove.emit()" type="button" class="remove-button" data-qa="remove-button">
          <i class="material-icons">remove_circle_outline</i>
        </button>
      </td>
    </tr>
  `,
  styles: [
    ':host { display: contents; }',
    'td:nth-child(2) select { min-width: 115px; }', // location
    'td:nth-child(3) input { width: 70px; }', // quantity
    'td:nth-child(8) input { width: 105px; }', // cost
    'td>div>input {float: left; width: 80%;}',
    'td>div>button {float: left; width: 20%;}',
    `
      .locator-item-container { margin-bottom: 15px; }
      .locator-item-container__input { display: flex; }
    `,
  ]
})
export class InventoryTransferLineItemComponent implements OnInit, AfterViewInit {

  @Input() availableSubLocations: ISubLocation[] = [];
  @Input() productClasses: IProductClass[];
  // @Input() form: FormGroup;
  @Input() warehouseHref: string;
  @Output() remove = new EventEmitter<void>();
  form: FormGroup;

  get product(): FormControl { return this.form.get('product') as FormControl; }
  get location(): FormGroup { return this.form.get('location') as FormGroup; }
  get originalQuantity(): FormControl { return this.form.get('originalQuantity') as FormControl; }
  get sku(): FormControl { return this.form.get('sku') as FormControl; }
  get locator(): FormArray { return this.form.get('locator') as FormArray; }
  get expiryDate(): FormControl { return this.form.get('expiryDate') as FormControl; }
  get batchNumber(): FormControl { return this.form.get('batchNumber') as FormControl; }
  get cost(): FormControl { return this.form.get('cost') as FormControl; }

  constructor(private controlContainer: ControlContainer) {
  }

  ngOnInit() {
    this.form = (this.controlContainer.control as FormGroup);
  }

  ngAfterViewInit() {
    if (!this.isPerishable ) {
      this.expiryDate.setErrors(null);
      this.expiryDate.clearValidators();
    }
    this.expiryDate.updateValueAndValidity();
  }

  get displayedProductName(): string {
    const p = this.product.value as products.IProduct;
    return `${p.name} (${p.upc})`;
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



  addLocator() {
    this.locator.push(new FormControl('', []));
  }
}
