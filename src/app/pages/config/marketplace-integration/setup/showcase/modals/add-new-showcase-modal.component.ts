import { Component, EventEmitter, ViewChild } from "@angular/core";
import { NgxSmartModalComponent } from "ngx-smart-modal";

@Component({
  selector: "nus-add-showcase-modal",
  template: `
    <ngx-smart-modal [identifier]="'confirm'" #modal [customClass]="'no-padding-modal'">
    <div class="wrapper">
      <div class="content">
        <h2>Add Showcase</h2>
        <label>
          <span>Showcase Display Name</span>
          <input type="text" name="add-showcase" placeholder="Input Name" />
        </label>
      </div>
      <div class="action">
        <button class="control" type="button">Save</button>
      </div>
    </div>
  </ngx-smart-modal>
  `,
  styles: [
    'h2 { margin-bottom: 11px; }',
    'p { color: var(--darken-grey); }',
    'label { padding-bottom: 12px }',
    'button { width: 50% }',
    '.wrapper { padding: 12px 16px; }',
    '.content { padding: 12px 8px }',
    '.message { margin: 0 8px 32px 8px; }',
  ],
})
export class AddNewShowcaseModalComponent {
  @ViewChild("modal") modal: NgxSmartModalComponent;

  open() {
    this.modal.open();
  }

  get onClose(): EventEmitter<any> {
    return this.modal.onClose;
  }

  getValue(): FormData {
    return null;
  }

  save() {
    this.modal.close();
  }
}
