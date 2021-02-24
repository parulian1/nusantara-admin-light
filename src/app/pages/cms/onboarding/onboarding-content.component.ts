import { AfterViewInit, Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { AbstractEditingComponent } from '@nusantara/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IOnboardingContent } from '@nusantara/models';

@Component({
  selector: 'nus-onboarding-content',
  template: `
    <form [formGroup]="form" #f>
      <div class="onboarding-content-title">
        <div class="title">
          <input type="text" [formControl]="name">
          <nus-field-errors [control]="name"></nus-field-errors>
          <div class="collapse" (click)="toggle()">
            <img src="/assets/arrowDown.svg">
          </div>
        </div>
      </div>
      <div  class="onboarding-content" *ngIf="show">
        <label>
          <span>Image</span>
          <img *ngIf="imagePreviewUrl" [src]="imagePreviewUrl" alt="Banner Image" class="preview">
          <input type="file" [formControl]="image" (change)="setImagePreview($event)"
               name="icon" accept="image/*">
          <nus-onboarding-content-image></nus-onboarding-content-image>
        </label>
        <label>
          <span>Description</span>
          <textarea [formControl]="description"></textarea>
          <nus-field-errors [control]="description"></nus-field-errors>
        </label>
        <label>
          <span>Button Status</span>
          <input type="checkbox" [formControl]="buttonStatus" (change)="setAvailabilityAndClearValueButtonProp()">
        </label>

        <label>
          <span>Button Text</span>
          <input type="url" [formControl]="buttonText">
          <nus-field-errors [control]="buttonText"></nus-field-errors>
        </label>

        <label>
          <span>Button Url</span>
          <input type="url" [formControl]="buttonUrl">
          <nus-field-errors [control]="buttonUrl"></nus-field-errors>
        </label>
        <input type="number" hidden [formControl]="sortPriority" min="0">
        <button (click)="remove.emit()" type="button" class="remove-button" data-qa="remove-button">
          Delete
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .onboarding-content-title {
        background: #E4E4E4;
        border: 1px solid #E0E0E0;
        box-sizing: border-box;
        border-radius: 8px 8px 0px 0px;
        overflow: hidden;
        padding: 10px;
      }
      .onboarding-content-title .title input[type=text] {
        float: left;
        width: 98%;
      }
      .onboarding-content {
        background: #FFFFFF;
        border: 1px solid #E0E0E0;
        box-sizing: border-box;
        padding: 10px;
      }
      div.collapse > img {
        max-height: 10px;
        max-width: 10px;
        object-fit: contain;
      }

      img.preview {
        max-height: 300px;
        max-width: 600px;
        object-fit: contain;
      }
      ::ng-deep .nsm-content {
        background-color: #fff;
        width: inherit;
      }
      ::ng-deep .nsm-dialog {
        max-width: 600px;
      }
    `
  ]
})
export class OnboardingContentComponent extends AbstractEditingComponent implements OnInit, AfterViewInit {
  @Input() form: FormGroup;
  @Input() entity: IOnboardingContent;
  @Output() remove = new EventEmitter<void>();
  imagePreviewUrl: string;
  show: boolean = true;

  constructor(public route: ActivatedRoute,
              public router: Router) {
    super();
  }

  ngOnInit() {
    this.setImagePreview(this.entity?.image);
    this.setAvailabilityAndClearValueButtonProp();
    this.buttonStatus.markAsTouched();
  }

  ngAfterViewInit() {
  }

  get buttonText(): FormControl { return this.form.get('buttonText') as FormControl; }
  get buttonUrl(): FormControl { return this.form.get('buttonUrl') as FormControl; }
  get buttonStatus(): FormControl { return this.form.get('buttonStatus') as FormControl; }
  get href(): FormControl { return this.form.get('href') as FormControl; }
  get name(): FormControl { return this.form.get('name') as FormControl; }
  get description(): FormControl { return this.form.get('description') as FormControl; }
  get image(): FormControl { return this.form.get('image') as FormControl; }
  get sortPriority(): FormControl { return this.form.get('sortPriority') as FormControl; }

  setImagePreview(data: Event | string) {
    super.setImagePreview(data, (dataAsUrl) => {
      this.imagePreviewUrl = dataAsUrl;
    });
  }

  setAvailabilityAndClearValueButtonProp() {
    let buttonTextValidators = [Validators.maxLength(100)];
    let buttonUrlValidators = [Validators.maxLength(160)];

    if (this.buttonStatus.value === true) {
      this.buttonText.enable();
      this.buttonUrl.enable();
      buttonTextValidators.push(Validators.required);
      buttonUrlValidators.push(Validators.required);

    } else {
      this.buttonText.patchValue(null);
      this.buttonUrl.patchValue(null);
      this.buttonText.disable();
      this.buttonUrl.disable();
    }
    this.buttonText.setValidators(buttonTextValidators);
    this.buttonUrl.setValidators(buttonUrlValidators);
    this.buttonText.updateValueAndValidity();
    this.buttonUrl.updateValueAndValidity();
  }

  getValue() {
    return this.form.value;
  }

  toggle() {
    this.show = !this.show;
    return this.show;
  }

}
