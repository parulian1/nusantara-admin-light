import {Component, EventEmitter, ViewChild} from '@angular/core';
import {NgxSmartModalComponent} from 'ngx-smart-modal';
import {DialogResult} from '@nusantara/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'nus-mark-as-testing-modal',
  template: `
    <ngx-smart-modal
      [identifier]="'markAsTesting'"
      #modal
      [customClass]="'medium-modal no-padding-modal'">
      <div class="wrapper">
        <div class="message">
          <h2 class="title-2">Mark as test</h2>
          <p>State the reason why this product is for testing</p>
          <label>
            <span>AWB</span>
            <textarea placeholder="State the reason" [formControl]="reason"></textarea>
            <nus-field-errors [control]="reason"></nus-field-errors>
          </label>
        </div>
        <button type="submit" class="control" (click)="close()" [disabled]="!form.valid">Submit</button>
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
export class MarkAsTestingDialogComponent {
  @ViewChild('modal') modal: NgxSmartModalComponent;
  form: FormGroup;
  result: DialogResult = DialogResult.Cancelled;

  constructor(protected fb: FormBuilder,) {
    this.initializeForm();
  }

  get reason(): FormControl {
    return this.form.get('reason') as FormControl;
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      reason: ['',
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.minLength(3),
        ]
      ],
    });
  }

  ngAfterViewInit(): void {
    this.modal.onOpen.subscribe(() => {
    });
  }

  open() {
    this.modal.open();
    this.result = DialogResult.Cancelled;
  }

  get onClose(): EventEmitter<any> {
    return this.modal.onClose;
  }

  close() {
    if (this.form.valid) {
      this.result = DialogResult.OK;
      this.modal.close();
    } else {
      alert('Invalid entry');
    }
  }
}
