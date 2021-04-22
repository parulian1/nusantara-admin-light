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
        <input type="number" min="0" [formControl]="differenceQty" (keyup)="onKeyUpDifferentQty()" data-qa="adjusted-qty">
      </td>

      <td>
        <div style="display: flex; justify-items: center; align-items: center;">
          <div style="position: relative;">
            <input type="text" [formControl]="adjustmentQuantity" data-qa="difference-qty" readonly><br />
            <div
              *ngIf="adjustmentQuantity.errors"
              style="color: red; position: absolute; bottom: -1.1rem;">
              <span *ngIf="adjustmentQuantity.hasError('min')">min -32767</span>
              <span *ngIf="adjustmentQuantity.hasError('max')">max 32767</span>
            </div>
          </div>
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

  constructor(
    public route: ActivatedRoute,
    public router: Router,
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

  get originalQuantity(): FormControl { return this.form.get('originalQuantity') as FormControl; }
  get adjustmentQuantity(): FormControl { return this.form.get('adjustmentQuantity') as FormControl; }
  get differenceQty(): FormControl { return this.form.get('differenceQty') as FormControl; }

  get created(): FormControl { return this.form.get('created') as FormControl; }
  get reason(): FormControl { return this.form.get('reason') as FormControl; }
  get notes(): FormControl { return this.form.get('notes') as FormControl; }

  ngOnInit(): void {
    this.calculateDifferentQty();
  }

  ngAfterViewInit(): void { }

  onKeyUpDifferentQty(): void {
    this.calculateDifferentQty();
  }

  calculateDifferentQty(): void {
    let differentQty = 0;
    if (this.differenceQty.value !== null) {
      differentQty = +this.differenceQty.value - +this.originalQuantity.value;
    }
    this.adjustmentQuantity.setValue(differentQty);
  }
}
