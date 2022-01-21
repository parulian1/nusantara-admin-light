import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { products, ISubLocation } from '@nusantara/models';
import { IProductClass } from '../../../models/products';

@Component({
  selector: 'nus-inventory-receiving-line',
  template: `
    <tr [formGroup]="form">
      <td title="{{ displayedProductName }}">{{ displayedProductName }}</td>
      <td class="immediate-error-display">
        <input type="text" [formControl]="sku" data-qa="sku" placeholder="Input SKU" i18n-placeholder>
        <nus-field-errors [control]="sku"></nus-field-errors>
      </td>
      <td>
        <input type="number" min="1" [formControl]="originalQuantity" data-qa="original-quantity">
        <nus-field-errors [control]="originalQuantity"></nus-field-errors>
      </td>
      <td>
        <input type="text" [formControl]="batchNumber" data-qa="batch-number" placeholder="Input Batch" i18n-placeholder>
        <nus-field-errors [control]="batchNumber"></nus-field-errors>
      </td>
      <td class="immediate-error-display">
        <input *ngIf="isPerishable" type="date" [formControl]="expiryDate" data-qa="expiry-date">
        <nus-field-errors [control]="expiryDate"></nus-field-errors>
      </td>
      <td class="immediate-error-display">
        <input type="number" [formControl]="cost" data-qa="cost">
        <nus-field-errors [control]="cost"></nus-field-errors>
        <div *ngIf="cost?.touched" class="error-detail">
          <div *ngIf="cost?.errors?.max" i18n>Ensure that there are no more than 16 digits</div>
        </div>
      </td>
      <td>
        <button (click)="remove.emit()" type="button" class="remove-button" data-qa="remove-button">
          <i class="material-icons">delete_outline</i>
        </button>
      </td>
    </tr>
  `,
  styles: [
    ':host { display: contents; }',
    'td:not(:first-child) { width: 12%; }',
    'td:nth-child(7) { width: 5%; text-align: center; }',
  ]
})
export class LineItemComponent implements OnInit, AfterViewInit {

  @Input() availableSubLocations: ISubLocation[] = [];
  @Input() productClasses: IProductClass[];
  @Output() remove = new EventEmitter<void>();
  form: FormGroup;


  constructor(private controlContainer: ControlContainer) {
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

  get product(): FormControl { return this.form.get('product') as FormControl; }
  get location(): FormGroup { return this.form.get('location') as FormGroup; }
  get originalQuantity(): FormControl { return this.form.get('originalQuantity') as FormControl; }
  get sku(): FormControl { return this.form.get('sku') as FormControl; }
  get locator(): FormArray { return this.form.get('locator') as FormArray; }
  get expiryDate(): FormControl { return this.form.get('expiryDate') as FormControl; }
  get batchNumber(): FormControl { return this.form.get('batchNumber') as FormControl; }
  get cost(): FormControl { return this.form.get('cost') as FormControl; }

  ngOnInit() {
    this.form = (this.controlContainer.control as FormGroup);
  }

  ngAfterViewInit() {
    if (this.isPerishable) {
      this.expiryDate.setValidators([Validators.required, ]);
    } else {
      this.expiryDate.clearValidators();
    }
  }
}
