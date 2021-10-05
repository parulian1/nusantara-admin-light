import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { NgxSmartModalComponent } from 'ngx-smart-modal';

@Component({
  selector: 'nus-set-pickup-service-modal',
  template: `
    <ngx-smart-modal
      [identifier]="'setPickUpService'"
      #modal
      [formGroup]="form"
      [customClass]="'medium-modal no-padding-modal'">
      <div class="wrapper">
        <form #modalForm class="fluid" [formGroup]="">
          <div class="message">
            <h2 class="title-2" i18n>Set Pick Up Service</h2>
            <p i18n><strong>Order count</strong> will be picked up from your store address by <strong>Shipping service</strong>.</p>
            <label>
              <span i18n>Date</span>
              <input type="date" [formControl]="date" placeholder="Select Date">
            </label>
            <label>
              <span i18n>Time</span>
              <input type="time" [formControl]="time" placeholder="Select Time">
            </label>
            <label>
              <span i18n>Note</span>
              <input type="text" [formControl]="note" placeholder="Write Additional Note">
            </label>
            <label>
              <span i18n>Store Address</span>
              <p class="caption-1" i18n>Your package will be picked up from this address. If this address is incorrect, go to <strong>Makertplace</strong> admin and change the address.</p>
              <textarea [formControl]="storeAddress"></textarea>
            </label>
          </div>
          <button type="submit" class="control" i18n>Submit</button>
        </form>
      </div>
    </ngx-smart-modal>
  `,
  styles: [
    '.wrapper { padding: 16px }',
    '.message { margin: 8px 8px 5px 8px; }',
    'h2 { padding-bottom: 16px }',
    'p { color : var(--darken-grey-color); margin: 0; margin-bottom: 24px; }',
    'button { width: 50% }',
    '.caption-1 { margin-bottom: 4px }'
  ]
})
export class SetPickUpServiceComponent implements OnInit, AfterViewInit {

  @ViewChild('modalForm') formView: ElementRef<HTMLFormElement>;
  @ViewChild('modal') modal: NgxSmartModalComponent;

  form: FormGroup;

  constructor(protected fb: FormBuilder) { }

  get date(): FormControl { return this.form.get('date') as FormControl; }
  get time(): FormControl { return this.form.get('time') as FormControl; }
  get note(): FormControl { return this.form.get('note') as FormControl; }
  get storeAddress(): FormControl { return this.form.get('storeAddress') as FormControl; }

  ngOnInit() {
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    this.modal.onOpen.subscribe(() => {
      this.initializeForm();
    });

  }

  /**
   * Sets the modals form to a new empty set of data.
   */
  private initializeForm(): void {
    this.form = this.fb.group({
      date: ['', [Validators.required, ]],
      time: ['', [Validators.required, ]],
      note: ['', []],
      storeAddress: ['', []]
    });
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
