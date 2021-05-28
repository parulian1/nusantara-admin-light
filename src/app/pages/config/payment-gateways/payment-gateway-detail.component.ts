import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastService, AbstractDetailComponent, NusantaraValidators } from '@nusantara/core';
import { drf, IPaymentGateway, PaymentTypeSmeClient } from '@nusantara/models';
import { PaymentGatewayService, SiteConfigService } from '@nusantara/services';
import * as ClassicEditor from '@gdnnusantara/ckeditor5-build/build/ckeditor';
import { setAndClearValidators } from './utils';
import { enumToArray } from '@nusantara/shared/helpers';
import { RequireIsEnterpriseGuard } from '@nusantara/auth';

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
        <input type="text" [formControl]="name" name="name" maxlength="50">
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
      <ng-template [ngIf]="currentType && (currentType !== 'manual_transfer') && (currentType !== 'in_store') ">
        <label>
          <span>Client Key</span>
          <input type="text" [formControl]="clientKey" name="clientKey" maxlength="255">
          <nus-field-errors [control]="clientKey"></nus-field-errors>
        </label>

        <label>
          <span>Server Key</span>
          <input type="text" [formControl]="serverKey" name="serverKey" maxlength="255">
          <nus-field-errors [control]="serverKey"></nus-field-errors>
        </label>

        <label>
          <span>Code</span>
          <input type="text" [formControl]="code" name="code" maxlength="25">
          <nus-field-errors [control]="code"></nus-field-errors>
        </label>
      </ng-template>

      <!-- Show when type of payment is manual_transfer -->
      <ng-template [ngIf]="currentType && (currentType === 'manual_transfer')">
        <label>
          <span>Account Number</span>
          <input type="text" [formControl]="accountNumber" name="accountNumber" maxlength="255">
          <nus-field-errors [control]="clientKey"></nus-field-errors>
        </label>

        <label>
          <span>Account Hold Number</span>
          <input type="text" [formControl]="accountHoldNumber" name="accountHoldNumber" maxlength="255">
          <nus-field-errors [control]="serverKey"></nus-field-errors>
        </label>
      </ng-template>

      <!-- Show when type of payment is in_store -->
      <ng-template [ngIf]="currentType && (currentType === 'in_store')">
        <label>
          <span>In Store Type</span>
          <select [formControl]="metaType" (ngModelChange)="onInStoreChange($event)">
            <option *ngFor="let opt of inStoreTypeChoices" [ngValue]="opt.value">
              {{opt.displayName}}
            </option>
          </select>
          <nus-field-errors [control]="meta"></nus-field-errors>
        </label>

        <div class="ewallet-banks" *ngIf="isMetaDetailAvailable">
          <table>
            <thead>
            <tr>
              <th>#</th>
              <th>{{ this.currentMetaLabel }}</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <ng-template [ngIf]="metaType.value === 'edc'">
              <tr *ngFor="let t of metaBanks.controls; let i = index">
                <td>
                  <input type="text" [formControl]="t">
                </td>
                <td>
                  <button type="button"
                          class="remove-button"
                          (click)="metaBanks.removeAt(i)">
                    <i class="material-icons">remove_circle_outline</i>
                  </button>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <button (click)="addLineBank()" type="button" class="add-button">Add Bank</button>
                </td>
              </tr>
            </ng-template>
            <ng-template [ngIf]="metaType.value === 'e_wallet'">
              <tr *ngFor="let t of metaWallet.controls; let i = index">
                <td>
                  <input type="text" [formControl]="t">
                </td>
                <td>
                  <button type="button"
                          class="remove-button"
                          (click)="metaWallet.removeAt(i)">
                    <i class="material-icons">remove_circle_outline</i>
                  </button>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <button (click)="addLineWallet()" type="button" class="add-button">Add eWallet</button>
                </td>
              </tr>
            </ng-template>
            </tbody>
          </table>
        </div>

      </ng-template>

      <label class="toggle">
        <input type="checkbox"
               class="toggle"
               [formControl]="isActive"
               name="is-active"/>
        <span>Is Active</span>
        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>

      <label *ngIf="enterpriseGuard.canActivate(null, null)" class="toggle">
        <input type="checkbox"
               class="toggle"
               [formControl]="allowPos"
               name="allow-pos"/>
        <span>Allow POS</span>
        <nus-field-errors [control]="allowPos"></nus-field-errors>
      </label>

      <div>
        <label for="description" class="external"><span>Description</span></label>
        <ckeditor [editor]="Editor" [config]="editorConfig"
                  [formControl]="description" id="description" maxlength="255"></ckeditor>
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
    'table { margin-bottom: 24px;}',
  ]
})
export class PaymentGatewayDetailComponent extends AbstractDetailComponent<IPaymentGateway> implements OnInit {

  public Editor = ClassicEditor;
  editorConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'alignment',
        'indent',
        'outdent',
      ]
    },
    language: 'en',
    licenseKey: ''
  };

  entity?: IPaymentGateway;
  currentMetaType: string;
  currentMetaLabel: string;
  isMetaDetailAvailable = false;
  logoPreviewUrl: string;
  currentType: string;
  typeChoices: drf.IChoice[];
  inStoreTypeChoices: drf.IChoice[] = [
    {displayName: 'Cash', value: 'cash'},
    {displayName: 'EDC', value: 'edc'},
    {displayName: 'E-Wallet', value: 'e_wallet'},
    {displayName: 'Gift Voucher', value: 'gift_voucher'},
    {displayName: 'Point', value: 'point'},
    {displayName: 'Sales', value: 'sales'},
    {displayName: 'Salary Deduction', value: 'salary_deduction'},
  ];

  constructor(service: PaymentGatewayService,
              public fb: FormBuilder,
              toast: ToastService,
              route: ActivatedRoute,
              public enterpriseGuard: RequireIsEnterpriseGuard,
              private configSercvice: SiteConfigService,
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

  get allowPos(): FormControl {
    return this.form.get('allowPos') as FormControl;
  }

  get meta(): FormControl {
    return this.form.get('meta') as FormControl;
  }

  get metaType(): FormControl {
    return this.meta.get('type') as FormControl;
  }

  get metaBanks(): FormArray {
    return this.meta.get('banks') as FormArray;
  }

  get metaWallet(): FormArray {
    return this.meta.get('eWallets') as FormArray;
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { typeChoices: drf.IChoice[] }) => {
      this.typeChoices = data.typeChoices;
    });
    super.ngOnInit();
    this.smeLicensePaymentType();
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
      clientKey: [entity?.clientKey ?? '', [Validators.maxLength(255)]],
      serverKey: [entity?.serverKey ?? '', [Validators.maxLength(255)]],
      accountNumber: [entity?.accountNumber ?? '', [Validators.maxLength(255)]],
      accountHoldNumber: [entity?.accountHoldNumber ?? '', [Validators.maxLength(255)]],
      isActive: [entity?.isActive ?? true],
      description: [entity?.description ?? ''],
      code: [entity?.code],
      allowPos: [entity?.allowPos ?? false, []],
      meta: this.fb.group(
        {
          type: [entity?.meta.type, []],
          banks: this.fb.array([], [NusantaraValidators.preventArrayDuplicates(), ]),
          eWallets: this.fb.array([], [NusantaraValidators.preventArrayDuplicates(), ]),
        }
      )
    });

    this.entity = entity;

    if (entity?.meta?.banks) {
      const bankValues = JSON.parse(entity.meta.banks.replace(/'/g, '"'));
      for (const bank of bankValues ?? []) {
        this.addLineBank(bank);
      }
    }

    if (entity?.meta?.eWallets) {
      const wallValues = JSON.parse(entity.meta.eWallets.replace(/'/g, '"'));
      for (const bank of wallValues ?? []) {
        this.addLineWallet(bank);
      }
    }

    this.setLogoPreview(entity?.logo);
    this.setCurrentTypeAndValidatorFields(entity?.type);
    this.onInStoreChange(entity?.meta?.type);
  }

  addLineBank(value?: string) {
    this.metaBanks.push(
      this.fb.control(value, [Validators.required])
    );
  }

  addLineWallet(value?: string) {
    this.metaWallet.push(
      this.fb.control(value, [Validators.required])
    );
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
    if (!!this.entity?.meta.type && this.entity?.meta.type === 'edc') {
      (this.form.get('meta') as FormGroup).removeControl('meta.eWallets');
      delete (this.form.value.meta.eWallet);
    }

    if (!!this.entity?.meta.type && this.entity?.meta.type === 'e_wallet') {
      (this.form.get('meta') as FormGroup).removeControl('meta.eWallets');
      delete (this.form.value.meta.banks);
    }
    super.save();
  }

  delete(): void {
    super.delete();
  }

  onInStoreChange($event: any) {
    this.isMetaDetailAvailable = $event === 'e_wallet' || $event === 'eWallets' || $event === 'edc';
    this.currentMetaType = $event;

    if (this.currentMetaType === 'e_wallet') {
      this.currentMetaLabel = 'eWallets';
    } else if (this.currentMetaType === 'edc') {
      this.currentMetaLabel = 'banks';
    } else {
      this.currentMetaLabel = '';
    }
  }

  smeLicensePaymentType() {
    if (!this.configSercvice.isEnterpriseLicense()) {
      this.typeChoices = this.typeChoices.filter(opt => enumToArray(PaymentTypeSmeClient).includes(opt.value));
    }
  }

}
