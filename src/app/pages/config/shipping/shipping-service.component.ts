import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'nus-shipping-service',
  template: `
    <tr [formGroup]="form">
      <td><input type="text" [formControl]="name"></td>
      <td><input type="checkbox" [formControl]="isActive"></td>
      <td><input type="number" [formControl]="minimumWeight"></td>
      <td><input type="number" [formControl]="handlingFee"></td>
      <td><input type="number" [formControl]="graceAmount"></td>
      <td><input type="text" [formControl]="description"></td>
      <td><button type="button" (click)="remove.emit()" *ngIf="!href.value">Remove</button></td>
    </tr>
  `,
  styles: [':host { display: contents; }' ]
})
export class ShippingServiceComponent {

  @Input() form: FormGroup;
  @Output() remove: EventEmitter<void> = new EventEmitter();

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get href(): FormControl { return this.form.get('href') as FormControl; }
  get isActive(): FormControl { return this.form.get('isActive') as FormControl; }
  get icon(): FormControl { return this.form.get('icon') as FormControl; }
  get minimumWeight(): FormControl { return this.form.get('minimumWeight') as FormControl; }
  get handlingFee(): FormControl { return this.form.get('handlingFee') as FormControl; }
  get graceAmount(): FormControl { return this.form.get('graceAmount') as FormControl; }
  get description(): FormControl { return this.form.get('description') as FormControl; }
}
