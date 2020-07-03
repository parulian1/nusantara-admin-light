import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractDetailComponent, ToastService, PagedResponse } from '@nusantara/core';
import { ISubLocation, IWarehouse, drf } from '@nusantara/models';
import { WarehouseService } from '@nusantara/services';

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
        <input type="text" formControlName="name">
      </label>

      <label>
        <span>Code</span>
        <input type="text" formControlName="code">
      </label>

      <label>Type
        <select formControlName="type">
          <option *ngFor="let opt of types" [ngValue]="opt.value">
            {{opt.displayName}}
          </option>
        </select>
      </label>

      <label>
        <span>Financial Reporting As</span>
        <select formControlName="internalNotes">
          <option *ngFor="let wh of warehouses" [ngValue]="wh.href">
            {{ wh.name }}
          </option>
        </select>
      </label>

      <label>
        <span>Internal Notes</span>
        <textarea formControlName="internalNotes"></textarea>
      </label>

      <nus-address [form]="form.get('address')" formGroupName="address">
      </nus-address>

      <div>
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
            <td><input type="text" formControlName="name"></td>
            <td><input type="text" formControlName="code"></td>
            <td>
              <select formControlName="type">
                <option *ngFor="let opt of subLocationTypes" [ngValue]="opt.value">
                  {{opt.displayName}}
                </option>
              </select>
            </td>
            <td><button (click)="removeSubLocation(i)">Remove</button></td>
          </tr>
          </tbody>
        </table>

      </div>

      <div class="actions-container">
        <button type="submit" [disabled]="!form.valid">Save</button>
        <button type="button" (click)="navigateToParent(true)">Cancel</button>
        <button type="button" (click)="delete()" *ngIf="!isNew">Delete</button>
      </div>
    </form>
  `,
  styles: [``]
})
export class WarehouseComponent extends AbstractDetailComponent<IWarehouse> implements OnInit {

  types: Array<drf.IChoice>;
  subLocationTypes: Array<drf.IChoice>;

  warehouses: Array<{href: string, name: string, code: string}>;

  constructor(public service: WarehouseService,
              public router: Router,
              public route: ActivatedRoute,
              public fb: FormBuilder,
              public toast: ToastService) { super(); }

  get subLocations(): FormArray { return this.form.get('subLocations') as FormArray; }

  ngOnInit() {
    super.ngOnInit();
    this.route.data.subscribe((data: {types: drf.IChoice[],
                                           subLocationTypes: drf.IChoice[],
                                           allWarehouses: PagedResponse<IWarehouse>}) => {
      this.types = data.types;
      this.subLocationTypes = data.subLocationTypes;

      this.warehouses = data.allWarehouses.entities;
      this.warehouses.unshift({href: null, name: '---', code: ''});
    });
  }

  initializeForm(entity?: IWarehouse) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, ]],
      code: [entity?.code, [Validators.required, ]],
      href: [entity?.href, []],
      type: [entity?.type, []],
      internalNotes: [entity?.internalNotes || '', []],
      financialReportingAs: [entity?.financialReportingAs, []],
      allowReassignmentFrom: this.fb.array([]),
      subLocations: this.fb.array([]),
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

