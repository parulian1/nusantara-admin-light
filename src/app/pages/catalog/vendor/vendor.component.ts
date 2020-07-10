import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractDetailComponent, ToastService } from '@nusantara/core';
import { IVendor } from '@nusantara/models';
import { VendorService } from '@nusantara/services';

@Component({
  selector: 'nus-vendor',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      [typeName]="entityTypeName">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="saveAsForm()" #f>

      <input type="hidden" [formControl]="href" name="href"> <!-- required for non-JSON form posting -->

      <label>
        <span>Name</span>
        <input type="text" [formControl]="name" name="name">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span>Description</span>
        <textarea [formControl]="description" name="description"></textarea>
        <nus-field-errors [control]="description"></nus-field-errors>
      </label>

      <label>
        <span>Icon Image</span>
        <img [src]="iconImagePreviewUrl" id="icon-image-preview" alt="Icon Image" class="preview">
        <input type="file" [formControl]="iconImage" (change)="setIconImagePreview($event)" name="iconImage">
        <small>Recommended 120px x 120px (1:1)</small>
        <nus-field-errors [control]="iconImage"></nus-field-errors>
      </label>

      <label>
        <span>Banner Image</span>
        <img [src]="bannerImagePreviewUrl" id="banner-image-preview" alt="Banner Image" class="preview">
        <input type="file" [formControl]="bannerImage" (change)="setBannerImagePreview($event)" name="bannerImage">
        <small>Recommended: 1152px x 350px (16:5)</small>
        <nus-field-errors [control]="bannerImage"></nus-field-errors>
      </label>

      <label>
        <span>Internal Notes</span>
        <textarea [formControl]="internalNotes" name="internalNotes"></textarea>
        <nus-field-errors [control]="internalNotes"></nus-field-errors>
      </label>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
  `,
  styles: [
    '#icon-image-preview { height:120px; width: 120px; }',
    '#banner-image-preview { height:125px; width: 400px; }',
    'input[type=file] { display: none }',
  ]
})
export class VendorComponent extends AbstractDetailComponent<IVendor> {

  @ViewChild('f') formView: ElementRef<HTMLFormElement>;

  iconImagePreviewUrl: string;
  bannerImagePreviewUrl: string;

  constructor(public service: VendorService,
              public route: ActivatedRoute,
              public router: Router,
              private fb: FormBuilder,
              public toast: ToastService) {
    super();
  }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get href(): FormControl { return this.form.get('href') as FormControl; }
  get description(): FormControl { return this.form.get('description') as FormControl; }
  get internalNotes(): FormControl { return this.form.get('internalNotes') as FormControl; }
  get iconImage(): FormControl { return this.form.get('iconImage') as FormControl; }
  get bannerImage(): FormControl { return this.form.get('bannerImage') as FormControl; }

  initializeForm(entity?: IVendor) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, ]],
      href: [entity?.href, []],
      description: [entity?.description ?? '', []],
      internalNotes: [entity?.internalNotes ?? '', []],
      iconImage: [],
      bannerImage: [],
    });

    this.setBannerImagePreview(entity?.bannerImage);
    this.setIconImagePreview(entity?.iconImage);
  }

  setIconImagePreview(data?: Event|string) {
    this.setImagePreview(data,  (dataAsUrl) => this.iconImagePreviewUrl = dataAsUrl);
  }

  setBannerImagePreview(data?: Event|string) {
    this.setImagePreview(data, (dataAsUrl) => this.bannerImagePreviewUrl = dataAsUrl);
  }
}
