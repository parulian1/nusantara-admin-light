import { AfterViewInit, Component, EventEmitter, ViewChild } from '@angular/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';

@Component({
  selector: 'nus-activity-tracking-modal',
  template: `
    <ngx-smart-modal 
      [identifier]="'activityTracking'"
      #modal
      [customClass]="'medium-modal no-padding-modal'">
      <div class="wrapper">
        <div class="message">
          <h2 class="title-2">Activity Tracking</h2>
          <nus-activity-tracking></nus-activity-tracking>
        </div>
      </div>
    </ngx-smart-modal>
  `,
  styles: [
    '.wrapper { padding: 16px 0 16px 16px; }',
    '.message { margin: 8px 8px 24px 8px; }',
    'h2 { padding-bottom: 24px }',
  ]
})
export class ActivityTrackingModalComponent implements AfterViewInit {

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
