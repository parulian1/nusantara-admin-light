import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastService, AbstractDetailComponent } from '@nusantara/core';
import { drf, ISiteConfig} from '@nusantara/models';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SiteConfigService } from "@nusantara/services";

@Component({
  selector: 'nus-site-config',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="general_settings">
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
      </label>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
  `,
  styles: [
    'img#logo { height: 120px; width: 120px; border: 1px solid; }',
    '.ck-editor__main { min-height: 150px; }',
    'input[type=file] { display: none; }',
    'img#favicon { height: 48px; width: 48px; }',
  ]
})
export class SiteConfigComponent extends AbstractDetailComponent<ISiteConfig> implements OnInit {

  public Editor = ClassicEditor;

  entity?: ISiteConfig;
  logoPreviewUrl: string;
  faviconPreviewUrl: string;

  constructor(service: SiteConfigService,
              public fb: FormBuilder,
              toast: ToastService,
              route: ActivatedRoute,
              router: Router) {
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

  ngOnInit(): void {
    super.ngOnInit();
    this.originalEntityName = "General Settings";
  }

  initializeForm(entity?: ISiteConfig) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required]],
      href: [entity?.href],
      logo: [],
      gaAccountId: [entity?.gaAccountId, [Validators.required]],
      favicon: []
    });

    this.entity = entity;
    this.setLogoPreview(entity?.logo);
    this.setFaviconPreview(entity?.favicon);

  }

  setLogoPreview(dataLogo?: Event | string) {
    super.setImagePreview(dataLogo, (dataLogoAsUrl) => this.logoPreviewUrl = dataLogoAsUrl);
  }

  setFaviconPreview(dataFavicon?: Event | string) {
    super.setImagePreview(dataFavicon, (dataFaviconAsUrl) => this.faviconPreviewUrl = dataFaviconAsUrl);
  }

  save() {
    if (!!this.entity?.href && !!this.entity?.logo && !this.form.get('logo').value) {
      this.form.removeControl('logo');
    }
    if (!!this.logo && this.logoPreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.logo = this.logoPreviewUrl;
    }
    if (!!this.entity?.href && !!this.entity?.favicon && !this.form.get('favicon').value) {
      this.form.removeControl('favicon');
    }
    if (!!this.favicon && this.faviconPreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.favicon = this.faviconPreviewUrl;
    }
    super.save();
  }
}
