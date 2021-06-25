import { AbstractEditingComponent, DialogResult } from '@nusantara/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
import { IOnboardingContent } from '@nusantara/models';

@Component({
  selector: 'nus-onboarding-preview-host-dialog',
  template: `
    <ngx-smart-modal [customClass]="'content-container'" [identifier]="'onboardingPreviewHostDialogModal'" #modal
                     *ngIf="!!form">
      <div class="background-header">
      </div>
      <div class="body">
        <div class="content">
          <div class="content-img">
            <img [src]="getContentImage(form.controls[position])" alt="Image Preview">
          </div>
          <div class="content-value">
            <h1>
              {{ getContentName(form.controls[position]) }}
            </h1>
            <label>
              {{ getContentDescription(form.controls[position])}}
            </label>
          </div>
          <div class="slider">
            <input type="radio" name="slider-radio" *ngFor="let formControl of form.controls; let i=index"
                   [value]="i" [checked]="i === position" (click)="changePosition(i)">
          </div>
          <div class="action-button">
            <button type="button" class="button-action" *ngIf="getContentButtonStatus(form.controls[position])"
                    (click)="executeButtonAction(form.controls[position])">
              {{ getContentButtonText(form.controls[position]) }}
            </button>
            <button (click)="nextOrClose()" type="button" class="button-next" style="margin-left: 20px;">
              {{ getButtonActionNextText(position) }}
            </button>
          </div>
        </div>
      </div>

    </ngx-smart-modal>
  `,
  styles: [`

    .background-header {
      background: #00AEEF;
      height: 152px;
      border-radius: 24px 24px 0 0;
      padding: 10px;
    }

    .body {
      background: #FFFFFF;
      padding: 20px 0;
      border-radius: 0 0 24px 24px;
      height: 361px;
      display: flex;
      justify-content: center;
      text-align: center;
    }

    .body div {
      width: 100%;
    }

    .body .content {
      position: absolute;
      top: 100px;
    }

    .body .content .content-img {
      height: 184px;
      margin-bottom: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .body .content .slider {
      padding-bottom: 6px;
    }

    .body .content .content-value {
      padding: 0 20px;
      height: 140px;
      width: auto;
      word-break: break-word;
    }

    h1 {
      font-size: 24px;
    }

    .body .content .content-value label {
      padding: 0 20px;
    }

    .body .content .content-img img {
      max-height: 184px;
      max-width: 70%;
    }

    input[type="radio"] {
      width: 9px;
      height: 9px;
      background-color: var(--bc, var(--border));
    }

    input[type="radio"]:after {
      width: 11px;
      height: 11px;
      background-color: #EFB103;
    }

    .slider input+input {
      margin-left: 8px;
    }

    ::ng-deep .nsm-dialog {
      max-width: 800px;
    }

    ::ng-deep .nsm-dialog-btn-close {
      top: 25px;
      right: 30px;
    }

    ::ng-deep .content-container .nsm-content {
      background-color: transparent;
      width: 800px;
      box-shadow: none;
    }

    ::ng-deep .content-container .nsm-content .nsm-body {
      padding: 0px;
    }

    input[type="radio"]:after {
      transform: none;
    }

    .button-action {
      width: 208px;
      height: 47px;
      background: #F0BE00;
      border-radius: 40px;
      border: none;
      color: white;
    }

    .button-next {
      width: 208px;
      height: 47px;
      background: #00AEEF;
      border-radius: 40px;
      border: none;
      color: white;
    }
  `]
})
export class OnboardingPreviewHostDialogComponent extends AbstractEditingComponent<FormArray> implements OnInit,
  AfterViewInit {
  @Input() form: FormArray;
  @ViewChild('modal') modal: NgxSmartModalComponent;
  @Output() closeEvent = new EventEmitter<any>();

  imagePreviewUrl: string;

  result: DialogResult;
  position = 0;

  constructor(public fb: FormBuilder) {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.modal.onOpen.subscribe(() => {
      this.result = DialogResult.Cancelled;
    });
  }

  open() {
    this.modal.open();
  }

  addContent(content?: IOnboardingContent) {
    const form = this.fb.group({
      href: [content?.href ?? '', []],
      image: [content?.image, content?.image ? [] : [Validators.required]],
      name: [content?.name, [Validators.required, Validators.maxLength(50)]],
      description: [content?.description, [Validators.maxLength(255)]],
      buttonStatus: [content?.buttonStatus ?? false, []],
      buttonText: [content?.buttonText ?? '', []],
      buttonUrl: [content?.buttonUrl ?? '', []],
      sortPriority: [content?.sortPriority, []],

    });
    this.form.push(form);
  }

  get onClose(): EventEmitter<any> {
    return this.modal.onClose;
  }

  close() {
    this.result = DialogResult.OK;
    this.modal.close();
  }

  getContentName(formControl?: AbstractControl): string {
    if (!!formControl) {
      return formControl.value.name;
    }
    return '';
  }

  getContentDescription(formControl?: AbstractControl): string {
    if (!!formControl) {
      return formControl.value.description;
    }
    return '';
  }

  getContentImage(formControl?: AbstractControl): string {
    if (!!formControl && !!formControl.get('image')) {
      this.setImagePreview(formControl.value.image);
    }
    return this.imagePreviewUrl;
  }

  getContentButtonStatus(formControl?: AbstractControl): boolean {
    if (!!formControl && formControl.value.buttonStatus) {
      return true;
    }
    return false;
  }

  getContentButtonText(formControl?: AbstractControl): string {
    if (!!formControl && formControl.value.buttonText) {
      return formControl.value.buttonText;
    }
  }

  executeButtonAction(formControl?: AbstractControl) {
    if (!!formControl && formControl.value.buttonStatus) {
      window.open(formControl.value.buttonUrl, '_blank');
    }
  }

  nextOrClose() {
    if (this.position < (this.form.controls.length - 1)) {
      this.position += 1;
    } else {
      this.closeEvent.emit();
    }
  }

  changePosition(i:number) {
    this.position = i;
  }

  setImagePreview(data: Event | string) {
    super.setImagePreview(data, (dataAsUrl) => {
      this.imagePreviewUrl = dataAsUrl;
    });
  }

  getButtonActionNextText(position: number): string {
    const formControlLength = this.form.controls.length;
    if (position < formControlLength -1) {
      return 'MULAI'
    }
    return 'MULAI BERJUALAN'
  }

}
