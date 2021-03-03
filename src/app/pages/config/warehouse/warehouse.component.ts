import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractDetailComponent, ToastService } from '@nusantara/core';
import { ISubLocation, IWarehouse, drf } from '@nusantara/models';
import { SiteConfigService, WarehouseService } from '@nusantara/services';
import { RequireIsEnterpriseGuard } from '@nusantara/auth';

@Component({
  selector: 'nus-warehouse-detail',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      [typeName]="entityTypeName">
    </nus-detail-title>

    <ul class="non-field-errors" *ngIf="!!nonFieldErrors.length">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span>Name</span>
        <input type="text" formControlName="name" name="name">
        <nus-field-errors [control]="form.get('name')"></nus-field-errors>
      </label>

      <label>
        <span>Code</span>
        <input type="text" formControlName="code" name="code">
        <nus-field-errors [control]="form.get('code')"></nus-field-errors>
      </label>

      <label *ngIf="enterpriseGuard.canActivate(null, null)">Type
        <select formControlName="type" name="type">
          <option *ngFor="let opt of types" [ngValue]="opt.value">
            {{opt.displayName}}
          </option>
        </select>
        <nus-field-errors [control]="form.get('type')"></nus-field-errors>
      </label>

      <label *ngIf="enterpriseGuard.canActivate(null, null)">
        <span>Financial Reporting As</span>
        <select formControlName="financialReportingAs" name="financialReportingAs">
          <option *ngFor="let wh of warehouses" [ngValue]="wh.href">
            {{ wh.name }}
          </option>
        </select>
        <nus-field-errors [control]="form.get('financialReportingAs')"></nus-field-errors>
      </label>

      <label>
        <span>Internal Notes</span>
        <textarea formControlName="internalNotes" name="internalNotes"></textarea>
        <nus-field-errors [control]="form.get('internalNotes')"></nus-field-errors>
      </label>

      <nus-address [form]="form.get('address')" formGroupName="address">
      </nus-address>

      <label class="checkbox">
        <input type="checkbox" [attr.disabled]="disableIsActive ? '' : null" formControlName="isActive" name="isActive"> Is Active
        <nus-field-errors [control]="form.get('isActive')"></nus-field-errors>
      </label>

      <div *ngIf="enterpriseGuard.canActivate(null, null)">
        <h2>
          <span>Inventory Locations</span>
          <button type="button" (click)="addSubLocation()" class="add-button">
            <i class="material-icons">add_circle</i>
          </button>
        </h2>

        <table>
          <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Type</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let subLoc of subLocations.controls; let i=index" [formGroup]="subLoc">
            <td><input type="text" formControlName="name" maxlength="255"></td>
            <td><input type="text" formControlName="code" maxlength="255"></td>
            <td>
              <select formControlName="type">
                <option *ngFor="let opt of subLocationTypes" [ngValue]="opt.value">
                  {{opt.displayName}}
                </option>
              </select>
            </td>
            <td>
              <button (click)="removeSubLocation(i)">Remove</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <nus-detail-actions
        [component]="this"
        [hideDelete]=true
        (cancel)="navigateToParent(true)">
      </nus-detail-actions>
    </form>
  `,
  styles: [``]
})
export class WarehouseComponent extends AbstractDetailComponent<IWarehouse> implements OnInit {

  types: Array<drf.IChoice>;
  subLocationTypes: Array<drf.IChoice>;
  disableIsActive: boolean;

  warehouses: Array<{ href: string, name: string, code: string }>;

  constructor(service: WarehouseService,
              router: Router,
              route: ActivatedRoute,
              public fb: FormBuilder,
              toast: ToastService,
              public configService: SiteConfigService,
              public enterpriseGuard: RequireIsEnterpriseGuard) {
    super(route, router, toast, service);
  }

  get subLocations(): FormArray {
    return this.form.get('subLocations') as FormArray;
  }

  ngOnInit() {
    super.ngOnInit();
    this.route.data.subscribe((data: {
      types: drf.IChoice[],
      subLocationTypes: drf.IChoice[],
      allWarehouses: IWarehouse[]
    }) => {
      this.types = data.types;
      this.subLocationTypes = data.subLocationTypes;

      // Avoid multiple warehouses for SME clients
      let isWarehouseActive = data.allWarehouses.find(e => e.href === this.href.value);
      if (data.allWarehouses.length > 0 && !isWarehouseActive && !this.configService.isEnterpriseLicense()) {
        this.disableIsActive = true;
      }

      this.warehouses = data.allWarehouses;
      this.warehouses.unshift({href: null, name: '---', code: ''});
    });
  }

  initializeForm(entity?: IWarehouse) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, Validators.maxLength(50), ]],
      code: [entity?.code, [Validators.required, Validators.maxLength(255), ]],
      href: [entity?.href, []],
      type: [entity?.type || 'permanent', [Validators.required]],
      internalNotes: [entity?.internalNotes || '', []],
      financialReportingAs: [entity?.financialReportingAs, []],
      allowReassignmentFrom: this.fb.array([]),
      subLocations: this.fb.array([]),
      isActive: [entity?.isActive ?? true],
      address: this.fb.group({
        country: [entity?.address?.street || 'id', [Validators.required, ]],
        province: [entity?.address?.province, [Validators.required, ]],
        city: [entity?.address?.city, [Validators.required, ]],
        district: [entity?.address?.district, [Validators.required, ]],
        subDistrict: [entity?.address?.subDistrict, [Validators.required, ]],
        street: [entity?.address?.street, [Validators.required, ]],
        postalCode: [entity?.address?.postalCode, [Validators.required, ]],
        notes: [entity?.address?.notes, []],
        latitude: [entity?.address?.latitude, []],
        longitude: [entity?.address?.longitude, []],
      }),
    });

    // need to mark as touched to make custom styling works
    this.form.controls.isActive.markAsTouched();

    const defaultSubLoc: ISubLocation = {
      href: null,
      name: 'default',
      code: 'default',
      type: 'omni_channel'
    };

    for (const subLoc of entity?.subLocations ?? [defaultSubLoc, ]) {
      this.addSubLocation(subLoc);
    }
  }

  addSubLocation(subLocation?: ISubLocation) {
    const arr = this.fb.group({
      name: [subLocation?.name, [Validators.required, ]],
      code: [subLocation?.code, [Validators.required, ]],
      type: [subLocation?.type, [Validators.required, ]],
      href: [subLocation?.href, []],
    });
    this.subLocations.push(arr);
  }

  removeSubLocation(index: number) {
    this.subLocations.removeAt(index);
  }

}

