import { Component, EventEmitter, Input, ViewChild } from '@angular/core';
import { DialogResult } from '@nusantara/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';

@Component({
  selector: 'nus-cancel-order-dialog',
  template: `
    <ngx-smart-modal [identifier]="'deleteConfirmInfo'" #modal [customClass]="'no-close-icon-modal no-padding-modal'">
      <div class="wrapper">
        <div class="message">
          <h2 class="heading-2" i18n>Confirmation Cancellaction Order</h2>
          <p class="body-2" i18n>The order {{orderNum}} will be cancelled</p>
          <div>
            <label *ngFor="let season of seasons" >
              <input type="radio" name="cancel_reason" [value]="season" [(ngModel)]="favoriteSeason" i18n>
              {{season}}
            </label>
            <textarea *ngIf="favoriteSeason === 'Test'" id="" cols="30" rows="10" maxlength="500" [(ngModel)]="otherReason"></textarea>
            <small *ngIf="favoriteSeason === 'Test'" class="pull-right">{{otherReason.length}} / 500</small>
          </div>
        </div>
        <div class="action">
          <button class="control" (click)="close()" type="button" i18n>Cancel Anyway</button>
          <button class="control secondary ghost" (click)="cancel()" type="button" i18n>
          Go Back
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
    '.pull-right{float:right}',
    'button:not(:first-of-type) { margin-left: 5px; }',
    'label{min-height:unset}'
  ],
})
export class CancelOrderDialogComponent {
  @ViewChild('modal') modal: NgxSmartModalComponent;
  @Input() orderNum:string;
  result: DialogResult = DialogResult.Cancelled;

  favoriteSeason: string;
  otherReason:string = '';
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn', 'Test'];

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
    if (this.favoriteSeason !== 'Test') {
      this.otherReason = '';
    }
    this.modal.close();
    this.favoriteSeason = null;
    this.otherReason = '';
  }

  cancel() {
    if (this.favoriteSeason !== 'Test') {
      this.otherReason = '';
    }
    this.modal.close();
  }
}
