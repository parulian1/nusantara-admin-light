import { Input, Output, EventEmitter, Component } from '@angular/core';

import { AbstractDetailComponent } from '@nusantara/core';

/**
 * Buttons to allow saving/cancelling or deleting an object (typically from a details page).
 */
@Component({
  selector: 'nus-detail-actions',
  template: `
    <button type="submit" [disabled]="!component.form.valid" class="control">Save</button>
    <button type="button" (click)="cancel.emit()" class="control secondary">Cancel</button>
    <button type="button" (click)="delete.emit()" *ngIf="!component.isNew" class="control danger">Delete</button>
  `,
  styles: [
    ':host { display: flex; margin-top: 1.5em; }',
    ':not(:first-child) { margin-left: 5px; }',
    'button.danger { margin-left: auto }',
    'button { min-width: 105px; }',
  ]
})
export class DetailActionsComponent {
  @Input() component: AbstractDetailComponent<any>;
  @Output() cancel = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
}
