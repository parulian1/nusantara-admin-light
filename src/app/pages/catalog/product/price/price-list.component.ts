import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AbstractEditingComponent } from '@nusantara/core';
import { drf, products } from '@nusantara/models';

/**
 * Shows the details for one price list assigned to a product.
 *
 * @see IProduct
 */
@Component({
  selector: 'nus-price-list',
  template: `
    <div [formGroup]="form">
      <label>
        <span>Type</span>
        <select [formControl]="type">
          <option
            *ngFor="let opt of types"
            [ngValue]="opt.value">{{ opt.displayName }}
          </option>
        </select>
      </label>

      <label class="without-field-errors">
        <input type="checkbox" [formControl]="isProgressive">
        Is Progressive
      </label>

      <table>
        <thead>
        <tr>
          <th>Price</th>
          <th>Min</th>
          <th>Max</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <nus-price-list-range
          *ngFor="let range of ranges.controls; let i=index"
          [form]="range"
          [index]="i"
          [allRanges]="ranges.controls"
          (quantityChanged)="onRangeQuantityChanged(i)"
          [siblingQuantityChanged]="rangeQuantityChanged">
        </nus-price-list-range>
        </tbody>
      </table>

      <button type="button" (click)="addRange()">Add Range</button>

    </div>
  `,
  styles: []
})
export class PriceListComponent extends AbstractEditingComponent implements OnInit {

  @Input() form: FormGroup;
  rangeQuantityChanged = new EventEmitter<number>();

  types: Array<drf.IChoice>;

  constructor(protected route: ActivatedRoute,
              protected fb: FormBuilder) { super(); }

  get href(): FormControl { return this.form.get('href') as FormControl; }
  get type(): FormControl { return this.form.get('type') as FormControl; }
  get product(): FormControl { return this.form.get('product') as FormControl; }
  get ranges(): FormArray { return this.form.get('ranges') as FormArray; }
  get isProgressive(): FormControl { return this.form.get('isProgressive') as FormControl; }
  get platforms(): FormArray { return this.form.get('platforms') as FormArray; }
  get locations(): FormArray { return this.form.get('locations') as FormArray; }

  ngOnInit() {
    this.route.data.subscribe((data: {priceListTypes: drf.IChoice[]}) => {
      this.types = data.priceListTypes;
    });
  }

  addRange(range?: products.IPriceListRange) {
    let f: FormGroup;
    if (!range) {
      // adding a new range

      let minQuantity = 1;
      let price = 1_000;

      if (!!this.ranges.length) {
        const terminalRange = this.ranges.controls[this.ranges.length - 1];
        // set the previous terminal range's max quantity = it's min quantity
        terminalRange.get('maxQuantity').setValue(terminalRange.get('minQuantity').value);
        minQuantity = terminalRange.get('maxQuantity').value + 1;
        price = terminalRange.get('price').value;
      }
      f = this.fb.group({
        href: ['', []],
        priceList: [this.href.value, []],
        price: [price, [Validators.required, Validators.min(0)]],
        maxQuantity: [null, []],
        minQuantity: [minQuantity, [Validators.required, ]]
      });
    } else {
      // this is either the first range .. or an existing range
      f = this.fb.group({
        href: [range?.href, []],
        priceList: [range?.priceList, []],
        price: [range?.price, []],
        maxQuantity: [range?.maxQuantity, []],
        minQuantity: [range?.minQuantity, []]
      });
    }
    this.ranges.push(f);
  }
  removeRange() {
    // need to adjust the min/max quantities of the surrounding ranges
    // after removal.
  }

  onRangeQuantityChanged(index: number) {

    this.rangeQuantityChanged.emit(index);
  }

}
