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
    <ngx-smart-modal
      [identifier]="'confirm'"
      #modal
      [customClass]="'nsm-centered'"
    >
      <h2 class="heading-2">{{ title }}</h2>
      <p>{{ content }}</p>
      <button class="control secondary" (click)="cancel()" type="button">
        Go to Approved Order
      </button>
      <button class="control" (click)="close()" type="button">View Progress</button>
    </ngx-smart-modal>
  `,
  styles: [
    'p {margin-bottom: 30px}',
    'button:not(:first-child) { margin-left: 5px; }',
    'h1{font-weight: 700}',
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
