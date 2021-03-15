import { Component, ElementRef, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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

    <form [formGroup]="form" (ngSubmit)="save()" #f>

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
        <span>Is Active</span>
        <input id="s2" type="checkbox" [formControl]="isActive" name="is-active"
               data-qa="is-active"/>
        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>

      <label>
        <span>Icon Image</span>
        <img [src]="iconImagePreviewUrl" id="icon-image-preview" alt="Icon Image" class="preview">
        <input type="file"
               [formControl]="iconImage"
               (change)="setIconImagePreview($event)"
               name="iconImage"
               accept="image/*">
        <small>Recommended 120px x 120px (1:1)</small>
        <nus-field-errors [control]="iconImage"></nus-field-errors>
      </label>

      <label>
        <span>Banner Image</span>
        <img [src]="bannerImagePreviewUrl" id="banner-image-preview" alt="Banner Image" class="preview">
        <input type="file"
               [formControl]="bannerImage"
               (change)="setBannerImagePreview($event)"
               name="bannerImage"
                accept="image/*">
        <small>Recommended: 1152px x 350px (16:5)</small>
        <nus-field-errors [control]="bannerImage"></nus-field-errors>
      </label>

      <label>
        <span>Internal Notes</span>
        <textarea [formControl]="internalNotes" name="internalNotes"></textarea>
        <nus-field-errors [control]="internalNotes"></nus-field-errors>
      </label>

      <label>
        <span>Seo Description</span>
        <textarea [formControl]="seoDescription" name="seoDescription"></textarea>
        <nus-field-errors [control]="seoDescription"></nus-field-errors>
      </label>

      <label>
        <span>Seo Keywords</span>
        <input type="text" [formControl]="seoKeywords" name="seoKeywords">
        <nus-field-errors [control]="seoKeywords"></nus-field-errors>
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

  entity?: IVendor;

  constructor(service: VendorService,
              route: ActivatedRoute,
              router: Router,
              private fb: FormBuilder,
              toast: ToastService) {
    super(route, router, toast, service);
  }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get href(): FormControl { return this.form.get('href') as FormControl; }
  get description(): FormControl { return this.form.get('description') as FormControl; }
  get internalNotes(): FormControl { return this.form.get('internalNotes') as FormControl; }
  get iconImage(): FormControl { return this.form.get('iconImage') as FormControl; }
  get bannerImage(): FormControl { return this.form.get('bannerImage') as FormControl; }
  get isActive(): FormControl { return this.form.get('isActive') as FormControl; }
  get extra(): FormGroup {
    return this.form.get('extra') as FormGroup;
  }
  get seoDescription(): FormControl {
    return this.extra.get('seoDescription') as FormControl;
  }
  get seoKeywords(): FormControl {
    return this.extra.get('seoKeywords') as FormControl;
  }

  initializeForm(entity?: IVendor) {
    this.entity = entity;
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, Validators.maxLength(50)]],
      href: [entity?.href, []],
      description: [entity?.description ?? '', []],
      internalNotes: [entity?.internalNotes ?? '', []],
      iconImage: ['', entity?.iconImage ? [] : [Validators.required, ]],
      bannerImage: ['', []],
      extra: this.fb.group({
        seoDescription: [entity?.extra?.seoDescription ?? '', [Validators.maxLength(160)]],
        seoKeywords: [entity?.extra?.seoKeywords ?? '', [Validators.maxLength(160)]]
      }),
      isActive: [entity?.isActive]
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

  save() {
    if (!!this.entity?.href && !!this.entity?.iconImage && !this.iconImage.value) {
      this.form.removeControl('iconImage');
    }
    if (!!this.entity?.href && !!this.entity?.iconImage && !this.bannerImage.value) {
      this.form.removeControl('bannerImage');
    }
    if (!!this.iconImage && this.iconImagePreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.iconImage = this.iconImagePreviewUrl;
    }
    if (!!this.bannerImage && this.bannerImagePreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.bannerImage = this.bannerImagePreviewUrl;
    }
    super.save();
  }
}
