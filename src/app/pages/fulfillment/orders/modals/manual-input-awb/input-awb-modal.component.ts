import {AfterViewInit, Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {NgxSmartModalComponent} from 'ngx-smart-modal';
import {DialogResult} from '@nusantara/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

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
            <input type="text" placeholder="Input AWB" [formControl]="awbNumber">
          </label>
        </div>
        <input type="hidden" [formControl]="orderNumber"/>
        <button type="submit" class="control" (click)="close()" [disabled]="form.invalid">Submit</button>
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
export class InputAwbModalComponent implements AfterViewInit, OnInit {

  @ViewChild('modal') modal: NgxSmartModalComponent;
  form: FormGroup;
  result: DialogResult = DialogResult.Cancelled;

  constructor(protected fb: FormBuilder,) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  get awbNumber(): FormControl {
    return this.form.get('awbNumber') as FormControl;
  }

  get orderNumber(): FormControl {
    return this.form.get('orderNumber') as FormControl;
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      orderNumber: ['', [Validators.required, ]],
      awbNumber: ['',
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.minLength(5),
          Validators.pattern('^[a-z0-9_-]{5,30}$')
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
    this.result = DialogResult.OK;
    this.modal.close();
  }
}
