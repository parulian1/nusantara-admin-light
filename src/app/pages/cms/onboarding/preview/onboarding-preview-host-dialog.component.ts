import {AbstractEditingComponent, DialogResult} from '@nusantara/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AfterViewInit, Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {NgxSmartModalComponent} from "ngx-smart-modal";
import {IOnboardingContent} from "@nusantara/models";

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
                   [value]="i" [checked]="i === position" [disabled]="true">
          </div>
          <div class="action-button">
            <button type="button" class="button-action" *ngIf="getContentButtonStatus(form.controls[position])"
                    (click)="executeButtonAction(form.controls[position])">
              {{ getContentButtonText(form.controls[position]) }}
            </button>
            <button (click)="next()" type="button" class="button-next">Selanjutnya</button>
          </div>
        </div>
      </div>
      <div class="content-content">

      </div>

    </ngx-smart-modal>
  `,
  styles: [`

    .background-header {
      background: #00AEEF;
      height: 152px;
      background: #00AEEF;
      border-radius: 24px 24px 0px 0px;
      padding: 10px;
    }

    .body {
      background: #FFFFFF;
      padding: 20px 0px;
      border-radius: 0px 0px 24px 24px;
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
      top: 80px;
    }

    .body .content .content-img {
      height: 184px;
    }

    .body .content .slider {
      padding-bottom: 20px;
    }

    .body .content .content-value {
      padding: 0px 20px;
      height: 160px;
      width: auto;
    }

    .body .content .content-img img {
      max-height: 184px;
      max-width: 295px;
    }

    .slider input {
      width: 30px;
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

    .button-action {
      width: 208px;
      padding: 20px;
      background: #F0BE00;
      border-radius: 40px;
    }

    .button-next {
      width: 208px;
      height: 47px;
      background: #00AEEF;
      border-radius: 40px;
    }
  `]
})
export class OnboardingPreviewHostDialogComponent extends AbstractEditingComponent<FormArray> implements OnInit,
  AfterViewInit
{
  @Input() form: FormArray;
  @ViewChild('modal') modal: NgxSmartModalComponent;

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
      image: [content?.image, content?.image ? []: [Validators.required]],
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

  getContentName(formControl?: AbstractControl) : string {
    if (!!formControl) {
      return formControl.value.name;
    }
    return '';
  }

  getContentDescription(formControl?: AbstractControl) : string {
    if (!!formControl) {
      return formControl.value.description;
    }
    return '';
  }

  getContentImage(formControl?: AbstractControl) : string {
    if (!!formControl && !!formControl.get('image')) {
      this.setImagePreview(formControl.value.image);
    }
    return this.imagePreviewUrl;
  }

  getContentButtonStatus(formControl?: AbstractControl) : boolean {
    if (!!formControl && !!formControl.value.buttonStatus) {
      return true;
    }
    return false;
  }

  getContentButtonText(formControl?: AbstractControl) : string {
    if (!!formControl && !!formControl.get('buttonText')) {
      return formControl.value.buttonText;
    }
  }

  executeButtonAction(formControl?: AbstractControl) {
    if (!!formControl && !!formControl.get('buttonStatus')) {
      window.open(formControl.value.buttonUrl, '_blank');
    }
  }

  next() {
    if (this.position < (this.form.controls.length - 1)) {
      this.position += 1;
    }
  }

  setImagePreview(data: Event | string) {
    super.setImagePreview(data, (dataAsUrl) => {
      this.imagePreviewUrl = dataAsUrl;
    });
  }

}
