import { Component, EventEmitter, ViewChild } from '@angular/core';
import { DialogResult } from '@nusantara/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';

@Component({
  selector: 'nus-cancel-order-dialog',
  template: `
    <ngx-smart-modal [identifier]="'deleteConfirmInfo'" #modal [customClass]="'no-close-icon-modal no-padding-modal'">
      <div class="wrapper">
        <div class="message">
          <h2 class="heading-2">Cancel Order Confirmation</h2>
          <p class="body-2">Are you sure you want to cancel this order?</p>
        </div>
        <div class="action">
          <button class="control" (click)="close()" type="button">Yes</button>
          <button class="control secondary ghost" (click)="cancel()" type="button">
            No
          </button>
        </div>
      </div>
    </ngx-smart-modal>
  `,
  styles: [
    'h2 { margin-bottom: 11px; }',
    'p { color: var(--darken-grey); }',
    '.wrapper { padding: 16px; }',
    '.message { margin: 0 8px 32px 8px; }',
    'div.action { display: flex; justify-content: space-between; }',
    'button { width: 100% }',
    'button:not(:first-of-type) { margin-left: 5px; }',
  ],
})
export class CancelOrderDialogComponent {
  @ViewChild('modal') modal: NgxSmartModalComponent;
  result: DialogResult = DialogResult.Cancelled;

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