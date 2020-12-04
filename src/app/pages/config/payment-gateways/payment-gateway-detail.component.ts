import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastService, AbstractDetailComponent } from '@nusantara/core';
import { drf, IPaymentGateway } from '@nusantara/models';
import { PaymentGatewayService } from '@nusantara/services';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { setAndClearValidators } from './utils';

@Component({
  selector: 'nus-payment-gateway',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Payment Gateway">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()" #f>
      <label>
        <span>Name</span>
        <input type="text" [formControl]="name" name="name">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span>Logo</span>
        <img [src]="logoPreviewUrl" alt="Payment Gateway Logo" class="preview">
        <small>Recommended: 120x120</small>
        <input type="file"
               [formControl]="logo"
               (change)="setLogoPreview($event)"
               name="logo"
               accept="image/*">
      </label>

      <label>
        <span>Type</span>
        <select [formControl]="type">
          <option *ngFor="let opt of typeChoices" [value]="opt.value">
            {{opt.displayName}}
          </option>
        </select>
        <nus-field-errors [control]="type"></nus-field-errors>
      </label>

      <!-- Show when type of payment other than manual transfer -->
      <ng-template [ngIf]="currentType && (currentType !== 'manual_transfer')">
        <label>
          <span>Client Key</span>
          <input type="text" [formControl]="clientKey" name="clientKey">
          <nus-field-errors [control]="clientKey"></nus-field-errors>
        </label>

        <label>
          <span>Server Key</span>
          <input type="text" [formControl]="serverKey" name="serverKey">
          <nus-field-errors [control]="serverKey"></nus-field-errors>
        </label>

        <label>
          <span>Code</span>
          <input type="text" [formControl]="code" name="code">
          <nus-field-errors [control]="code"></nus-field-errors>
        </label>
      </ng-template>

      <!-- Show when type of payment is manual_transfer -->
      <ng-template [ngIf]="currentType && (currentType === 'manual_transfer')">
        <label>
          <span>Account Number</span>
          <input type="text" [formControl]="accountNumber" name="accountNumber">
          <nus-field-errors [control]="clientKey"></nus-field-errors>
        </label>

        <label>
          <span>Account Hold Number</span>
          <input type="text" [formControl]="accountHoldNumber" name="accountHoldNumber">
          <nus-field-errors [control]="serverKey"></nus-field-errors>
        </label>
      </ng-template>

      <label>
        <span>Is Active</span>
        <input type="checkbox" [formControl]="isActive" name="isActive">
      </label>

      <div>
        <label for="description" class="external"><span>Description</span></label>
        <ckeditor [editor]="Editor"
                  [formControl]="description" id="description"></ckeditor>
        <nus-field-errors [control]="description"></nus-field-errors>
      </div>
      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
  `,
  styles: [
    'img { height: 120px; width: 120px; }',
    '.ck-editor__main { min-height: 150px; }',
  ]
})
export class PaymentGatewayDetailComponent extends AbstractDetailComponent<IPaymentGateway> implements OnInit {

  public Editor = ClassicEditor;

  entity?: IPaymentGateway;
  logoPreviewUrl: string;
  currentType: string;
  typeChoices: drf.IChoice[];

  constructor(service: PaymentGatewayService,
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

  get type(): FormControl {
    return this.form.get('type') as FormControl;
  }

  get clientKey(): FormControl {
    return this.form.get('clientKey') as FormControl;
  }

  get serverKey(): FormControl {
    return this.form.get('serverKey') as FormControl;
  }

  get accountNumber(): FormControl {
    return this.form.get('accountNumber') as FormControl;
  }

  get accountHoldNumber(): FormControl {
    return this.form.get('accountHoldNumber') as FormControl;
  }

  get isActive(): FormControl {
    return this.form.get('isActive') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get code(): FormControl {
    return this.form.get('code') as FormControl;
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { typeChoices: drf.IChoice[] }) => {
      this.typeChoices = data.typeChoices;
    });
    super.ngOnInit();

    this.type.valueChanges.subscribe(change => {
      this.setCurrentTypeAndValidatorFields(change);
    });
  }

  initializeForm(entity?: IPaymentGateway) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required]],
      href: [entity?.href],
      logo: [''],
      type: [entity?.type, [Validators.required]],
      clientKey: [entity?.clientKey ?? ''],
      serverKey: [entity?.serverKey ?? ''],
      accountNumber: [entity?.accountNumber ?? ''],
      accountHoldNumber: [entity?.accountHoldNumber ?? ''],
      isActive: [entity?.isActive ?? true],
      description: [entity?.description ?? ''],
      code: [entity?.code],
    });

    this.entity = entity;

    this.setLogoPreview(entity?.logo);
    this.setCurrentTypeAndValidatorFields(entity?.type);
  }

  setCurrentTypeAndValidatorFields(value = null): void {
    this.currentType = value;
    setAndClearValidators(value, this.form, this.logoPreviewUrl);
  }

  setLogoPreview(data?: Event | string) {
    super.setImagePreview(data, (dataAsUrl) => this.logoPreviewUrl = dataAsUrl);
  }

  save() {
    if (!!this.entity?.href && !!this.entity?.logo && !this.form.get('logo').value) {
      this.form.removeControl('logo');
    }
    if (!!this.logo && this.logoPreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.logo = this.logoPreviewUrl;
    }
    super.save();
  }
}
