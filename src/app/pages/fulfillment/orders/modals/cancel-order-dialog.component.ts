import { Component, EventEmitter, ViewChild } from '@angular/core';
import { DialogResult } from '@nusantara/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';

@Component({
  selector: 'nus-cancel-order-dialog',
  template: `
    <ngx-smart-modal [identifier]="'deleteConfirmInfo'" #modal [customClass]="'no-close-icon-modal no-padding-modal'">
      <div class="wrapper">
        <div class="message">
          <h2 class="heading-2" i18n>Cancel Order Confirmation</h2>
          <p class="body-2" i18n>The order DK2318DXHXNM97 will be cancelled</p>
          <div>
            <label *ngFor="let season of seasons" >
              <input type="radio" name="cancel_reason" [value]="season" [(ngModel)]="favoriteSeason" i18n>
              {{season}}
            </label>
            <textarea *ngIf="favoriteSeason === 'Test'" id="" cols="30" rows="10"></textarea>


            <!-- <label>
              <input type="radio" name="cancel_reason" value="cek" i18n>
              cek
            </label>
            <label>
              <input type="radio" name="cancel_reason" value="new " i18n>
              new
            </label>
            <label>
              <input type="radio" name="cancel_reason" value="snow " i18n>
              Other Reason
            </label> -->
            <!-- <mat-radio-group
          aria-labelledby="example-radio-group-label"
          class="example-radio-group"
          [(ngModel)]="favoriteSeason">
          <mat-radio-button class="example-radio-button" *ngFor="let season of seasons" [value]="season">
            {{season}}
          </mat-radio-button>
        </mat-radio-group> -->



          </div>
          <!-- <p class="body-2" i18n>Are you sure you want to cancel this order?</p> -->
        </div>
        <div class="action">
          <button class="control" (click)="close()" type="button" i18n>Yes</button>
          <button class="control secondary ghost" (click)="cancel()" type="button" i18n>
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
    'label{min-height:unset}'
  ],
})
export class CancelOrderDialogComponent {
  @ViewChild('modal') modal: NgxSmartModalComponent;
  result: DialogResult = DialogResult.Cancelled;

  favoriteSeason: string;
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
    this.modal.close();
  }

  cancel() {
    this.modal.close();
  }
}
