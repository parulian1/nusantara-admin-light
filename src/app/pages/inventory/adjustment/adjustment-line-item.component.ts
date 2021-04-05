import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { products, ISubLocation, drf } from '@nusantara/models';
import { IProductClass } from '@nusantara/models/products';
import { InventoryAdjustmentOrderService } from '@nusantara/services';
import { getSlugFromHref } from '@nusantara/core';

@Component({
  selector: 'nus-adjustment-line',
  template: `
    <tr [formGroup]="form">
      <td><a>{{ displayedName }}</a></td>

      <td class="immediate-error-display">
        <input type="text" [formControl]="sku" data-qa="sku">
      </td>

      <td class="immediate-error-display">
        <div>{{ created.value | date }}</div>
      </td>

      <td>
        <input type="number" [formControl]="originalQuantity" data-qa="original-quantity">
      </td>

      <td>
        <input type="number" [formControl]="adjustedQty" (keyup)="onKeyUpAdjustment()" data-qa="adjusted-qty">
      </td>

      <td>
        <div style="display: flex; justify-items: center; align-items: center;">
          <input type="text" [formControl]="differenceQty" data-qa="difference-qty" readonly>
          <!-- <div>{{ signDifferentQty }}</div>-->
        </div>
      </td>


      <td>
        <select [formControl]="reason" data-qa="reason">
          <option *ngFor="let r of reasons" [ngValue]="r.value">
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
  @Input() reasons: drf.IChoice[] = [];

  @Output() remove = new EventEmitter<void>();

  signDifferentQty: string;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private inventoryAdjustmentService: InventoryAdjustmentOrderService,
  ) { }

  get displayedName(): string {
    const receivingId = getSlugFromHref(this.receivingOrder.value.href);
    const locationName = getSlugFromHref(this.location.value.href);
    const p = this.product.value as products.IProduct;
    return `${receivingId} / ${p.name} / ${locationName}`;
  }

  get product(): FormControl { return this.form.get('product') as FormControl; }
  get location(): FormGroup { return this.form.get('location') as FormGroup; }
  get sku(): FormControl { return this.form.get('sku') as FormControl; }
  get receivingOrder(): FormControl { return this.form.get('receivingOrder') as FormControl; }

  // get availableStockQty(): FormControl { return this.form.get('availableStockQty') as FormControl; }
  get originalQuantity(): FormControl { return this.form.get('originalQuantity') as FormControl; }
  get differenceQty(): FormControl { return this.form.get('differenceQty') as FormControl; }
  get adjustedQty(): FormControl { return this.form.get('adjustedQty') as FormControl; }

  get created(): FormControl { return this.form.get('created') as FormControl; }
  get reason(): FormControl { return this.form.get('reason') as FormControl; }
  get notes(): FormControl { return this.form.get('notes') as FormControl; }

  ngOnInit(): void {
    this.calculateDifferentQty();
  }

  ngAfterViewInit(): void { }

  onKeyUpAdjustment(): void {
    this.calculateDifferentQty();
  }

  calculateDifferentQty(): void {
    const differentQty = parseInt(this.adjustedQty.value || 0, 10)
      - parseInt(this.originalQuantity.value, 10);

    this.differenceQty.setValue(differentQty || 0, { onlySelf: true });

    if (Math.sign(differentQty) === 0) {
      this.signDifferentQty = '';
    } else if (Math.sign(differentQty) === 1) {
      this.signDifferentQty = '(+)';
    } else {
      this.signDifferentQty = '(-)';
    }
  }
}
