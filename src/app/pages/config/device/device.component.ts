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

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span>Warehouse</span>
        <input type="text" [value]="entity.warehouse.name" readonly>
      </label>

      <label>
        <span>Device Name</span>
        <input type="text" [value]="entity.data.name" readonly>
      </label>

      <label>
        <span>
          Device Id
        </span>
        <input type="text" [value]="entity.data.firebaseId" readonly>
      </label>

      <label>
        <span>Is Approved</span>
        <input type="checkbox" [formControl]="isApproved">
      </label>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
  `,
  styles: [``]
})
export class DeviceComponent extends AbstractDetailComponent<device.IDevice> implements OnInit {

  entity: device.IDevice;

  constructor(service: DeviceService,
              router: Router,
              route: ActivatedRoute,
              public fb: FormBuilder,
              toast: ToastService) { super(route, router, toast, service); }

  get isApproved(): FormControl { return this.form.get('isApproved') as FormControl; }

  ngOnInit() {
    super.ngOnInit();
  }

  initializeForm(entity?: device.IDevice) {
    this.entity = entity;
    this.form = this.fb.group({
      href: [entity?.href],
      isApproved: [entity?.isApproved ?? true],
    });
  }
}

