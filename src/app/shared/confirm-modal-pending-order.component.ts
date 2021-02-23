import { Component, EventEmitter, Input, ViewChild } from '@angular/core';
import {DialogResult} from '@nusantara/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
import {Location} from "@angular/common";
import {Router} from "@angular/router";

/**
 * Simple confirmation modal dialog
 *
 */
@Component({
  selector: 'nus-confirm-pending-modal',
  template: `
    <ngx-smart-modal [identifier]="'confirm'" #modal [customClass]="'no-close-icon-modal no-padding-modal'">
    <div class="wrapper">
      <div class="message">
        <h2 class="heading-2">{{ title }}</h2>
        <p class="body-2">{{ content }}</p>
      </div>
      <div class="action">
        <button class="control" (click)="close()" type="button">View Progress</button>
        <button class="control secondary ghost" (click)="cancel()" type="button">
        Go to Approved Order
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
export class ConfirmModalPendingOrderComponent {
  @ViewChild('modal') modal: NgxSmartModalComponent;
  result: DialogResult = DialogResult.Cancelled;
  @Input() title = 'Publishing Products in Progress';
  @Input() content = 'Products are being uploaded. View progress?';

  constructor(
    private location: Location,
    public router: Router,
  ) {}

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
    this.router.navigate(['/inventory/publish']);
  }

  cancel() {
    this.location.back();
  }
}
