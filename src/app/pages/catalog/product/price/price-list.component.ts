import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';

import { AbstractEditingComponent, IChoiceFieldChoice } from '@nusantara/core';
import { ActivatedRoute } from '@angular/router';
import { IPriceListRange } from '@nusantara/models';

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

      <label>
        <input type="checkbox" [formControl]="isProgressive">
        <span>Is Progressive</span>
      </label>

      <nus-price-list-range
        *ngFor="let range of ranges.controls"
        [form]="range">
      </nus-price-list-range>

    </div>
  `,
  styles: []
})
export class PriceListComponent extends AbstractEditingComponent implements OnInit {

  @Input() form: FormGroup;

  types: Array<IChoiceFieldChoice>;

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
    this.route.data.subscribe((data: {priceListTypes: IChoiceFieldChoice[]}) => {
      this.types = data.priceListTypes;
    });
  }

  addRange(range?: IPriceListRange) {
    const f = this.fb.group({
      href: [range?.href, []],
      priceList: [range?.priceList, []],
      price: [range?.price, []],
      maxQuantity: [range?.maxQuantity, []],
      minQuantity: [range?.minQuantity, []]
    });
    this.ranges.push(f);
  }
  removeRange() { }
}
