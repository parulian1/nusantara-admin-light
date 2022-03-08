import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractDetailComponent, ToastService } from '@nusantara/core';
import { device } from '@nusantara/models';
import { DeviceService } from '@nusantara/services';

@Component({
  selector: 'nus-device-detail',
  template: `
    <nus-detail-title
        [originalName]="originalEntityName"
        [typeName]="entityTypeName">
    </nus-detail-title>

    <ul class="non-field-errors" *ngIf="!!nonFieldErrors.length">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>

    <p class="body-2">Registered devices for BHISMA POS application</p>

    <form [formGroup]="form" (ngSubmit)="save()" class="fluid">
      <div id="personal-info" class="wrapper">
        <h1 class="heading-1" i18n>General Information</h1>
        <label>
          <span i18n>Warehouse</span>
          <span>{{entity.warehouse.name}}</span>
        </label>

        <label>
          <span i18n>Device Name</span>
          <span>{{entity.data.name}}</span>
        </label>

        <label>
          <span i18n>Device Model</span>
          <span>{{entity.data.model? entity.data.model: '-'}}</span>
        </label>

        <label>
          <span i18n>Device Id</span>
          <span>{{entity.data.firebaseId}}</span>
        </label>

        <label>
          <span i18n>Register Date</span>
          <span>{{entity.created|date: 'dd/MM/yyyy HH:mm:ss'}}</span>
        </label>

        <label>
          <span i18n>Last Login</span>
          <span>{{entity.data.lastLogin? (entity.data.lastLogin|date: 'dd/MM/yyyy HH:mm:ss') : '-' }}</span>
        </label>

        <label>
          <span i18n>Notes</span>
          <textarea [formControl]="notes" name="notes"></textarea>
          <nus-field-errors [control]="notes"></nus-field-errors>
        </label>

        <label class="checkbox">
          <input type="checkbox" [formControl]="isApproved" name="isApproved">
          <span i18n>Is Approved</span>
        </label>
      </div>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
  `,
  styles: [`
    .wrapper { padding: 16px 24px; border: solid 1px var(--grey); border-radius: 4px; margin-bottom: 24px; }
    .heading-1 { margin-bottom: 16px; }
  `]
})
export class DeviceComponent extends AbstractDetailComponent<device.IDevice> implements OnInit {

  entity: device.IDevice;
  originalEntityName = 'POS Device';
  entityTypeName = 'Device';

  constructor(service: DeviceService,
              router: Router,
              route: ActivatedRoute,
              public fb: FormBuilder,
              toast: ToastService) { super(route, router, toast, service); }

  get isApproved(): FormControl { return this.form.get('isApproved') as FormControl; }
  get notes(): FormControl { return this.form.get('notes') as FormControl; }

  ngOnInit() {
    super.ngOnInit();
  }

  initializeForm(entity?: device.IDevice) {
    this.entity = entity;
    this.form = this.fb.group({
      href: [entity?.href],
      isApproved: [entity?.isApproved ?? true],
      notes: [entity?.notes ?? '', []],
    });

    // need to mark as touched to make custom styling works
    this.form.controls.isApproved.markAsTouched();
  }
}

