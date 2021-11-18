import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';

@Component({
  selector: 'nus-pickup-service-info-modal',
  template: `
    <ngx-smart-modal [identifier]="'pickupServiceInfo'" #modal [customClass]="'medium-modal'">
      <h2 class="title-2" i18n>Pick Up Service</h2>
      <div class="info">
        <div class="body-2" i18n>Date</div>
        <div class="subheading-2" i18n>Date</div>
      </div>
      <div class="info">
        <div class="body-2" i18n>Time</div>
        <div class="subheading-2" i18n>Time</div>
      </div>
      <div class="info">
        <div class="body-2" i18n>Note</div>
        <div class="subheading-2" i18n>Note</div>
      </div>
      <div class="info">
        <div class="body-2" i18n>Store Address</div>
        <div class="subheading-2" i18n>Store Address</div>
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
