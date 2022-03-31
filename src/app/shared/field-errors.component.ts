import { SimpleChanges } from '@angular/core';
import {Input, Component, OnInit, OnChanges} from '@angular/core';
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
    <div *ngIf="!!control?.errors || control?.touched || control?.dirty" class="error-detail">
      <div *ngIf="control?.errors?.required" i18n>Required</div>
      <div *ngIf="control?.errors?.maxlength" i18n>Maximum length {{ control.getError('maxlength')?.requiredLength }} characters</div>
      <div *ngIf="control?.errors?.minlength" i18n>Minimum length {{ control.getError('minlength')?.requiredLength }} characters</div>
      <div *ngIf="control?.errors?.min" i18n>Minimum value is {{ control.getError('min')?.min }}</div>
      <div *ngIf="control?.errors?.max" i18n>
        Ensure this value is less than or equal to {{ control.getError('max')?.max }}
      </div>
      <div *ngIf="control?.errors?.fileType" i18n>
        Ensure this image type is  {{ control.getError('fileType')?.value }}
      </div>
    </div>
    <div *ngIf="control?.hasError('apiError')" class="error-detail">
      <div *ngIf="control.errors.apiError">{{ control.getError('apiError') }}</div>
    </div>
  `
})
export class FieldErrorsComponent {
  @Input() control?: FormControl;
}
