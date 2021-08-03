import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {ControlContainer, FormControl, FormGroup} from '@angular/forms';

import { products, ISubLocation } from '@nusantara/models';
import { IProductClass } from '../../../models/products';
import {WarehouseService} from "@nusantara/services";
import {IStockSearch, ISubLocationWithQuantity} from "@nusantara/models/products/stock-search";

@Component({
  selector: 'nus-transfer-order-line',
  template: `
    <tr [formGroup]="form">
      <td><a>{{ displayedProductName }}</a></td>
      <td class="immediate-error-display" [formGroup]="location">
        <select formControlName="href" data-qa="location" (change)="updateStockFromMatchingSubLocation()">
          <option [ngValue]="null">---</option>
          <option *ngFor="let loc of availableSubLocations" [ngValue]="loc.href">
            {{ loc.name }} ({{ loc.code }})
          </option>
        </select>
      </td>
      <td>{{ stockQty }}</td>
      <td>
        <input type="number" min="1" [formControl]="originalQuantity" data-qa="original-quantity">
        <nus-field-errors [control]="originalQuantity"></nus-field-errors>
      </td>
      <td>
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
    `,
  ]
})
export class TransferOrderLineItemComponent implements OnInit {

  @Input() availableSubLocations: ISubLocation[] = [];
  @Input() productClasses: IProductClass[];
  @Input() warehouseHref: string;
  @Output() remove = new EventEmitter<void>();
  form: FormGroup;
  stockInSubLocations: Array<ISubLocationWithQuantity> = [];
  stockQty: number = 0;


  constructor(private controlContainer: ControlContainer, public warehouseService: WarehouseService) {
  }

  get displayedProductName(): string {
    const product = this.product.value as products.IProduct;
    return `${product.name} (${product.upc})`;
  }

  get product(): FormControl { return this.form.get('product') as FormControl; }
  get location(): FormGroup { return this.form.get('location') as FormGroup; }
  get originalQuantity(): FormControl { return this.form.get('originalQuantity') as FormControl; }
  get cost(): FormControl { return this.form.get('cost') as FormControl; }

  ngOnInit() {
    this.form = (this.controlContainer.control as FormGroup);
    const product = this.product.value as products.IProduct;
    this.warehouseService.warehouseStockSearchWithDetails(product.href).subscribe((resp) => {
      const stockSearch: IStockSearch[] = resp;
      const foundMatchingWarehouseStock = stockSearch?.find((warehouseStock) => {
        return this.warehouseHref === warehouseStock.href;
      });
      if (!!foundMatchingWarehouseStock) {
        this.stockInSubLocations = foundMatchingWarehouseStock.subLocations;
      }
    });
  }

  updateStockFromMatchingSubLocation() {
    const selectedLocation: ISubLocation = this.location.value;
    const foundSublocation = this.stockInSubLocations?.find((stockInSubLocation) => {
      return selectedLocation.href === stockInSubLocation.href;
    });
    if (!!foundSublocation) {
      this.stockQty = foundSublocation.quantity;
    } else {
      this.stockQty = 0;
    }
  }

}
