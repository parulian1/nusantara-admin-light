import { Component, EventEmitter, Input, Output } from '@angular/core';
import {AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'nus-product-promo-quantity',
  template: `
    <tr>
      <th>{{ index + 1 }}</th>
      <td>{{ form.get('name').value }}</td>
      <td><input type="number" [formControl]="quantity" placeholder="Quantity"/></td>
      <td>
        <button (click)="remove.emit()" type="button" class="remove-button">
          <i class="material-icons">remove_circle_outline</i>
        </button>
      </td>
    </tr>
  `,
  styles: [':host { display: contents; }']
})
export class ProductPromoQuantityComponent {

  @Input() form: AbstractControl;
  @Input() index: number;
  @Output() remove: EventEmitter<void> = new EventEmitter();

  get quantity(): FormControl {
    return this.form.get('quantity') as FormControl;
  }

}
