import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { products, ISubLocation } from '@nusantara/models';
import { IProductClass } from '@nusantara/models/products';
import { WarehouseService } from '@nusantara/services';
import { map } from 'rxjs/operators';
import { IChoice } from '@nusantara/models/drf';

@Component({
  selector: 'nus-adjustment-line',
  template: `
    <tr [formGroup]="form">
      <td><a>{{ displayedProductName }}</a></td>

      <!--  <td class="immediate-error-display" [formGroup]="location">-->
      <!--    <select formControlName="href" data-qa="location">-->
      <!--      <option [ngValue]="null">-&#45;&#45;</option>-->
      <!--      <option *ngFor="let loc of availableSubLocations" [ngValue]="loc.href">-->
      <!--        {{ loc.name }} ({{ loc.code }})-->
      <!--      </option>-->
      <!--    </select>-->
      <!--  </td>-->

      <td class="immediate-error-display">
        <input type="text" [formControl]="sku" data-qa="sku">
      </td>

      <td class="immediate-error-display">
        <input type="date" [formControl]="receivingDate" data-qa="expiry-date">
      </td>

      <td>
        <input type="number" [formControl]="availableStockQty" data-qa="original-quantity">
      </td>

      <td>
        <input type="text" [formControl]="adjustmentQty">
      </td>

      <td>
        <input type="text" [formControl]="differenceQty" readonly>
      </td>


      <td>
        <select [formControl]="reason" data-qa="location">
          <option [ngValue]="null">---</option>
          <option *ngFor="let r of reasonChoices" [ngValue]="r.value">
            {{ r.displayName }}
          </option>
        </select>
      </td>


      <td>
        <textarea [formControl]="notes"></textarea>
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
    'td>div>button {float: left; width: 20%;}'
  ]
})
export class AdjustmentLineItemComponent implements OnInit, AfterViewInit {
  @Input() warehouse: { href: string };
  @Input() availableSubLocations: ISubLocation[] = [];
  @Input() productClasses: IProductClass[];
  @Input() form: FormGroup;
  @Output() remove = new EventEmitter<void>();

  reasonChoices: IChoice[] = [
    { value: 'opname', displayName: 'OpName' },
    { value: 'damage', displayName: 'Damage' },
    { value: 'missing', displayName: 'Missing' },
    { value: 'misplace', displayName: 'Found/Misplace' },
  ];

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public warehouseService: WarehouseService,
  ) { }

  get displayedProductName(): string {
    const p = this.product.value as products.IProduct;
    return `${p.name} (${p.upc})`;
  }

  // get isPerishable(): boolean {
  //   const p = this.product.value as products.IProduct;
  //   let currentPc = [];
  //   if (!!this.productClasses) {
  //     currentPc = this.productClasses.filter(pc => pc.href === p.productClass.href);
  //   }
  //
  //   if (currentPc.length > 0) {
  //     return currentPc[0].isPerishable;
  //   } else {
  //     return false;
  //   }
  // }

  get product(): FormControl { return this.form.get('product') as FormControl; }
  get receivingDate(): FormControl { return this.form.get('receivingDate') as FormControl; }
  get location(): FormGroup { return this.form.get('location') as FormGroup; }
  get sku(): FormControl { return this.form.get('sku') as FormControl; }
  get availableStockQty(): FormControl { return this.form.get('availableStockQty') as FormControl; }
  get adjustmentQty(): FormControl { return this.form.get('adjustmentQty') as FormControl; }
  get differenceQty(): FormControl { return this.form.get('differenceQty') as FormControl; }

  get reason(): FormControl { return this.form.get('reason') as FormControl; }
  get notes(): FormControl { return this.form.get('notes') as FormControl; }

  ngOnInit(): void {
    // find stock by product and warehouse
    this.warehouseService.warehouseStockSearch(this.product.value.href)
      .pipe(map(warehouses => {
        return warehouses.filter(
          warehouse => warehouse.href === this.warehouse.href
        );
      }))
      .subscribe(warehouses => {
        if (warehouses?.length > 0) {
          this.availableStockQty.setValue(warehouses[0].quantity || 0, { onlySelf: true });
        }
      });
  }

  ngAfterViewInit(): void {
    // if (this.isPerishable) {
    //   this.expiryDate.setValidators([Validators.required, ]);
    // } else {
    //   this.expiryDate.clearValidators();
    // }
  }

  // addLocator() {
  //   this.locator.push(new FormControl(''));
  // }
}
