import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { products, ISubLocation, IWarehouse } from '@nusantara/models';
import { IProductClass } from '../../../models/products';

@Component({
  selector: 'nus-inventory-receiving-line',
  template: `
    <tr [formGroup]="form">
      <td><a>{{ displayedProductName }}</a></td>
      <td class="immediate-error-display">
        <select [formControl]="subLocation">
          <option [ngValue]="null">---</option>
          <option *ngFor="let loc of availableSubLocations" [ngValue]="loc.href">
            {{ loc.name }} ({{ loc.code }})
          </option>
        </select>
      </td>
      <td><input type="number" min="1" [formControl]="quantity"></td>
      <td class="immediate-error-display"><input type="text" [formControl]="sku"></td>
      <td><input type="text" [formControl]="locator"></td>
      <td><input type="text" [formControl]="batchNumber"></td>
      <td class="immediate-error-display"><input *ngIf="isPerishable" type="date" [formControl]="expiryDate"></td>
      <td><input type="number" [formControl]="cost"></td>
      <td>
        <button (click)="remove.emit()" type="button" class="remove-button">
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
  ]
})
export class LineItemComponent implements OnInit, AfterViewInit {

  @Input() availableSubLocations: ISubLocation[] = [];
  @Input() form: FormGroup;
  @Output() remove = new EventEmitter<void>();

  productClasses: IProductClass[];

  constructor(private fb: FormBuilder,
              public route: ActivatedRoute,
              public router: Router) {
  }

  get displayedProductName(): string {
    const p = this.product.value as products.IProduct;
    return `${p.name} (${p.upc})`;
  }

  get isPerishable(): boolean {
    const p = this.product.value as products.IProduct;
    const currentPc = this.productClasses.filter(pc => pc.href === p.productClass);
    if (currentPc.length > 0) {
      return currentPc[0].isPerishable;
    } else {
      return false;
    }
  }

  get product(): FormControl { return this.form.get('product') as FormControl; }
  get subLocation(): FormControl { return this.form.get('subLocation') as FormControl; }
  get quantity(): FormControl { return this.form.get('quantity') as FormControl; }
  get sku(): FormControl { return this.form.get('sku') as FormControl; }
  get locator(): FormControl { return this.form.get('locator') as FormControl; }
  get expiryDate(): FormControl { return this.form.get('expiryDate') as FormControl; }
  get batchNumber(): FormControl { return this.form.get('batchNumber') as FormControl; }
  get cost(): FormControl { return this.form.get('cost') as FormControl; }

  ngOnInit() {
    this.route.data.subscribe((data: { productClasses: IProductClass[]}) => {
      this.productClasses = data.productClasses;
    });
  }

  ngAfterViewInit() {
    if (this.isPerishable) {
      this.expiryDate.setValidators([Validators.required, ]);
    } else {
      this.expiryDate.clearValidators();
    }
  }
}
