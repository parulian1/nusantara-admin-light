import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractDetailComponent, ToastService } from '@nusantara/core';
import { IShippingProvider, IShippingService, drf, ISocialMedia } from '@nusantara/models';
import { ShippingProviderService } from '@nusantara/services';
import { Kgx, ShippingServicesTypes } from './shipping-service/constants';

@Component({
  selector: 'nus-shipping-provider-detail',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      [typeName]="entityTypeName">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()" #f>
      <label>
        <span>Name</span>
        <input type="text" formControlName="name">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span>Type</span>
        <select formControlName="type">
          <option *ngFor="let choice of types" [ngValue]="choice.value">{{ choice.displayName }}</option>
        </select>
        <nus-field-errors [control]="type"></nus-field-errors>
      </label>

      <label>
        <span>Auth User</span>
        <input type="text" formControlName="authUser">
        <nus-field-errors [control]="authUser"></nus-field-errors>
      </label>

      <label>
        <span>Auth Key</span>
        <input type="text" formControlName="authPass">
        <nus-field-errors [control]="authPass"></nus-field-errors>
      </label>

      <label class="checkbox">
        <span>Is Active</span>
        <input type="checkbox" formControlName="isActive">
      </label>

      <label>
        <span>Icon</span>
        <img [src]="iconPreviewUrl" alt="Shipping Method Icon" class="preview">
        <input type="file" [formControl]="icon" (change)="setIconImagePreview($event)"
               name="icon" accept="image/*">
        <nus-field-errors [control]="icon"></nus-field-errors>
      </label>

      <label>
        <span>Description</span>
        <input type="text" formControlName="description">
        <nus-field-errors [control]="description"></nus-field-errors>
      </label>

      <ng-container *ngIf="type.value">
        <div class="sosmed-title">
          <h3>
            Shipping Service Settings
          </h3>
        </div>
        <hr/>
        <table class="line-items">
          <thead>
          <tr>
            <th>Type</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <nus-shipping-service-host
            *ngFor="let item of services.controls; let i=index"
            [form]="item"
            [shippingServiceTypes]="shippingServiceTypes"
            (remove)="services.removeAt(i)"
            [shippingType]="type.value"
          >
          </nus-shipping-service-host>
          <tr>
            <td colspan="9">
              <button type="button" (click)="addService()" class="add-button">
                Add Record
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </ng-container>
      <!--      <table>-->
      <!--        <thead>-->
      <!--        <tr>-->
      <!--          <th>Name</th>-->
      <!--          <th>Active</th>-->
      <!--          <th>Min. Weight (kg)</th>-->
      <!--          <th>Surcharge</th>-->
      <!--          <th>Grace Amount (kg)</th>-->
      <!--          <th>Description</th>-->
      <!--          <th></th>-->
      <!--        </tr>-->
      <!--        </thead>-->
      <!--        <tbody>-->
      <!--        <nus-shipping-service-->
      <!--          *ngFor="let service of services.controls; let i=index"-->
      <!--          [form]="service"-->
      <!--          (remove)="removeService(i)">-->
      <!--        </nus-shipping-service>-->
      <!--        </tbody>-->
      <!--      </table>-->

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
  `,
  styles: []
})
export class ShippingProviderDetailComponent extends AbstractDetailComponent<IShippingProvider> implements OnInit {

  entity?: IShippingProvider;
  types: drf.IChoice[] = [];
  iconPreviewUrl: string;
  shippingServiceTypes: drf.IChoice[] = [];

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
    this.originalEntityName = 'Shipping Method';
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get type(): FormControl {
    return this.form.get('type') as FormControl;
  }

  get services(): FormArray {
    return this.form.get('services') as FormArray;
  }

  get icon(): FormControl {
    return this.form.get('icon') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get authUser(): FormControl {
    return this.form.get('authUser') as FormControl;
  }

  get authPass(): FormControl {
    return this.form.get('authPass') as FormControl;
  }

  initializeForm(entity?: IShippingProvider) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required]],
      href: [entity?.href, []],
      description: [entity?.href ? entity?.description : '', []],
      type: [entity?.type, [Validators.required]],
      authUser: [entity?.authUser, []],
      authPass: [entity?.authPass, []],
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
    });
  }

  addService(service?: IShippingService): void {
    const f = this.fb.group({
      href: [service?.href, []],
      isActive: [service?.isActive ?? false, []],
      name: [service?.name, [Validators.required]],
      icon: [service?.icon ?? '', []],
      minimumWeight: [service?.minimumWeight ?? 0, [Validators.required]],
      handlingFee: [service?.handlingFee ?? 0, [Validators.required]],
      graceAmount: [service?.graceAmount ?? 0, [Validators.required]],
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
}
