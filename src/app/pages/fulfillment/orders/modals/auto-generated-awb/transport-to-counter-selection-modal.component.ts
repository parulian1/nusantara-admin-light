import { AfterViewInit, Component, EventEmitter, ViewChild } from '@angular/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';


@Component({
  selector: 'nus-transport-to-counter-selection-modal',
  template: `
    <ngx-smart-modal
      [identifier]="'transportToCounterSelection'"
      #modal
      [customClass]="'medium-modal no-padding-modal'">
      <div class="wrapper">
        <div class="message">
          <h2 class="title-2" i18n>Ship Order</h2>
          <p i18n><strong>MARKETPLACE (Store Name) | Logistic Name</strong></p>
          <div class="shipping-method">
            <div class="method-option">
              <span><input type="radio" name="methodOption"/></span>
              <img src="/assets/deliver-to-counter.svg">
              <span>
                <div class="subheading-2" i18n>
                  Deliver to Counter
                </div>
                <div class="body-2" i18n>
                  Deliver your packages to the closest <strong>Logistic Name</strong> counter.
                </div>
              </span>
            </div>
            <div class="method-option">
              <span><input type="radio" name="methodOption"/></span>
              <img src="/assets/use-pickup-service.svg">
              <span>
                <div class="subheading-2" i18n>
                  Use Pick Up Service
                </div>
                <div class="body-2" i18n>
                  <strong>Logistic Name</strong> will pick up the packages from your address.
                </div>
              </span>
            </div>
          </div>
        </div>
        <button type="submit" class="control" i18n>Submit</button>
      </div>
    </ngx-smart-modal>
  `,
  styles: [
    '.wrapper { padding: 16px }',
    '.message { margin: 8px 8px 20px 8px; }',
    'h2 { padding-bottom: 24px }',
    'p { color : var(--darken-grey-color); margin: 0; }',
    '.shipping-method { margin-top: 28px; }',
    `.method-option {
      border: solid 1px var(--grey);
      border-radius: 4px;
      display: flex;
      align-items: center;
      padding: 12px 16px;
      gap: 12px; }`,
    '.method-option:not(:last-child) { margin-bottom: 16px; }',
    'button { width: 50% }'
  ]
})
export class TransportToCounterSelectionModalComponent implements AfterViewInit {

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
