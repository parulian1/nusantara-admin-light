import { Component, Input } from '@angular/core';

/**
 * Simple component that shows a checkmark if value is true, otherwise
 * shows an X.
 *
 * @param value - An expression that evaluates to either true or false.
 * @param showTrueIcon (optional, default true)
 * @param showFalseIcon (optional, default true)
 */
@Component({
  selector: 'nus-true-false',
  template: `
    <i class="material-icons yes" *ngIf="value && showTrueIcon">check</i>
    <i class="material-icons no" *ngIf="!value && showFalseIcon">close</i>
  `,
  styles: [
    '.yes { color: var(--success); }',
    '.no { color: var(--error); }',
  ]
})
export class TrueFalseComponent {
  @Input() value;
  @Input() showTrueIcon = true;
  @Input() showFalseIcon = true;
}
