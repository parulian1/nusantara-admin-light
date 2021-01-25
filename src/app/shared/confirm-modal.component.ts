import { Component, EventEmitter, Input, ViewChild } from '@angular/core';
import { DialogResult } from '@nusantara/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';

/**
 * Simple confirmation modal dialog
 *
 */
@Component({
  selector: 'nus-confirm-modal',
  template: `
    <ngx-smart-modal
      [identifier]="'confirm'"
      #modal
      [customClass]="'nsm-centered'"
    >
      <h2 class="heading-2">{{ title }}</h2>
      <p>{{ content }}</p>
      <button class="control secondary" (click)="cancel()" type="button">
        Cancel
      </button>
      <button class="control" (click)="close()" type="button">Yes</button>
    </ngx-smart-modal>
  `,
  styles: [
    'p {margin-bottom: 30px}',
    'button:not(:first-child) { margin-left: 5px; }',
  ],
})
export class ConfirmModalComponent {
  @ViewChild('modal') modal: NgxSmartModalComponent;
  result: DialogResult = DialogResult.Cancelled;
  @Input() title = 'Go Back to Previous Page?';
  @Input() content = 'Changes you made on this form will not be saved.';

  open() {
    this.modal.open();
  }

  get onClose(): EventEmitter<any> {
    return this.modal.onClose;
  }

  getValue(): FormData {
    if (this.result !== DialogResult.OK) {
      return null;
    }
  }

  close() {
    this.result = DialogResult.OK;
    this.modal.close();
  }

  cancel() {
    this.modal.close();
  }
}
