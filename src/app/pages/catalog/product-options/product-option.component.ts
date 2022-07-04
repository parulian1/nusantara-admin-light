import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractDetailComponent, ToastService } from '@nusantara/core';
import { drf, products } from '@nusantara/models';
import { ProductOptionService } from '@nusantara/services';

@Component({
  selector: 'nus-product-option-detail',
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
        <span i18n>Name</span>
        <input type="text" [formControl]="name" name="name" maxlength="50">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span i18n>Type</span>
        <select [formControl]="type" name="type">
          <option *ngFor="let opt of typeChoices" [ngValue]="opt.value">
            {{ opt.displayName }}
          </option>
        </select>
        <nus-field-errors [control]="type"></nus-field-errors>
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
        <span i18n>
          Minimum Length
        </span>
        <input type="number" formControlName="minimumLength">
        <nus-field-errors [control]="minimumLength"></nus-field-errors>
      </label>

      <label>
        <span i18n>
          Maximum Length
        </span>
        <input type="number" formControlName="maximumLength">
        <nus-field-errors [control]="maximumLength"></nus-field-errors>
      </label>

      <label>
        <span i18n>
          Webhook Check Domain
        </span>
        <input type="text" formControlName="webhookCheckDomain">
        <nus-field-errors [control]="webhookCheckDomain"></nus-field-errors>
      </label>

      <label>
        <span i18n>
          Webhook Post Checkout
        </span>
        <input type="text" formControlName="webhookPostCheckout">
        <nus-field-errors [control]="webhookPostCheckout"></nus-field-errors>
      </label>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()" [hideDelete]="true">
      </nus-detail-actions>
    </form>
  `,

})
export class ProductOptionComponent extends AbstractDetailComponent<products.IProductOption> implements OnInit {

  entity: products.IProductOption;
  typeChoices: drf.IChoice[] = [];
  entityTypeName = 'Product Options';

  constructor(service: ProductOptionService,
              router: Router,
              route: ActivatedRoute,
              public fb: FormBuilder,
              toast: ToastService) { super(route, router, toast, service); }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get href(): FormControl { return this.form.get('href') as FormControl; }
  get type(): FormControl { return this.form.get('type') as FormControl; }
  get isActive(): FormControl { return this.form.get('isActive') as FormControl; }
  get minimumLength(): FormControl { return this.form.get('minimumLength') as FormControl; }
  get maximumLength(): FormControl { return this.form.get('maximumLength') as FormControl; }
  get webhookCheckDomain(): FormControl { return this.form.get('webhookCheckDomain') as FormControl; }
  get webhookPostCheckout(): FormControl { return this.form.get('webhookPostCheckout') as FormControl; }

  ngOnInit() {
    super.ngOnInit();
    this.route.data.subscribe((data: {typeChoices: drf.IChoice[]}) => {
      this.typeChoices = data.typeChoices;
    });
  }

  initializeForm(entity?: products.IProductOption) {
    this.entity = entity;
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, ]],
      href: [entity?.href, []],
      type: [entity?.type ?? products.ProductOptionType.physical, []],
      minimumLength: [entity?.minimumLength ?? 0, []],
      maximumLength: [entity?.maximumLength ?? 0, []],
      webhookCheckDomain: [entity?.webhookCheckDomain ?? '', []],
      webhookPostCheckout: [entity?.webhookPostCheckout ?? '', []],
      isActive: [entity?.isActive ?? false, []],
    });

    // need to mark as touched to make custom styling works
    this.form.controls.isActive.markAsTouched();

    if (!this.isNew) {
      this.type.disable();
    }
  }
}

