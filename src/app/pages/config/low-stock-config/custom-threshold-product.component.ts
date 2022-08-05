import {Component, EventEmitter, Input, Output} from "@angular/core";
import {AbstractControl, FormControl} from "@angular/forms";

@Component({
  selector:'nus-custom-threshold-product',
  template:`
    <tr>
      <td>{{ form.get('name').value }}</td>
      <td>{{ form.get('upc').value }}</td>
      <td class="numeric">
        <input type="number" [formControl]="amount" placeholder="Input Qty" min="1" />
        <nus-field-errors [control]="amount"></nus-field-errors>
      </td>
      <td class="action">
        <button (click)="remove.emit()" type="button" class="remove-button">
          <i class="material-icons">delete_outline</i>
        </button>
      </td>
    </tr>
  `,
  styles: [':host { display: contents; }']
})
export class CustomThresholdProductComponent {
  @Input() form: AbstractControl;
  @Output() remove: EventEmitter<void> = new EventEmitter();

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }
}
