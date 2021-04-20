import { AfterViewInit, Component, EventEmitter, ViewChild } from '@angular/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';

@Component({
  selector: 'nus-input-awb-modal',
  template: `
    <ngx-smart-modal 
      [identifier]="'inputAwb'"
      #modal
      [customClass]="'medium-modal no-padding-modal'">
      <div class="wrapper">
        <div class="message">
          <h2 class="title-2">Input AWB</h2>
          <p>Enter AWB number you received from <strong>Logistic Name</strong> counter.</p>
          <label>
            <span>AWB</span>
            <input type="text" placeholder="Input AWB">
          </label>
        </div>
        <button type="submit" class="control">Submit</button>
      </div>
    </ngx-smart-modal>
  `,
  styles: [
    '.wrapper { padding: 16px }',
    '.message { margin: 8px 8px 24px 8px; }',
    'h2 { padding-bottom: 24px }',
    'p { margin-bottom: 16px; }',
    'label { padding-bottom: 0; }',
    'button { width: 50% }'
  ]
})
export class InputAwbModalComponent implements AfterViewInit {

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
}
