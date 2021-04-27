import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, Validators, FormBuilder, FormGroup, FormArray} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastService, AbstractDetailComponent, IResultResponse } from '@nusantara/core';
import { drf, ISiteConfig, ISocialMedia } from '@nusantara/models';
import { SiteConfigService } from '@nusantara/services';
import { ConfigChatServiceComponent } from './chat-service';
import { ConfigAnalyticToolComponent } from './analytic-tool';
import { forkJoin } from 'rxjs';

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
        <span>Company Name</span>
        <input type="text" [formControl]="companyName" name="companyName">
        <nus-field-errors [control]="companyName"></nus-field-errors>
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
        <nus-config-analytic-tool-service [form]="form"></nus-config-analytic-tool-service>
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
        <span>Email Customer Service</span>
        <input type="text" [formControl]="customerServiceEmail">
        <small>This email is used for CS Email. If it is empty then your customer will not get an email.</small>
        <nus-field-errors [control]="customerServiceEmail"></nus-field-errors>
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

      <label>
        <span>Phone Number / Telephone (Optional)</span>
        <input type="text" [formControl]="phoneNumber" name="phoneNumber">
        <nus-field-errors [control]="phoneNumber"></nus-field-errors>
      </label>

      <nus-company-address [form]="companyAddress" formGroupName="companyAddress">
      </nus-company-address>

      <div class="sosmed-title">
        <h3>
          Social Media Settings
        </h3>
      </div>
      <hr/>
      <table class="line-items">
        <thead>
        <tr>
          <th>Type</th>
          <th>URL</th>
          <th></th>
        </tr>
        </thead>
        <tbody>

        <nus-social-media-host
          *ngFor="let rec of socialMedias.controls; let i=index"
          [form]="rec"
          [socialMediaTypes]="socialMediaTypes"
          (remove)="socialMedias.removeAt(i)">
        </nus-social-media-host>

        <tr>
          <td colspan="9">
            <button type="button" (click)="addLine()" class="add-button">
              Add Record
            </button>
          </td>
        </tr>

      </table>

      <div>
        <nus-config-chat-service></nus-config-chat-service>
      </div>


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
    'div.sosmed-title { }'
  ]
})
export class SiteConfigComponent extends AbstractDetailComponent<ISiteConfig> implements OnInit {
  @ViewChild(ConfigChatServiceComponent) chatServiceComponent: ConfigChatServiceComponent;
  @ViewChild(ConfigAnalyticToolComponent) analyticToolComponent: ConfigAnalyticToolComponent;

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

  get favicon(): FormControl {
    return this.form.get('favicon') as FormControl;
  }

  get customerServiceEmail(): FormControl {
    return this.form.get('customerServiceEmail') as FormControl;
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

  get socialMedias(): FormArray { return this.form.get('socialMedias') as FormArray; }

  get companyName(): FormControl {
    return this.form.get('companyName') as FormControl;
  }

  get phoneNumber(): FormControl {
    return this.form.get('phoneNumber') as FormControl;
  }

  get companyAddress(): FormGroup {
    return this.form.get('companyAddress') as FormGroup;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((data: { entity: ISiteConfig, typeChoices: drf.IChoice[]}) => {
      this.entity = data.entity;
      this.socialMediaTypes = data.typeChoices;
    });
    this.originalEntityName = 'Company Information';
  }

  initializeForm(entity?: ISiteConfig) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required]],
      companyName: [entity?.companyName, []],
      href: [entity?.href],
      logo: [],
      gaAccountId: [entity?.gaAccountId ?? '', []],
      gaAccountType: [entity?.gaAccountType ?? 'ga', []],
      favicon: [],
      customerServiceEmail: [entity?.customerServiceEmail ?? '', [Validators.required, Validators.email]],
      tagLine: [entity?.tagLine ?? '', [Validators.maxLength(50)]],
      extraConfig: this.fb.group({
        description: [entity?.extraConfig?.description, [Validators.maxLength(160)]],
        keywords: [entity?.extraConfig?.keywords, [Validators.maxLength(160)]]
      }),
      socialMedias: this.fb.array([], []),
      companyAddress: this.fb.group({
        country: [entity?.companyAddress?.street || 'id', []],
        province: [entity?.companyAddress?.province, []],
        city: [entity?.companyAddress?.city, []],
        district: [entity?.companyAddress?.district, []],
        subDistrict: [entity?.companyAddress?.subDistrict, []],
        street: [entity?.companyAddress?.street, []],
        postalCode: [entity?.companyAddress?.postalCode, []],
      }),
      phoneNumber: [entity?.phoneNumber, [Validators.maxLength(50), ]],
    });

    this.entity = entity;
    this.setLogoPreview(entity?.logo);
    this.setFaviconPreview(entity?.favicon);

    for (const socialMedia of entity?.socialMedias ?? []) {
      this.addLine(socialMedia);
    }
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

  addLine(socialMedia?: ISocialMedia) {
    const form = this.fb.group({
      type: [socialMedia?.type ?? '', [Validators.required]],
      url: [socialMedia?.url, [Validators.required, Validators.maxLength(50)]]
    });
    this.socialMedias.push(form);
  }

  protected onSaveSuccess(result: IResultResponse<ISiteConfig>) {
    forkJoin([
      this.chatServiceComponent.save(),
    ]).subscribe(_ => {
      super.onSaveSuccess(result);
    });
  }
}
