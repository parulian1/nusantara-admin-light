import {AfterViewInit, Component, OnInit, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {AbstractEditingComponent, DialogResult} from '@nusantara/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {IOnboardingContent} from "@nusantara/models";
import {NewProductImageComponent} from "@nusantara/pages/catalog/product/media";
import {OnboardingContentImageComponent} from "@nusantara/pages/cms/onboarding/onboarding-content-image.component";

@Component({
  selector: 'nus-onboarding-content',
  template: `
    <form [formGroup]="form" #f>
      <div  class="onboarding-content">
        <label>
          <span>Image</span>
          <img *ngIf="imagePreviewUrl" [src]="imagePreviewUrl" alt="Banner Image" class="preview">
          <button hidden (click)="onboardingContentImageModal.open()" type="button" title="Upload Image">
            <i class="material-icons">image</i>
          </button>
          <nus-onboarding-content-image></nus-onboarding-content-image>
        </label>

        <label>
          <span>Title</span>
          <input type="text" [formControl]="name">
          <nus-field-errors [control]="name"></nus-field-errors>
        </label>

        <label>
          <span>Description</span>
          <textarea [formControl]="description"></textarea>
          <nus-field-errors [control]="description"></nus-field-errors>
        </label>
        <hr/>

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
          <i class="material-icons">remove_circle_outline</i>
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .onboarding-content {
        border: 1px solid black;
        padding: 10px;
      }
    `
  ]
})
export class OnboardingContentComponent extends AbstractEditingComponent implements OnInit, AfterViewInit {
  @Input() form: FormGroup;
  @Input() entity: IOnboardingContent;
  @Output() remove = new EventEmitter<void>();
  imagePreviewUrl: string;

  @ViewChild(OnboardingContentImageComponent) onboardingContentImageModal: OnboardingContentImageComponent;

  constructor(public route: ActivatedRoute,
              public router: Router) {
    super();
  }

  ngOnInit() {
    this.setImagePreview(this.entity?.image);
    this.setAvailabilityAndClearValueButtonProp();
  }

  ngAfterViewInit() {
    this.onboardingContentImageModal.onClose.subscribe(() => this.onImageModalClosed());
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
    if (this.buttonStatus.value === true) {
      this.buttonText.enable();
      this.buttonUrl.enable();
    } else {
      this.buttonText.patchValue(null);
      this.buttonUrl.patchValue(null);
      this.buttonText.disable();
      this.buttonUrl.disable();
    }
  }

  onImageModalClosed() {
    if (this.onboardingContentImageModal.result === DialogResult.OK) {
      if (!!this.onboardingContentImageModal?.imagePreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
        this.imagePreviewUrl = this.onboardingContentImageModal.imagePreviewUrl;
        this.image.setValue(this.onboardingContentImageModal.imagePreviewUrl);
      }
      this.getValue();
    }
  }

  getValue() {
    if (!!this.href && !!this.image && !this.image?.value) {
      this.form.removeControl('image');
    }
    return this.form.value;
  }

}
