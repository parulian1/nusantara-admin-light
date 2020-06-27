import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { AbstractEditingComponent } from '@nusantara/core';

/**
 * A single price for a given number of products.
 */
@Component({
  selector: 'nus-price-list-range',
  template: `
    <tr [formGroup]="form">
      <td>
        <input type="number" [formControl]="price">
      </td>
      <td>
        <input type="number" [formControl]="minQuantity">
      </td>
      <td>
        <input type="number" [formControl]="maxQuantity">
      </td>
    </tr>
  `,
  styles: []
})
export class PriceListRangeComponent extends AbstractEditingComponent {

  @Input() form: FormGroup;

  get href(): FormControl { return this.form.get('href') as FormControl; }
  get priceList(): FormControl { return this.form.get('priceList') as FormControl; }
  get price(): FormControl { return this.form.get('price') as FormControl; }
  get maxQuantity(): FormControl { return this.form.get('maxQuantity') as FormControl; }
  get minQuantity(): FormControl { return this.form.get('minQuantity') as FormControl; }
}
