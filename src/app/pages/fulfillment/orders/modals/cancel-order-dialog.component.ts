import { ThrowStmt } from '@angular/compiler';
import { Component, EventEmitter, Input, ViewChild } from '@angular/core';
import { DialogResult } from '@nusantara/core';
import { OrderService } from '@nusantara/services';
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
            <label *ngFor="let reason of reasons;" >
              <input type="radio" name="cancel_reason" [value]="reason.value" (change)="changeReason($event)" i18n>
              {{reason.name}}
            </label>
            <textarea *ngIf="textbox" cols="30" rows="10" maxlength="500" [(ngModel)]="otherReason"></textarea>
            <small *ngIf="textbox" class="pull-right">{{otherReason.length}} / 500</small>
          </div>
        </div>
        <div class="action">
          <button class="control" [disabled]="disabled" (click)="close()" type="button" i18n>Cancel Anyway</button>
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
  @Input() marketplace:string;
  result: DialogResult = DialogResult.Cancelled;

  textbox: boolean = false;
  otherReason:string = '';
  resVal:string;
  reasons = [];
  disabled:boolean

  constructor(protected service: OrderService) { }


  open() {
    this.modal.open();
    this.service.cancelReason(this.marketplace).subscribe((res) => {
      this.reasons = res;
    });
    this.disabled = true;
  }

  get onClose(): EventEmitter<any> {
    return this.modal.onClose;
  }

  getValue(): FormData {
    if (this.result !== DialogResult.OK) {
      return null;
    }
  }

  changeReason(data?: Event | string) {
    this.disabled = false;
    if (data instanceof Event) {
    this.resVal = (data.target as HTMLInputElement).value;
    const index = this.reasons.map(x=>x.value.toString()).indexOf(this.resVal);

      if(this.reasons[index].type === 'text'){
        this.textbox = true;
      } else {
        this.textbox = false;
      }
    }
  }

  close() {
    this.result = DialogResult.OK;
    if (!this.textbox) {
      this.otherReason = '';
    }
    this.modal.close();
    this.textbox = false;
    this.otherReason = '';
    setTimeout(function(){
      window.location.reload();
    }, 3000);
  }

  cancel() {
    this.otherReason = '';
    this.textbox = false;
    this.modal.close();
  }
}
