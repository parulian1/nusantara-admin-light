import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractDetailComponent, ToastService } from '@nusantara/core';
import { IShippingProvider, IShippingService, drf } from '@nusantara/models';
import { ShippingProviderService } from '@nusantara/services';
import { Kgx, ShippingServicesTypes } from './shipping-service/constants';

@Component({
  selector: 'nus-shipping-provider-detail',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Shipping Method">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()" #f>
      <div class="container">
        <div class="main-content">
          <div class="wrapper">
            <h2 class="heading-1" i18n>General Information</h2>

            <label>
              <span i18n>Name</span>
              <input type="text" formControlName="name" maxlength="25">
              <nus-field-errors [control]="name"></nus-field-errors>
            </label>

            <label>
              <span i18n>Type</span>
              <select formControlName="type">
                <option disabled selected [ngValue]="null"> --Select-- </option>
                <option *ngFor="let choice of types" [ngValue]="choice.value">{{ choice.displayName }}</option>
              </select>
              <nus-field-errors [control]="type"></nus-field-errors>
            </label>

            <label>
              <span i18n>Auth User</span>
              <input type="text" formControlName="authUser">
              <nus-field-errors [control]="authUser"></nus-field-errors>
            </label>

            <label>
              <span i18n>Auth Key</span>
              <input type="text" formControlName="authPass">
              <nus-field-errors [control]="authPass"></nus-field-errors>
            </label>

            <label class="toggle">
              <input type="checkbox"
                     class="toggle"
                     [formControl]="isActive"
                     name="is-active"/>
              <span i18n>Is Active</span>
              <nus-field-errors [control]="isActive"></nus-field-errors>
            </label>

            <label>
              <span i18n>Icon</span>
              <img [src]="iconPreviewUrl" alt="Shipping Method Icon" class="preview">
              <input type="file" [formControl]="icon" (change)="setIconImagePreview($event)"
                     name="icon" accept="image/*">
              <nus-field-errors [control]="icon"></nus-field-errors>
            </label>

            <label>
              <span i18n>Description</span>
              <input type="text" formControlName="description">
              <nus-field-errors [control]="description"></nus-field-errors>
            </label>

            <label>
              <span i18n>Sender Name</span>
              <input type="text" formControlName="senderName">
              <nus-field-errors [control]="senderName"></nus-field-errors>
            </label>

            <label>
              <span i18n>Sender Email</span>
              <input type="text" formControlName="senderEmail">
              <nus-field-errors [control]="senderEmail"></nus-field-errors>
            </label>

            <label>
              <span i18n>Sender Phone</span>
              <input type="text" formControlName="senderPhone">
              <nus-field-errors [control]="senderPhone"></nus-field-errors>
            </label>

          </div>
          <div class="wrapper" *ngIf="type.value">
            <h2 class="heading-1" i18n>Shipping Service Settings</h2>

            <table class="line-items">
              <thead>
              <tr>
                <th i18n>Type</th>
                <th *ngIf="type.value != 'kgx'" i18n>Active</th>
                <th *ngIf="type.value != 'kgx'" i18n>Minimum Weight</th>
                <th *ngIf="type.value != 'kgx'" i18n>Handling Fee</th>
                <th *ngIf="type.value != 'kgx'" i18n>Grace Amount</th>
                <th *ngIf="type.value != 'kgx'" i18n>Description</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <nus-shipping-service-host
                *ngFor="let item of services.controls; let i=index"
                [form]="item"
                [shippingServiceTypes]="shippingServiceTypes"
                [selectedService]="selectedService"
                (remove)="services.removeAt(i)"
                (newSelectedService)="updateSelectedService($event, i)"
                (removeSelectedService)="removeSelectedService($event)"
                [shippingType]="type.value"
              >
              </nus-shipping-service-host>
              <tr *ngIf="selectedService.length !== shippingServiceTypes.length">
                <td colspan="9">
                  <button type="button" (click)="addService()" class="new-add-button wide" i18n>
                    Add Record
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>

    </form>
  `,
  styles: [
    'h1, h2 { margin-bottom: 0.75rem; }',
    'form{ max-width: none;}',
    '.container { display: grid; grid-template-columns: 4fr 1fr; grid-gap: 24px; }',
    '.wrapper { border: 1px solid var(--grey); border-radius: 4px; padding: 16px 24px; }',
    '.wrapper:not(:last-child) { margin-bottom: 24px; }',
    '.wrapper label { min-height: 0; }',
    '.wrapper span{ font-weight: 700; color: var(--darken-grey); }',
  ]
})
export class ShippingProviderDetailComponent extends AbstractDetailComponent<IShippingProvider> implements OnInit {

  entity?: IShippingProvider;
  types: drf.IChoice[] = [];
  iconPreviewUrl: string;
  shippingServiceTypes: drf.IChoice[] = [];
  selectedService: any = [];

  constructor(service: ShippingProviderService,
              route: ActivatedRoute,
              router: Router,
              private fb: FormBuilder,
              toast: ToastService) {
    super(route, router, toast, service);
  }

  ngOnInit() {
    super.ngOnInit();
    this.route.data.subscribe((data: { types: drf.IChoice[] }) => {
      this.types = data.types;
      this.shippingServiceTypes = ShippingServicesTypes;
    });
  }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get type(): FormControl { return this.form.get('type') as FormControl; }
  get services(): FormArray { return this.form.get('services') as FormArray; }
  get icon(): FormControl { return this.form.get('icon') as FormControl; }
  get description(): FormControl { return this.form.get('description') as FormControl; }
  get authUser(): FormControl { return this.form.get('authUser') as FormControl; }
  get authPass(): FormControl { return this.form.get('authPass') as FormControl; }
  get senderName(): FormControl { return this.form.get('senderName') as FormControl; }
  get senderEmail(): FormControl { return this.form.get('senderEmail') as FormControl; }
  get senderPhone(): FormControl { return this.form.get('senderPhone') as FormControl; }
  get isActive(): FormControl { return this.form.get('isActive') as FormControl; }

  initializeForm(entity?: IShippingProvider) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required]],
      href: [entity?.href, []],
      description: [entity?.href ? entity?.description : '', []],
      type: [entity?.type, [Validators.required]],
      authUser: [entity?.authUser, []],
      authPass: [entity?.authPass, []],
      senderName: [entity?.senderName, []],
      senderEmail: [entity?.senderEmail, []],
      senderPhone: [entity?.senderPhone, []],
      isActive: [entity?.isActive ?? false, []],
      icon: [entity?.href ? '' : null, entity?.icon ? [] : [Validators.required]],
      services: this.fb.array([])
    });

    this.entity = entity;

    // need to mark as touched to make custom styling works
    this.form.controls.isActive.markAsTouched();

    this.setIconImagePreview(entity?.icon);

    this.originalEntityName = entity?.name;

    entity?.services.forEach((service) => {
      this.addService(service);
      this.selectedService.push(service.name);
    });
  }

  addService(service?: IShippingService): void {
    const f = this.fb.group({
      href: [service?.href, []],
      isActive: [service?.isActive ?? false, []],
      name: [service?.name, [Validators.required]],
      icon: [service?.icon ?? '', []],
      minimumWeight: [service?.minimumWeight ?? 0, [Validators.required, Validators.max(999999999.9999)]],
      handlingFee: [service?.handlingFee ?? 0, [Validators.required, Validators.max(999999999.9999)]],
      graceAmount: [service?.graceAmount ?? 0, [Validators.required, Validators.max(9999.99)]],
      description: [service?.description ?? '', []]
    });

    const fKgx = this.fb.group({
      href: [service?.href, []],
      isActive: [service?.isActive ?? true, []],
      name: [service?.name, [Validators.required]],
      icon: [service?.icon ?? '', []],
      minimumWeight: [service?.minimumWeight ?? 0, []],
      handlingFee: [service?.handlingFee ?? 0, []],
      graceAmount: [service?.graceAmount ?? 0, []],
      description: [service?.description ?? '', []]
    });

    // need to mark as touched to make custom styling works
    f.controls.isActive.markAsTouched();
    fKgx.controls.isActive.markAsTouched();
    if (this.form.value.type === Kgx) {
      this.services.push(fKgx);
    } else {
      this.services.push(f);
    }
  }

  removeService(index: number): void {
    this.services.removeAt(index);
  }

  setIconImagePreview(data?: Event | string) {
    super.setImagePreview(data, (dataAsUrl) => {
      this.iconPreviewUrl = dataAsUrl;
    });
  }

  save() {
    if (!!this.entity?.href && !!this.entity?.icon && !this.icon.value) {
      this.form.removeControl('icon');
    }
    if (!!this.icon && this.iconPreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.icon = this.iconPreviewUrl;
    }
    super.save();
  }

  updateSelectedService(serviceName: string, index: number) {
    this.selectedService[index] = serviceName;
  }

  removeSelectedService(serviceName: string) {
    const index = this.selectedService.indexOf(serviceName);
    if (index > -1) {
      this.selectedService.splice(index, 1);
    }
  }

  protected onSaveError(error: any) {
    super.onSaveError(error);

    // Add back icon control that has been remove when save
    this.form.addControl('icon', new FormControl(this.entity?.href ? '' : null, this.entity?.icon ? [] : [Validators.required]))
  }
}
