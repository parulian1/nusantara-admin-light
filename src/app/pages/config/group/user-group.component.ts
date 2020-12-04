import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'nus-user-group',
  template: `
    <tr [formGroup]="form">
      <td><input type="text" [formControl]="name"></td>
      <td><button type="button" (click)="remove.emit()" *ngIf="!href.value">Remove</button></td>
    </tr>
  `,
  styles: [':host { display: contents; }' ]
})
export class UserGroupComponent {

  @Input() form: FormGroup;
  @Output() remove: EventEmitter<void> = new EventEmitter();

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get href(): FormControl { return this.form.get('href') as FormControl; }
}
