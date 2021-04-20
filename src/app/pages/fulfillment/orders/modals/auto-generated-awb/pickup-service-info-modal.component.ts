import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';

@Component({
  selector: 'nus-pickup-service-info-modal',
  template: `
    <ngx-smart-modal [identifier]="'pickupServiceInfo'" #modal [customClass]="'medium-modal'">
      <h2 class="title-2">Pick Up Service</h2>
      <div class="info">
        <div class="body-2">Date</div>
        <div class="subheading-2">Date</div>
      </div>
      <div class="info">
        <div class="body-2">Time</div>
        <div class="subheading-2">Time</div>
      </div>
      <div class="info">
        <div class="body-2">Note</div>
        <div class="subheading-2">Note</div>
      </div>
      <div class="info">
        <div class="body-2">Store Address</div>
        <div class="subheading-2">Store Address</div>
      </div>
    </ngx-smart-modal>
  `,
  styles: [
    'h2 { padding-bottom: 20px; }',
    '.info { margin-bottom: 23px; }'
  ]
})
export class PickupServiceInfoModalComponent implements AfterViewInit {
  @ViewChild('modal') modal: NgxSmartModalComponent;

  ngAfterViewInit(): void {
    this.modal.onOpen.subscribe(() => {});
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