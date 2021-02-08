import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractDetailComponent, ToastService } from '@nusantara/core';
import { banner, BannerTypeSmeClient, drf, widgets } from '@nusantara/models';
import { BannerService } from '@nusantara/services';
import { enumToArray } from '@nusantara/shared/helpers';

@Component({
  selector: 'nus-banner',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Banner">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()" class="entity-detail-form" #f>

      <label>
        <span>Name</span>
        <input type="text" [formControl]="name" name="name">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span>Type</span>
        <select formControlName="type">
          <option *ngFor="let choice of typeChoices" [ngValue]="choice.value">{{ choice.displayName }}</option>
        </select>
        <nus-field-errors [control]="type"></nus-field-errors>
      </label>

      <label>
        <span>Is Active</span>
        <input type="checkbox" [formControl]="isActive" name="isActive">
      </label>

      <label>
        <span>Valid From</span>
        <input type="datetime-local" [formControl]="validFrom">
        <nus-field-errors [control]="validFrom"></nus-field-errors>
      </label>

      <label>
        <span>Valid To</span>
        <input type="datetime-local" [formControl]="validTo">
        <nus-field-errors [control]="validTo"></nus-field-errors>
      </label>


      <label>
        <span>Image</span>
        <img *ngIf="imagePreviewUrl" [src]="imagePreviewUrl" alt="Banner Image" class="preview">
        <input type="file" [formControl]="image" (change)="setImagePreview($event)"
               name="icon" accept="image/*">
        <nus-field-errors [control]="image"></nus-field-errors>
      </label>

      <label>
        <span>Phone Image</span>
        <img *ngIf="phoneImagePreviewUrl" [src]="phoneImagePreviewUrl" alt="Banner Phone Image" class="preview">
        <input type="file" [formControl]="phoneImage" (change)="setPhoneImagePreview($event)"
               name="phoneImage" accept="image/*">
        <nus-field-errors [control]="phoneImage"></nus-field-errors>
      </label>

      <label>
        <span>Tablet Image</span>
        <img *ngIf="tabletImagePreviewUrl" [src]="tabletImagePreviewUrl" alt="Banner Tablet Image" class="preview">
        <input type="file" [formControl]="tabletImage" (change)="setTabletImagePreview($event)"
               name="tabletImage" accept="image/*">
        <nus-field-errors [control]="tabletImage"></nus-field-errors>
      </label>

      <label>
        <span>Click Url</span>
        <input type="url" [formControl]="clickUrl" name="clickUrl">
        <nus-field-errors [control]="clickUrl"></nus-field-errors>
      </label>

      <label>
        <span>Is Display at Homepage</span>
        <input type="checkbox" [formControl]="displayHomepage" name="displayHomepage">
      </label>
      <label>
        <span>Sort Priority</span>
        <input type="text" [formControl]="sortPriority" name="sortPriority">
        <nus-field-errors [control]="sortPriority"></nus-field-errors>
      </label>

      <label>
        <span>Description</span>
        <textarea [formControl]="description" name="description"></textarea>
        <nus-field-errors [control]="description"></nus-field-errors>
      </label>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>

    </form>
  `,
  styles: [
    '.rich-text-container { padding-bottom: 14px; }', // double standard label padding
  ]
})
export class BannerComponent extends AbstractDetailComponent<banner.IBanner> implements OnInit {

  entity: banner.IBanner;
  imagePreviewUrl: string;
  phoneImagePreviewUrl: string;
  tabletImagePreviewUrl: string;

  groups: Array<widgets.IBannerGroup>;
  typeChoices: drf.IChoice[];


  constructor(service: BannerService,
              router: Router,
              route: ActivatedRoute,
              public fb: FormBuilder,
              toast: ToastService) { super(route, router, toast, service); }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get type(): FormControl { return this.form.get('type') as FormControl; }
  get isActive(): FormControl { return this.form.get('isActive') as FormControl; }
  get image(): FormControl { return this.form.get('image') as FormControl; }
  get phoneImage(): FormControl { return this.form.get('phoneImage') as FormControl; }
  get tabletImage(): FormControl { return this.form.get('tabletImage') as FormControl; }
  get validFrom(): FormControl { return this.form.get('validFrom') as FormControl; }
  get validTo(): FormControl { return this.form.get('validTo') as FormControl; }
  get clickUrl(): FormControl { return this.form.get('clickUrl') as FormControl; }
  get displayHomepage(): FormControl { return this.form.get('displayHomepage') as FormControl; }
  get description(): FormControl { return this.form.get('description') as FormControl; }
  get group(): FormControl { return this.form.get('group') as FormControl; }
  get sortPriority(): FormControl { return this.form.get('sortPriority') as FormControl; }

  ngOnInit() {
    super.ngOnInit();
    this.route.data.subscribe((data: {typeChoices: drf.IChoice[]}) => {
      this.typeChoices = data.typeChoices;
    });
    this.smeLicenseBannerType();
  }

  initializeForm(entity?: banner.IBanner) {
    this.entity = entity;
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, Validators.maxLength(50)]],
      type: [entity?.type, [Validators.required]],
      href: [entity?.href, []],
      image: ['', entity?.image ? [] : [Validators.required]],
      phoneImage: ['', []],
      tabletImage: ['', []],
      isActive: [entity?.isActive ?? false, []],
      validFrom: [this.convertDateTime(entity?.validFrom), [Validators.required]],
      validTo: [this.convertDateTime(entity?.validTo), [Validators.required]],
      clickUrl: [entity?.clickUrl, [Validators.required, Validators.maxLength(250)]],
      displayHomepage: [entity?.displayHomepage ?? false, []],
      description: [entity?.description ?? '', []],
      group: [entity?.group ?? '', []],
      sortPriority: [entity?.sortPriority ?? '', []],
    });

    this.setImagePreview(entity?.image);
    this.setPhoneImagePreview(entity?.phoneImage);
    this.setTabletImagePreview(entity?.tabletImage);
  }

  setImagePreview(data: Event | string) {
    super.setImagePreview(data, (dataAsUrl) => this.imagePreviewUrl = dataAsUrl);
  }

  setPhoneImagePreview(dataPhone: Event | string) {
    super.setImagePreview(dataPhone, (dataPhoneAsUrl) => this.phoneImagePreviewUrl = dataPhoneAsUrl);
  }

  setTabletImagePreview(dataTablet: Event | string) {
    super.setImagePreview(dataTablet, (dataTabletAsUrl) => this.tabletImagePreviewUrl = dataTabletAsUrl);
  }

  convertDateTime(timestamp: string) {
    if (timestamp) {
      const date = new Date(timestamp);

      const year = date.getFullYear();
      let month: string | number = date.getMonth() + 1; // getMonth() is zero-indexed, so we'll increment to get the correct month number
      let day: string | number = date.getDate();
      let hours: string | number = date.getHours();
      let minutes: string | number = date.getMinutes();
      let seconds: string | number = date.getSeconds();

      month = (month < 10) ? '0' + month : month;
      day = (day < 10) ? '0' + day : day;
      hours = (hours < 10) ? '0' + hours : hours;
      minutes = (minutes < 10) ? '0' + minutes : minutes;
      seconds = (seconds < 10) ? '0' + seconds : seconds;
      return (`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
    }
    return '';
  }

  save() {
    if (!!this.entity?.href && !!this.entity?.image && !this.image.value) {
      this.form.removeControl('image');
    }
    if (!!this.entity?.href && !!this.entity?.phoneImage && !this.phoneImage.value) {
      this.form.removeControl('phoneImage');
    }
    if (!!this.entity?.href && !!this.entity?.tabletImage && !this.tabletImage.value) {
      this.form.removeControl('tabletImage');
    }
    if (this.imagePreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.image = this.imagePreviewUrl;
    }
    if (this.phoneImagePreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.phoneImage = this.phoneImagePreviewUrl;
    }
    if (this.tabletImagePreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.tabletImage = this.tabletImagePreviewUrl;
    }
    super.save();
  }

  smeLicenseBannerType() {
    this.typeChoices = this.typeChoices.filter(opt => enumToArray(BannerTypeSmeClient).includes(opt.value));
  }

}

