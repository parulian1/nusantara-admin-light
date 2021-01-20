import { Component, EventEmitter, Input, ViewChild } from '@angular/core';
import { DialogResult } from '@nusantara/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';

/**
 * Simple confirmation modal dialog
 *
 */
@Component({
  selector: 'nus-confirm-receiving-modal',
  template: `
    <ngx-smart-modal
      [identifier]="'confirm'"
      #modal
      [customClass]="'nsm-centered'"
    >
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
      <button class="control secondary" (click)="cancel()" type="button">
        Cancel
      </button>
      <button class="control" (click)="close()" type="button" id="confirm-button">Yes</button>
    </ngx-smart-modal>
  `,
  styles: [
    'p {margin-bottom: 30px}',
    'button:not(:first-child) { margin-left: 5px; }',
    'h1{font-weight: 700}',
    'button { min-width: 105px;width: 200px; height: 40px;border-radius: 4px;}',
    'button.control.secondary{border-color: #365DC3;color: #365DC3; }',
    '#confirm-button{background-color: #365DC3}',
  ],
})
export class ConfirmModalReceivingOrderComponent {
  @ViewChild('modal') modal: NgxSmartModalComponent;
  result: DialogResult = DialogResult.Cancelled;
  @Input() title = 'Are You Sure?';
  @Input() content = 'The product you added will not be saved if you cancel.';

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
    window.location.reload();
  }

  cancel() {
    this.modal.close();
  }
}
