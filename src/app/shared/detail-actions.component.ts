import { Input, Output, EventEmitter, Component } from '@angular/core';

import { AbstractDetailComponent } from '@nusantara/core';

@Component({
  selector: 'nus-detail-actions',
  template: `
    <div class="actions-container">
      <button type="submit" [disabled]="!component.form.valid">Save</button>
      <button type="button" (click)="cancel.emit()">Cancel</button>
      <button type="button" (click)="delete.emit()" *ngIf="!component.isNew">Delete</button>
    </div>
  `,
  styles: [ ]
})
export class DetailActionsComponent {
  @Input() component: AbstractDetailComponent<any>;
  @Output() cancel = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
}
