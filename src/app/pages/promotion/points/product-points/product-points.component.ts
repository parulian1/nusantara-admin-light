import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'nus-product-points',
  template: `
    <tr [formGroup]="form">
      <td>{{ form.get('product').get('name').value }}</td>
      <td>
        <input type="number" [formControl]="amount" placeholder="Points"/></td>
      <td>
        <button (click)="remove.emit()" type="button" class="remove-button">
          <i class="material-icons">remove_circle_outline</i>
        </button>
      </td>
    </tr>
  `,
  styles: [':host { display: contents; }']
})
export class ProductPointsComponent {

  @Input() form: FormGroup;
  @Output() remove: EventEmitter<void> = new EventEmitter();

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }
}
