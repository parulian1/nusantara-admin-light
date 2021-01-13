import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormBuilder, FormGroup, FormArray} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastService, AbstractDetailComponent } from '@nusantara/core';
import { drf, ISiteConfig} from '@nusantara/models';
import { SiteConfigService } from "@nusantara/services";

@Component({
  selector: 'nus-site-config',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      [typeName]="entityTypeName">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()" #f>
      <label>
        <span>Shop Name</span>
        <input type="text" [formControl]="name" name="name">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span>Logo</span>
        <img [src]="logoPreviewUrl" alt="Shop Logo" class="preview" id="logo">
        <small>Recommended: 120x120</small>
        <input type="file"
               [formControl]="logo"
               (change)="setLogoPreview($event)"
               name="logo"
               accept="image/*">
        <nus-field-errors [control]="logo"></nus-field-errors>
      </label>

      <label>
        <span>GA Account ID</span>
        <input type="text" [formControl]="gaAccountId" name="googleAnalyticAccountId">
        <nus-field-errors [control]="gaAccountId"></nus-field-errors>
      </label>

      <label>
        <span>Favicon</span>
        <img [src]="faviconPreviewUrl" alt="Favicon Logo" class="preview" id="favicon">
        <small>Recommended: 48x48</small>
        <input type="file"
               [formControl]="favicon"
               (change)="setFaviconPreview($event)"
               name="favicon"
               accept="image/*">
        <nus-field-errors [control]="favicon"></nus-field-errors>
      </label>

      <label>
        <span>Tagline</span>
        <input type="text" [formControl]="tagLine">
        <nus-field-errors [control]="tagLine"></nus-field-errors>
      </label>

      <label>
        <span>Description</span>
        <textarea [formControl]="description"></textarea>
        <nus-field-errors [control]="description"></nus-field-errors>
      </label>

      <label>
        <span>Keywords</span>
        <input type="text" [formControl]="keywords">
        <nus-field-errors [control]="keywords"></nus-field-errors>
      </label>
      <table class="line-items">
        <thead>
        <tr>
          <th>Product (UPC)</th>
          <th>Location</th>
          <th>Quantity</th>
          <th>SKU</th>
          <th>Batch</th>
          <th>Locator</th>
          <th>Expiry Date</th>
          <th>Cost</th>
          <th></th>
        </tr>
        </thead>
        <tbody>

        <nus-social-media-host
          *ngFor="let rec of socialMedia.controls; let i=index"
          [form]="rec"
          [socialMediaTypes]="socialMediaTypes"
          (remove)="socialMedia.removeAt(i)">
        </nus-social-media-host>

        <tr>
          <td colspan="9">
            <button type="button" (click)="addLine()" class="add-button">
              Add Record
            </button>
          </td>
        </tr>

      </table>
      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()" [hideDelete]="true">
      </nus-detail-actions>
    </form>
  `,
  styles: [
    'img#logo { max-height: 120px; max-width: 120px; }',
    'input[type=file] { display: none; }',
    'img#favicon { max-height: 48px; max-width: 48px; }',
  ]
})
export class SiteConfigComponent extends AbstractDetailComponent<ISiteConfig> implements OnInit {

  entity?: ISiteConfig;
  logoPreviewUrl: string;
  faviconPreviewUrl: string;
  socialMediaTypes: drf.IChoice[] = [];

  constructor(service: SiteConfigService,
              route: ActivatedRoute,
              router: Router,
              private fb: FormBuilder,
              toast: ToastService) {
    super(route, router, toast, service);
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get logo(): FormControl {
    return this.form.get('logo') as FormControl;
  }

  get gaAccountId(): FormControl {
    return this.form.get('gaAccountId') as FormControl;
  }

  get favicon(): FormControl {
    return this.form.get('favicon') as FormControl;
  }

  get tagLine(): FormControl {
    return this.form.get('tagLine') as FormControl;
  }

  get extraConfig(): FormGroup {
    return this.form.get('extraConfig') as FormGroup;
  }

  get description(): FormControl {
    return this.extraConfig.get('description') as FormControl;
  }

  get keywords(): FormControl {
    return this.extraConfig.get('keywords') as FormControl;
  }

  get socialMedia(): FormArray { return this.form.get('socialMedia') as FormArray; }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((data: { entity: ISiteConfig, typeChoices: drf.IChoice[]}) => {
      this.entity = data.entity;
      this.socialMediaTypes = data.typeChoices;
    });
    this.originalEntityName = "General Settings";
  }

  initializeForm(entity?: ISiteConfig) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required]],
      href: [entity?.href],
      logo: [],
      gaAccountId: [entity?.gaAccountId ?? '', []],
      favicon: [],
      tagLine: [entity?.tagLine ?? '', [Validators.maxLength(50)]],
      extraConfig: this.fb.group({
        description: [entity?.extraConfig?.description, [Validators.maxLength(160)]],
        keywords: [entity?.extraConfig?.keywords, [Validators.maxLength(160)]]
      }),
      socialMedia: this.fb.array([], []),
    });

    this.entity = entity;
    this.setLogoPreview(entity?.logo);
    this.setFaviconPreview(entity?.favicon);
  }

  setLogoPreview(data?: Event | string) {
    super.setImagePreview(data, (dataAsUrl) => this.logoPreviewUrl = dataAsUrl);
  }

  setFaviconPreview(data?: Event | string) {
    super.setImagePreview(data, (dataAsUrl) => this.faviconPreviewUrl = dataAsUrl);
  }

  save() {
    if (!!this.entity?.href && !!this.entity?.favicon && !!this.form.get('favicon')) {
      if ( !this.form.get('favicon').value) {
        this.form.removeControl('favicon');
      }
    }
    if (!!this.favicon && this.faviconPreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.favicon = this.faviconPreviewUrl;
    }

    if (!!this.entity?.href && !!this.entity?.logo && !!this.form.get('logo')) {
      if (!this.form.get('logo').value) {
        this.form.removeControl('logo');
      }
    }
    if (!!this.logo && this.logoPreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.logo = this.logoPreviewUrl;
    }
    super.save();
  }

  addLine() {
    const form = this.fb.group({
      type: ['', [Validators.required]],
      url: ['', [Validators.required, Validators.maxLength(50)]]
    });
    this.socialMedia.push(form);
  }
}
