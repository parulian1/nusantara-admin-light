import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';

@Component({
  selector: 'nus-pickup-download-shipping-modal',
  template: `
    <ngx-smart-modal 
      [identifier]="'pickupDownloadShipping'" 
      #modal 
      [customClass]="'medium-modal no-padding-modal'">
      <div class="wrapper">
        <form #modalForm class="fluid" [formGroup]="">
          <div class="message">
            <h2 class="title-2">Set Pick Up Service</h2>
            <p><strong>Order count</strong> will be picked up from your store address by <strong>Shipping service</strong>.</p>
            <div class="awb-number">
              <div class="body-2">AWB Number</div>
              <div class="heading-2">AWB Number</div>
            </div>
          </div>
          <button type="submit" class="control">Download Shipping Label</button>
        </form>
      </div>
    </ngx-smart-modal>
  `,
  styles: [
    '.wrapper { padding: 16px }',
    '.message { margin: 8px 8px 47px 8px; }',
    '.heading-2 { font-weight: bold; }',
    `.awb-number { 
      display: block;
      margin-left: auto;
      margin-right: auto;
      width: fit-content;
      border: solid 1px var(--grey);
      border-radius: 4px;
      padding: 20px;
    }`,
    'h2 { padding-bottom: 16px }',
    'p { color : var(--darken-grey-color); margin: 0; margin-bottom: 32px; }',
    'button { width: 50% }'
  ]
})
export class PickupDownloadShippingModalComponent implements AfterViewInit {

  @ViewChild('modalForm') formView: ElementRef<HTMLFormElement>;
  @ViewChild('modal') modal: NgxSmartModalComponent;


  ngAfterViewInit(): void {
    this.modal.onOpen.subscribe(() => {});
  }

  getValue(): FormData {
    return new FormData(this.formView.nativeElement);
  }

  open() {
    this.modal.open();
  }

  get onClose(): EventEmitter<any> {
    return this.modal.onClose;
  }

  close() {
    this.modal.close();
  }

  cancel() {
    this.modal.close();
  }
}