import { Component, OnInit } from '@angular/core';
import {AbstractDetailComponent, ToastService} from '@nusantara/core';
import {IFlatPage, IOnboardingContent} from '@nusantara/models';
import {OnboardingContentService} from '@nusantara/services/onboarding-content.service';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'nus-onboarding',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Onboarding">
    </nus-detail-title>
    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span>Image</span>
        <img *ngIf="imagePreviewUrl" [src]="imagePreviewUrl" alt="Banner Image" class="preview">
        <input type="file" [formControl]="image" (change)="setImagePreview($event)"
               name="icon" accept="image/*">
        <nus-field-errors [control]="image"></nus-field-errors>
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
        <input type="checkbox" [formControl]="buttonStatus">
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



      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
  `,
  styles: ['']
})
export class OnboardingComponent extends AbstractDetailComponent<IOnboardingContent> implements OnInit {
  imagePreviewUrl: string;
  entity: IOnboardingContent;

  constructor(service: OnboardingContentService,
              public fb: FormBuilder,
              toast: ToastService,
              route: ActivatedRoute,
              router: Router) {
    super(route, router, toast, service);
  }


  get buttonText(): FormControl { return this.form.get('buttonText') as FormControl; }
  get buttonUrl(): FormControl { return this.form.get('buttonUrl') as FormControl; }
  get buttonStatus(): FormControl { return this.form.get('buttonStatus') as FormControl; }
  get href(): FormControl { return this.form.get('href') as FormControl; }
  get name(): FormControl { return this.form.get('name') as FormControl; }
  get description(): FormControl { return this.form.get('description') as FormControl; }
  get image(): FormControl { return this.form.get('image') as FormControl; }
  get sortPriority(): FormControl { return this.form.get('sortPriority') as FormControl; }

  initializeForm(entity?: IOnboardingContent) {
    this.entity = entity;
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required]],
      href: [entity?.href],
      image: [entity?.image],
      sortPriority: [entity?.sortPriority],
      description: [entity?.description, []],
      buttonText: [entity?.buttonText, []],
      buttonUrl: [entity?.buttonUrl, []],
      buttonStatus: [entity?.buttonStatus, []],
    });
    this.setImagePreview(entity?.image);
  }


  setImagePreview(data: Event | string) {
    super.setImagePreview(data, (dataAsUrl) => this.imagePreviewUrl = dataAsUrl);
  }

  save() {
    if (!!this.entity?.href && !!this.entity?.image && !!this.image.value) {
      this.form.removeControl('image');
    }

    if (this.imagePreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.image = this.imagePreviewUrl;
    }
    super.save();
  }
}
