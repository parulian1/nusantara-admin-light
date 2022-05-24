import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { products, ISubLocation, drf } from '@nusantara/models';
import { IProductClass } from '@nusantara/models/products';
import { getSlugFromHref, PagedResponse } from '@nusantara/core';
import { IStockRecord } from '@nusantara/models/inventory';

@Component({
  selector: 'nus-adjustment-line',
  template: `
    <tr [formGroup]="form">
      <td title="{{ displayedName }}"><a title="{{ displayedName }}">{{ displayedName }}</a></td>

      <td title="{{ sku.value }}">{{ sku.value }}</td>

      <td class="immediate-error-display">
        <div>{{ created.value | date }}</div>
      </td>

      <td title="{{ batch.value }}">{{ batch.value }}</td>

      <td>{{ expiryDate.value | date }}</td>

      <td>{{ originalQuantity.value }}</td>

      <td>
        <div style="display: flex; justify-items: center; align-items: center;">
          <div style="position: relative;">
            <input type="number" min="0" [formControl]="differenceQty" (keyup)="onKeyUpDifferentQty()"
                   data-qa="adjusted-qty">
            <br/>
            <div
              *ngIf="differenceQty.errors"
              style="color: red; position: absolute; bottom: -1.1rem;">
              <span *ngIf="differenceQty.hasError('min')">min 0</span>
            </div>
          </div>
        </div>
      </td>

      <td>
        <div style="display: flex; justify-items: center; align-items: center;">
          <div style="position: relative;">
            <span data-qa="difference-qty">{{ adjustmentQuantity.value }}</span>
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


      <td class="add-note-action">
        <button type="button" class="add-note-button" (click)="addNote.emit()" data-qa="add-note-button">
          <i class="material-icons">sticky_note_2</i>
        </button>
      </td>

      <td>
        <button (click)="remove.emit()" type="button" class="remove-button" data-qa="remove-button">
          <i class="material-icons">delete_outline</i>
        </button>
        <button
          *ngIf="adjustmentMode !== 'manual' && csvData.page.totalResults > 1"
          (click)="resolveConflict(index, csvData)" type="button" class="resolve-button" data-qa="resolve-button" i18n>
          <span class="material-icons">warning</span>Update
        </button>
      </td>
    </tr>
  `,
  styles: [
    ':host { display: contents; }',
    'td:nth-child(2) select { min-width: 115px; }', // location
    'td:nth-child(3) input { width: 70px; }', // quantity
    'td:nth-child(8) input { width: 105px; }', // cost
    'td.add-note-action { padding: 6px 0; }',
    'td>div>input {float: left; width: 80%;}',
    'td>div>button {float: left; width: 20%;}',
    'resolve-button { border: none;}',
    `
      .add-note-button {
        background: transparent;
        border: none;
        transition: all .5s;
        padding: 1px 0;
      }
      .add-note-button:hover {
        opacity: 1;
        color: var(--bhisma-orange);
      }
    `
  ]
})
export class AdjustmentLineItemComponent implements OnInit {
  @Input() warehouse: { href: string };
  @Input() availableSubLocations: ISubLocation[] = [];
  @Input() productClasses: IProductClass[];
  @Input() form: FormGroup;
  @Input() reasons: drf.IChoice[] = [];
  @Input() subLocation: ISubLocation;
  @Input() csvData: { page: PagedResponse<IStockRecord>, data: any, key: string, mappedValue: any };
  @Input() index: number;
  @Input() adjustmentMode: string;
  @Input() href: string;
  @Output() remove = new EventEmitter<void>();
  @Output() addNote = new EventEmitter<void>();

  @Output() conflict = new EventEmitter<{
    'index': number,
    'data': any
  }>();

  constructor(
    public route: ActivatedRoute,
    public router: Router,
  ) {
  }

  get displayedName(): string {
    const receivingId = getSlugFromHref(this.receivingOrder.value.href);
    const p = this.product.value as products.IProduct;
    return `${receivingId} / ${p.name}`;
  }

  get product(): FormControl {
    return this.form.get('product') as FormControl;
  }

  get location(): FormGroup {
    return this.form.get('location') as FormGroup;
  }

  get sku(): FormControl {
    return this.form.get('sku') as FormControl;
  }

  get batch(): FormGroup {
    return this.form.get('batch') as FormGroup;
  }

  get receivingOrder(): FormControl {
    return this.form.get('receivingOrder') as FormControl;
  }

  get originalQuantity(): FormControl {
    return this.form.get('originalQuantity') as FormControl;
  }

  get adjustmentQuantity(): FormControl {
    return this.form.get('adjustmentQuantity') as FormControl;
  }

  get differenceQty(): FormControl {
    return this.form.get('differenceQty') as FormControl;
  }

  get created(): FormControl {
    return this.form.get('created') as FormControl;
  }

  get expiryDate(): FormControl {
    return this.form.get('expiryDate') as FormControl;
  }

  get reason(): FormControl {
    return this.form.get('reason') as FormControl;
  }

  get notes(): FormControl {
    return this.form.get('notes') as FormControl;
  }

  ngOnInit(): void {
    this.calculateDifferentQty();
  }

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

  resolveConflict(idx, data) {
    this.conflict.emit({
      index: idx,
      data
    });
  }
}
