import { Input, Component } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * Shows the field errors for a particular component
 */
@Component({
  selector: 'nus-field-errors',
  template: `
    <div *ngIf="control.invalid && (control.dirty || control.touched)" class="error-detail">
      <div *ngIf="control.errors.required">Required</div>
      <div *ngIf="control.errors.apiError">{{ control.getError('apiError') }}</div>
    </div>
  `
})
export class FieldErrorsComponent {
  @Input() control?: FormControl;
}
