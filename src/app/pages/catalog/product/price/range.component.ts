import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {AbstractEditingComponent, Logger} from '@nusantara/core';
import { products } from '@nusantara/models';
import {debounceTime} from 'rxjs/operators';

const logger = new Logger('RangeComponent');

/**
 * A single price for a given number of products.
 *
 * This component does not communicate changes to a server, and only
 * displays the current values for a price list range, however because
 * its values are dependant on other ranges within a price list, there
 * is quite a bit of complex logic here.
 */
@Component({
  selector: 'nus-price-list-range',
  template: `
    <div [formGroup]="form" class="immediate-error-display price-range-idx-{{index}}">
      <div class="header-grid container-grid" *ngIf="hasTitle">
        <div class="qty-area" i18n>Qty</div>
        <div class="price-area1" i18n>Price</div>
        <div class="action-area1" i18n>Action</div>
      </div>
      <div class="content-grid container-grid">
        <div class="qty-min-area">
          <input type="number"
                 placeholder="Input 1-10000"
                 i18n-placeholder
                 [formControl]="minQuantity"
                 name="min-quantity"
                 [readonly]="isInitialRange"
                 data-qa="min-quantity"/>
        </div>
        <div class="qty-max-area">
          <input type="number"
                 [formControl]="maxQuantity"
                 name="max-quantity"
                 [readonly]="isTerminalRange"
                 placeholder="Input 1-10000"
                 i18n-placeholder
                 data-qa="max-quantity" />
        </div>

        <div class="price-area">

           <span class="currency">
          <input type="number"
                 min="0"
                 appOnlyNumber
                 [formControl]="price"
                 name="price"
                 placeholder="Input 0-{{MAX_PRICE}}"
                 i18n-placeholder
                 data-qa="price"/>
        </span>
        </div>
        <div class="action-area">
          <button type="button"
                  [disabled]="isInitialRange"
                  (click)="remove.emit(this)">
            <i class="material-icons">delete_outline</i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [':host { display: contents; }',
  '.wrapper { margin-bottom: 16px; display: grid; grid-template-columns: 1fr 16px 1fr 1fr 30px; grid-column-gap: 16px; grid-row-gap: 4px; align-items: center; }',
  '.currency { display: inline-block; position: relative; width: 100%; }',
  '.currency::before { content: "Rp"; position: absolute; left: 10px; top: 50%; transform: translateY(-50%); }',
  '.currency input { padding-left: 35px; }',
  'button { background: transparent; border: none; padding: 0; opacity: .5; }',
    `
      .container-grid {  display: grid;
        grid-template-columns: 2.5fr 2.5fr 9fr 2fr;
        gap: 8px 8px;
        grid-auto-flow: row;
        grid-template-areas:
        "qty-area qty-area price-area1 action-area1"
    "qty-min-area qty-max-area price-area action-area";
        padding: 0 8px 0 8px
      }
      .price-area { grid-area: price-area; }
      .qty-max-area { grid-area: qty-max-area; }
      .qty-min-area { grid-area: qty-min-area; }
      .action-area { grid-area: action-area;        justify-self: center;
        align-self: center; }
      .qty-area { grid-area: qty-area; }
      .price-area1 { grid-area: price-area1; }
      .action-area1 {
        justify-self: center;
        align-self: center;
        grid-area: action-area1;
      }
        .header-grid {
          /* UI / Darken White */

          background: #F4F4F4;
          font-family: 'Open Sans', sans-serif;
          font-style: normal;
          font-weight: 700;
          font-size: 14px;
          line-height: 20px;
          align-items: center;

          padding: 8px 12px 0 12px;
        }

    `
]
})
export class RangeComponent extends AbstractEditingComponent implements OnInit {
  readonly MAX_PRICE = 999999999;

  @Input() index: number;
  @Input() allRanges: Array<FormGroup>;
  @Input() hasTitle = false;

  /**
   * Triggered by the host component whenever any changes occur to
   * the siblings of this price list.
   */
  @Input() siblingQuantityChanged: EventEmitter<number>;

  /**
   * Notifies host component that minQuantity or maxQuantity has changed,
   * so that other list ranges may update themselves.
   */
  @Output() quantityChanged = new EventEmitter<number>();

  /**
   * Notifies host component to remove this range from a price list.
   */
  @Output() remove = new EventEmitter<RangeComponent>();

  /**
   * When true, prevents emitting changed from min/maxQuantity.
   */
  suspendQuantityChangedEmitter = false;

  ngOnInit() {
    this.maxQuantity.valueChanges.pipe(debounceTime(300)).subscribe(() => this.onQuantityChanged());
    this.minQuantity.valueChanges.pipe(debounceTime(300)).subscribe(() => this.onQuantityChanged());
    this.siblingQuantityChanged.subscribe((i) => this.onSiblingQuantityChanged(i));

    this.priceList.valueChanges.subscribe((val) => {
      console.log(this.index, 'List Value changed', val);
    });
    this.price.setValidators([Validators.min(0), Validators.max(this.MAX_PRICE)]);
  }

  /**
   * Gets this component's current value as the underlying entity
   * type that is represents.
   */
  toEntity(): products.IPriceListRange {
    return this.form.value as products.IPriceListRange;
  }

  get href(): FormControl { return this.form.get('href') as FormControl; }
  get priceList(): FormControl { return this.form.get('priceList') as FormControl; }
  get price(): FormControl { return this.form.get('price') as FormControl; }
  get maxQuantity(): FormControl { return this.form.get('maxQuantity') as FormControl; }
  get minQuantity(): FormControl { return this.form.get('minQuantity') as FormControl; }

  /**
   * Indicates if this range is the first within a price list.
   * Initial ranges may not be removed from a price list and must have a minQuantity = 0.
   */
  get isInitialRange(): boolean { return this.index === 0; }

  /**
   * Indicates if this is the last range within a price list.
   * Terminal ranges must have a maxQuantity = null.
   */
  get isTerminalRange(): boolean { return this.index + 1 === this.allRanges.length; }

  /**
   * Returns the price range immediately prior to this price range.
   */
  get predecessorRange(): FormGroup {
    if (!this.isInitialRange) {
      return this.allRanges[this.index - 1];
    }
    return null;
  }

  get successorRange(): FormGroup {
    if (!this.isTerminalRange) {
      return this.allRanges[this.index + 1];
    }
    return null;
  }

  get minQuantityAllowed(): number {
    if (this.isInitialRange) {
      return 1;
    }
    return (this.predecessorRange.get('maxQuantity').value as number) + 1;
  }

  get maxQuantityAllowed(): number {
    if (this.isTerminalRange) {
      return Number.MAX_VALUE;
    }
    return (this.successorRange.get('minQuantity').value as number) - 1;
  }

  /**
   * Triggered whenever the min/max quantity fields are updated directly
   * for this price range.
   */
  onQuantityChanged(): void {
    this.updateValidators();
    if (!this.suspendQuantityChangedEmitter) {
      this.quantityChanged.emit(this.index);
    }
  }

  updateValidators() {
    this.maxQuantity.clearValidators();
    this.minQuantity.clearValidators();
    this.minQuantity.setValidators([
      Validators.required,
      Validators.min(this.index + 1),
    ]);

    if (!this.isTerminalRange) {
      this.maxQuantity.setValidators([
        Validators.required,
        Validators.min(this.minQuantity.value),
      ]);
    }
    this.maxQuantity.updateValueAndValidity({emitEvent: false});
    this.minQuantity.updateValueAndValidity({emitEvent: false});
  }

  /**
   * Updates the min/max quantity settings for this price range when
   * a sibling price range changes.
   *
   * @param siblingIndex the index of the price range that triggered the update.
   *  Unless the sibling is the direct predecessor or successor to this price range
   *  the notification will be ignored.
   */
  onSiblingQuantityChanged(siblingIndex: number): void {
    this.suspendQuantityChangedEmitter = true;
    if (siblingIndex === (this.index - 1)) {
      logger.debug('onSiblingQuantityChanged-1', siblingIndex, this.index);
      // this.minQuantity.setValue(this.minQuantityAllowed);
    } else if (siblingIndex === (this.index + 1)) {
      // this.maxQuantity.setValue(this.maxQuantityAllowed);
      logger.debug('onSiblingQuantityChanged-2', siblingIndex, this.index);
    } else {
      logger.debug('onSiblingQuantityChanged-3', siblingIndex, this.index);
    }
    this.suspendQuantityChangedEmitter = false;
  }

  validatePriceRange(): boolean {
    let isValid = true;
    const firstCase = this.minQuantity.value === 0;
    const secondCase = this.maxQuantity.value !== null && this.maxQuantity.value < this.minQuantity.value;
    if (firstCase) {
      isValid = false;
    }
    if (secondCase) {
      isValid = false;
    }
    return isValid;
  }

}
