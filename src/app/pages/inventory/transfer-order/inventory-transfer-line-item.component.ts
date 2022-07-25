import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormArray, FormControl, FormGroup } from '@angular/forms';

import { products, ISubLocation, INamedHrefEntity } from '@nusantara/models';
import { IProductClass } from '../../../models/products';

@Component({
  selector: 'nus-inventory-transfer-line',
  template: `
    <tr [formGroup]="form">
      <td><a>{{ displayedProductName }} / {{ displayedLocationName }} </a></td>
      <td class="immediate-error-display">
        {{ sku.value }}
      </td>
      <td>
        {{ batchNumber.value }}
      </td>
      <td class="immediate-error-display">
        {{ expiryDate?.value | date: 'dd/MM/yyyy'}}
      </td>
      <td>
        {{ availableStock }}
      </td>
      <td class="immediate-error-display-input">
        <input type="number" min="1" [formControl]="originalQuantity" data-qa="original-quantity"
               [max]="availableStock" >
        <div class="error-detail" *ngIf="originalQuantity.value > availableStock">Quantity over stock</div>
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

  @Input() productClasses: IProductClass[];
  // @Input() form: FormGroup;
  @Input() warehouseHref: string;
  @Output() remove = new EventEmitter<void>();
  form: FormGroup;

  get product(): FormControl { return this.form.get('product') as FormControl; }
  get location(): FormControl { return this.form.get('location') as FormControl; }
  get originalQuantity(): FormControl { return this.form.get('originalQuantity') as FormControl; }
  get sku(): FormControl { return this.form.get('sku') as FormControl; }
  get locator(): FormArray { return this.form.get('locator') as FormArray; }
  get expiryDate(): FormControl { return this.form.get('expiryDate') as FormControl; }
  get batchNumber(): FormControl { return this.form.get('batchNumber') as FormControl; }
  get cost(): FormControl { return this.form.get('cost') as FormControl; }

  @Input() availableStockList: Array<{href: string, amount: number}> = [];

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
    return `${p.name}`;
  }

  get isPerishable(): boolean {
    const p = this.product.value as products.IProduct;
    let currentPc = [];
    if (!!this.productClasses) {
      currentPc = this.productClasses.filter(pc => pc.href === p.productClass?.href);
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

  get displayedLocationName(): string {
    const p = this.location.value as INamedHrefEntity;
    return `${p.name}`;
  }

   get availableStock(): number {
    const selectedStock = this.availableStockList.find((availableStock) => {
      return availableStock.href === this.form.get('href').value;
    })
     return selectedStock.amount;
  }
}
