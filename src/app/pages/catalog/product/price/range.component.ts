import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AbstractEditingComponent } from '@nusantara/core';
import { products } from '@nusantara/models';

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
    <div [formGroup]="form" class="wrapper immediate-error-display">
      <div style="text-align: left;">
        <input type="number"
               [formControl]="minQuantity"
               [readonly]="isInitialRange">
      </div>
      <div><strong>To</strong></div>
      <div>
        <input type="number"
               [formControl]="maxQuantity"
               [readonly]="isTerminalRange">
      </div>
      <div class="immediate-error-display">
        <span class="currency">
          <input type="number" [formControl]="price">
        </span>  
      </div>
      <div>
        <button type="button"
                class="remove-button"
                [disabled]="isInitialRange"
                (click)="remove.emit(this)">
          <i class="material-icons">delete_outline</i>
        </button>
      </div>
    </div>
  `,
  styles: [':host { display: contents; }',
  `    
    .wrapper {
      display: grid;
      grid-template-columns: 1fr 20px 1fr 1fr 30px;
      gap: 20px;
      align-items: center;
      margin-bottom: 10px;
    }

    input,select {
      height: 40px;
      border-radius: 4px;
      background: #ffffff;
    }

    .currency {
      display: inline-block;
      position: relative;
      width: 100%;
    }
    
    .currency::before {
      content: "Rp";
      position: absolute;
      font-weight: bold;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
    }

    .currency input {
      padding-left: 35px;
    }

  `
]
})
export class RangeComponent extends AbstractEditingComponent implements OnInit {

  @Input() index: number;
  @Input() allRanges: Array<FormGroup>;

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
    this.maxQuantity.valueChanges.subscribe(() => this.onQuantityChanged());
    this.minQuantity.valueChanges.subscribe(() => this.onQuantityChanged());
    this.siblingQuantityChanged.subscribe((i) => this.onSiblingQuantityChanged(i));

    this.priceList.valueChanges.subscribe((val) => {
      console.log(this.index, 'List Value changed', val);
    });
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
      this.minQuantity.setValue(this.minQuantityAllowed);
    } else if (siblingIndex === (this.index + 1)) {
      this.maxQuantity.setValue(this.maxQuantityAllowed);
    }
    this.suspendQuantityChangedEmitter = false;
  }

}
