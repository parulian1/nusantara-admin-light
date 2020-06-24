import { Input, Component } from '@angular/core';

/**
 * Shows the non-field errors returned from the API.
 */
@Component({
  selector: 'nus-non-field-errors',
  template: `
    <ul class="non-field-errors" *ngIf="!!nonFieldErrors.length">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>
  `
})
export class NonFieldErrorsComponent {
  @Input() nonFieldErrors: Array<string>;
}
