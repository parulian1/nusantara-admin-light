import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { products, ISubLocation, drf } from '@nusantara/models';
import { IProductClass } from '@nusantara/models/products';
import { getSlugFromHref, PagedResponse } from '@nusantara/core';
import { IStockRecord } from '@nusantara/models/inventory';

@Component({
  selector: 'nus-adjustment-line',
  template: `
    <tr class="tid-data-row">
      <td title="{{ displayedName }}"><a title="{{ displayedName }}">{{ displayedName }}</a></td>

      <td class="numeric">{{ originalQuantity.value }}</td>

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

      <td class="numeric">
        <div style="display: flex; justify-items: center; align-items: center;">
          <div style="position: relative;width: 100%">
            <span data-qa="difference-qty">{{ adjustmentQuantity.value }}</span>
            <div
              *ngIf="adjustmentQuantity.errors"
              style="color: red; position: absolute; bottom: -1.1rem;width: 100%;">
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
        <input type="text" [formControl]="notes">
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
      <td>
        <button class="open-detail-button" [ngClass]="{'show': showDetail.value}" (click)="openDetail.emit()"
                type="button">
          <i class="material-icons">expand_more</i>
        </button>
      </td>
    </tr>
    <tr class="td-detail-row" [ngClass]="{'show': showDetail.value}">
      <td colspan="8">
        <div class="stock-record-detail-info">
          <span><b>SKU</b> {{ sku.value }}</span>
          <span><b>Receiving Date</b> {{ created.value | date }}</span>
          <span><b>Batch</b> {{ (batch.value) || "-" }}</span>
          <span><b>Expiry Date</b> {{ (expiryDate.value | date) || "-" }}</span>
        </div>
      </td>
    </tr>
  `,
  styles: [
    ':host { display: contents; }',
    'td:nth-child(1) { min-width: 115px; }',
    'td:nth-child(2) { width: 80px; }',
    'td:nth-child(3) { width: 108px; }',
    'td:nth-child(4) { width: 108px; }',
    'td:nth-child(7) { width: 5%; }',
    'td:last-child { width: 2%; }',
    'td>div>input {float: left; width: 80%;}',
    'td>div>button {float: left; width: 20%;}',
    'resolve-button { border: none;}',
    `
      .td-detail-row {
        height: 0;
        transition: height 0.8s ease-in-out;
        overflow: hidden;
      }

      .td-detail-row td {
        padding: 0 14px;
      }

      .td-detail-row td div {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        width: 100%;
        box-sizing: border-box;
        max-height: 0;
        transition: max-height 0.8s ease-in-out;
        overflow: hidden;
      }

      .td-detail-row.show {
        height: 48px;
        transition: height 0.8s ease-in-out;
      }

      .td-detail-row.show > td {
        border-bottom: 1px solid var(--grey);
      }

      .td-detail-row.show > td > div {
        max-height: 48px;
        transition: max-height 0.8s ease-in-out;
      }
    `,
    `
      .open-detail-button {
        background: transparent;
        border: none;
        transition: all .5s;
        color: var(--darken-grey);
      }
      .open-detail-button i{
        transition: transform 0.2s ease-out;
      }
      .open-detail-button.show i{
        transform: rotate(180deg);
      }
    `
  ]
})
export class AdjustmentLineItemComponent implements OnInit {
  @Input() warehouse: { href: string };
  @Input() availableSubLocations: ISubLocation[] = [];
  @Input() productClasses: IProductClass[];
  @Input() form: AbstractControl;
  @Input() reasons: drf.IChoice[] = [];
  @Input() subLocation: ISubLocation;
  @Input() csvData: { page: PagedResponse<IStockRecord>, data: any, key: string, mappedValue: any };
  @Input() index: number;
  @Input() adjustmentMode: string;
  @Input() href: string;
  @Output() remove = new EventEmitter<void>();
  @Output() openDetail = new EventEmitter<void>();

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

  get showDetail(): FormControl {
    return this.form.get('showDetail') as FormControl;
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
