import { Input, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AbstractDetailComponent } from '@nusantara/core';

@Component({
  selector: 'nus-detail-actions',
  template: `
    <div class="actions-container">
      <button type="submit" [disabled]="!component.form.valid">Save</button>
      <button (click)="component.navigateToParent(true)">Cancel</button>
      <button (click)="component.delete()" *ngIf="!component.isNew">Delete</button>
    </div>
  `,
  styles: [

  ]
})
export class DetailActionsComponent {
  @Input() component: AbstractDetailComponent;
}
