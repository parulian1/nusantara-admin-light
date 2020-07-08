import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AbstractEditingComponent } from '@nusantara/core';

/**
 * A single price for a given number of products.
 */
@Component({
  selector: 'nus-price-list-range',
  template: `
    <tr [formGroup]="form" class="immediate-error-display">
      <td>
        <input type="number"
               [formControl]="price">
      </td>
      <td style="text-align: left;">
        <input type="number"
               [formControl]="minQuantity"
               [readonly]="isInitialRange"
               [hidden]="isInitialRange">
        <span *ngIf="isInitialRange">{{ minQuantity.value }}</span>
      </td>
      <td>
        <input type="number"
               [formControl]="maxQuantity"
               [readonly]="isTerminalRange"
               [hidden]="isTerminalRange">
      </td>
      <td>
        <button type="button"
                [disabled]="!canBeRemoved"
                (click)="remove.emit()">X</button>
      </td>
    </tr>
  `,
  styles: [':host { display: contents; }']
})
export class PriceListRangeComponent extends AbstractEditingComponent implements OnInit {

  @Input() index: number;
  @Input() allRanges: Array<FormGroup>;

  /**
   * Triggered by the host component whenever any changes occur to
   * the siblings of this price list.
   */
  @Input() siblingQuantityChanged: EventEmitter<number>;

  @Output() quantityChanged = new EventEmitter<number>();
  @Output() remove = new EventEmitter();

  /**
   * When true, prevents emitting changed from min/maxQuantity.
   */
  suspendQuantityChangedEmitter = false;

  get href(): FormControl { return this.form.get('href') as FormControl; }
  get priceList(): FormControl { return this.form.get('priceList') as FormControl; }
  get price(): FormControl { return this.form.get('price') as FormControl; }
  get maxQuantity(): FormControl { return this.form.get('maxQuantity') as FormControl; }
  get minQuantity(): FormControl { return this.form.get('minQuantity') as FormControl; }

  /**
   * Indicates whether this price list may be removed.
   * The first range inside of a price list **may not** be removed (as a price list always
   * requires at least 1 price list starting at quantity 1).
   */
  get canBeRemoved(): boolean { return !this.isInitialRange; }

  get isInitialRange(): boolean { return this.index === 0; }
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

  ngOnInit() {
    this.maxQuantity.valueChanges.subscribe(() => this.onQuantityChanged());
    this.minQuantity.valueChanges.subscribe(() => this.onQuantityChanged());
    this.siblingQuantityChanged.subscribe((i) => this.onSiblingQuantityChanged(i));
    this.priceList.valueChanges.subscribe((val) => {
      console.log(this.index, 'List Value changed', val);
    });
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
    console.log('Got sibling index changed', siblingIndex, 'my own index is ', this.index, 'and my price is', this.price.value);

    this.suspendQuantityChangedEmitter = true;
    if (siblingIndex === (this.index - 1)) {
      this.minQuantity.setValue(this.minQuantityAllowed);
    } else if (siblingIndex === (this.index + 1)) {
      this.maxQuantity.setValue(this.maxQuantityAllowed);
    }
    this.suspendQuantityChangedEmitter = false;
  }
}
