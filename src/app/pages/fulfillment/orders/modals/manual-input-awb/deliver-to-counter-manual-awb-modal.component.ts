import { AfterViewInit, Component, EventEmitter, ViewChild } from '@angular/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';


@Component({
  selector: 'nus-deliver-to-counter-manual-input-awb-modal',
  template: `
    <ngx-smart-modal
      [identifier]="'deliverToCounterManualInputAwb'"
      #modal
      [customClass]="'medium-modal no-padding-modal'">
      <div class="wrapper">
        <div class="message">
          <h2 class="title-2" i18n>Deliver to Counter</h2>
          <p i18n><strong>Order count</strong> will be delivered to <strong>Logistic</strong> counter.</p>
          <div class="to-do">
            <p i18n>What to do next:</p>
            <ol>
              <li i18n>Print shipping label & put it on the package.</li>
              <li i18n>Deliver your package to the nearest <strong>Logistic Name</strong> counter.</li>
              <li i18n>Input AWB number obtained from the counter.</li>
              <li i18n>Track shipment process from "Shipped" tab.</li>
            </ol>
          </div>
        </div>
        <button type="submit" class="control" i18n>Download Shipping Label</button>
      </div>

    </ngx-smart-modal>
  `,
  styles: [
    '.wrapper { padding: 16px }',
    '.message { margin: 0 8px 40px 8px; }',
    'h2 { padding-bottom: 24px }',
    'p { color : var(--darken-grey-color); margin-bottom: 32px; }',
    '.heading-2 { font-weight: bold; }',
    '.to-do p { margin-bottom: 8px; }',
    'ol { padding-left: 16px; margin: 0; }',
    'li { margin-bottom: 10px; }',
    'button { width: 50% }'
  ]
})
export class DeliverToCounterManualInputAwbComponent implements AfterViewInit {

  @ViewChild('modal') modal: NgxSmartModalComponent;


  ngAfterViewInit(): void {
    this.modal.onOpen.subscribe(() => {
    });
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
}
