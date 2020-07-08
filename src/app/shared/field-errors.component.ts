import { Input, Component } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * Shows error messages for a given angular form control, of the following types:
 *
 * 1. 'required'
 * 2. 'apiError'
 *
 * @example Simple Usage
 * ```html
 * <form [form]='yourAngularForm'>
 *   <label>
 *     My Input
 *     <input [formControl]='myInput'>
 *     <nus-field-errors [control]='myInput'></nus-field-errors>
 *   </label>
 * </form>
 * ```
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
