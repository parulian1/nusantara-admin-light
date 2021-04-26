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
        <span>Device Model</span>
        <input type="text" [value]="entity.data.model? entity.data.model: ''" readonly>
      </label>

      <label>
        <span>
          Device Id
        </span>
        <input type="text" [value]="entity.data.firebaseId" readonly>
      </label>

      <label>
        <span>Register Date</span>
        <input type="datetime-local" [value]="convertDateTime(entity.created)" readonly>
      </label>

      <label>
        <span>Notes</span>
        <textarea [formControl]="notes" name="notes"></textarea>
        <nus-field-errors [control]="notes"></nus-field-errors>
      </label>

      <label class="checkbox">
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

  convertDateTime(timestamp: string) {
    if (timestamp) {
      const date = new Date(timestamp);

      const year = date.getFullYear();
      let month: string | number = date.getMonth() + 1; // getMonth() is zero-indexed, so we'll increment to get the correct month number
      let day: string | number = date.getDate();
      let hours: string | number = date.getHours();
      let minutes: string | number = date.getMinutes();
      let seconds: string | number = date.getSeconds();

      month = (month < 10) ? '0' + month : month;
      day = (day < 10) ? '0' + day : day;
      hours = (hours < 10) ? '0' + hours : hours;
      minutes = (minutes < 10) ? '0' + minutes : minutes;
      seconds = (seconds < 10) ? '0' + seconds : seconds;
      return (`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
    }
    return '';
  }
}

