import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AbstractDetailComponent, ToastService} from '@nusantara/core';
import {IGiftVoucher} from '@nusantara/models';
import {GiftVoucherService} from '@nusantara/services';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'nus-gift-voucher',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Voucher">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span>Name</span>
        <input type="text" [formControl]="name" maxlength="50">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span>Code</span>
        <input type="text" [formControl]="code" maxlength="10">
        <nus-field-errors [control]="code"></nus-field-errors>
      </label>

      <label>
        <span>Amount</span>
        <input type="number" [formControl]="amount" placeholder="Ex, 10000000">
        <nus-field-errors [control]="amount"></nus-field-errors>
      </label>

      <label>
        <span>Valid From</span>
        <input type="datetime-local" [formControl]="validFrom">
        <nus-field-errors [control]="validFrom"></nus-field-errors>
      </label>

      <label>
        <span>Valid To</span>
        <input type="datetime-local" [formControl]="validTo">
        <nus-field-errors [control]="validTo"></nus-field-errors>
      </label>

      <label class="toggle">
        <input type="checkbox"
               class="toggle"
               [formControl]="isActive"
               name="is-active"/>
        <span>Is Active</span>
        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>

      <nus-detail-actions
        [component]="this"
        [hideDelete]="!!entity && entity?.href && !entity?.isActive"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>

    <!-- Modals -->
    <nus-product-selection-modal></nus-product-selection-modal>

  `,
  styles: []
})
export class GiftVoucherComponent extends AbstractDetailComponent<IGiftVoucher> implements OnInit, AfterViewInit {
  public entity: IGiftVoucher;

  constructor(service: GiftVoucherService,
              private  fb: FormBuilder,
              toast: ToastService,
              route: ActivatedRoute,
              router: Router) {
    super(route, router, toast, service);
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get code(): FormControl {
    return this.form.get('code') as FormControl;
  }

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  get validFrom(): FormControl {
    return this.form.get('validFrom') as FormControl;
  }

  get validTo(): FormControl {
    return this.form.get('validTo') as FormControl;
  }

  get isActive(): FormControl {
    return this.form.get('isActive') as FormControl;
  }

  initializeForm(entity?: IGiftVoucher) {
    this.entity = entity;
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, Validators.maxLength(50)]],
      href: [entity?.href],
      code: [entity?.code, [Validators.required, Validators.maxLength(10)]],
      amount: [entity?.amount, [Validators.required, Validators.min(1)]],
      validFrom: [this.convertDateTime(entity?.validFrom), [Validators.required]],
      validTo: [this.convertDateTime(entity?.validTo), [Validators.required]],
      isActive: [entity?.isActive, []],
    });

    // need to mark as touched to make custom styling works
    this.form.controls.isActive.markAsTouched();
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

  getTimeZone() {
    const offset = new Date().getTimezoneOffset();
    const o = Math.abs(offset);
    return (offset < 0 ? '+' : '-') + ('00' + Math.floor(o / 60)).slice(-2) + ':' + ('00' + (o % 60)).slice(-2);
  }

  save() {
    this.form.value.validFrom = this.form.value.validFrom + this.getTimeZone();
    this.form.value.validTo = this.form.value.validTo + this.getTimeZone();
    super.save();
  }
}
