import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { products, ISubLocation } from '@nusantara/models';

@Component({
  selector: 'nus-inventory-receiving-line',
  template: `
    <tr [formGroup]="form">
      <td>{{ displayedProductName }}</td>
      <td>
        <select [formControl]="subLocation">
          <option *ngFor="let loc of availableSubLocations" [ngValue]="loc.href">
            {{ loc.name }} ({{ loc.code }})
          </option>
        </select>
      </td>
      <td><input type="number" min="1" [formControl]="quantity"></td>
      <td><input type="text" [formControl]="batchNumber"></td>
      <td><input type="date" [formControl]="expiryDate"></td>
      <td><input type="number" [formControl]="cost"></td>

      <td><button type="button" (click)="remove.emit()">X</button></td>
    </tr>
  `,
  styles: [
    ':host { display: contents; }',
  ]
})
export class LineItemComponent implements OnInit, AfterViewInit {

  @Input() availableSubLocations: ISubLocation[] = [];
  @Input() form: FormGroup;
  @Output() remove = new EventEmitter<void>();

  constructor(private fb: FormBuilder,
              public route: ActivatedRoute,
              public router: Router) {
  }

  get displayedProductName(): string {
    const p = this.product.value as products.IProduct;
    return `${p.name} (${p.upc})`;
  }

  get product(): FormControl { return this.form.get('product') as FormControl; }
  get subLocation(): FormControl { return this.form.get('subLocation') as FormControl; }
  get quantity(): FormControl { return this.form.get('quantity') as FormControl; }
  get expiryDate(): FormControl { return this.form.get('expiryDate') as FormControl; }
  get batchNumber(): FormControl { return this.form.get('batchNumber') as FormControl; }
  get cost(): FormControl { return this.form.get('cost') as FormControl; }

  ngOnInit() {


    // super.ngOnInit();
    // this.route.data.subscribe((data: { warehouses: IWarehouse[]}) => {
    //   this.warehouses = data.warehouses;
    // });
  }

  ngAfterViewInit() {
    // wire-up modal closed callback
    // this.productSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed());
  }
}
