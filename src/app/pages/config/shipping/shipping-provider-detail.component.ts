import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractDetailComponent, ToastService } from '@nusantara/core';
import { IShippingProvider, IShippingService, drf } from '@nusantara/models';
import { ShippingProviderService } from '@nusantara/services';

@Component({
  selector: 'nus-shipping-provider-detail',
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
        <span>Type</span>
        <select formControlName="type">
          <option *ngFor="let choice of types" [ngValue]="choice.value">{{ choice.displayName }}</option>
        </select>
      </label>

      <label>
        <span>Is Active</span>
        <input type="checkbox" formControlName="isActive">
      </label>

      <label>
        <span>Icon</span>
        <input type="file" formControlName="icon">
      </label>

      <h2>Services <button (click)="addService()">Add</button></h2>
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Active</th>
          <th>Min. Weight (kg)</th>
          <th>Surcharge</th>
          <th>Grace Amount (kg)</th>
          <th>Description</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <nus-shipping-service
          *ngFor="let service of services.controls; let i=index"
          [form]="service"
          (remove)="removeService(i)">
        </nus-shipping-service>
        </tbody>
      </table>

      <div class="actions-container">
        <button type="submit" [disabled]="!form.valid">Save</button>
        <button type="button" (click)="navigateToParent(true)">Cancel</button>
        <button type="button" (click)="delete()" *ngIf="!isNew">Delete</button>
      </div>
    </form>
  `,
  styles: [ ]
})
export class ShippingProviderDetailComponent extends AbstractDetailComponent<IShippingProvider> implements OnInit {

  types: drf.IChoice[] = [];

  constructor(public service: ShippingProviderService,
              public route: ActivatedRoute,
              public router: Router,
              private fb: FormBuilder,
              public toast: ToastService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.route.data.subscribe((data: {types: drf.IChoice[]}) => {
      this.types = data.types;
    });
  }

  get services(): FormArray { return this.form.get('services') as FormArray; }

  initializeForm(entity?: IShippingProvider) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, ]],
      href: [entity?.href, []],
      description: [entity?.description, []],
      type: [entity?.type, [Validators.required]],
      isActive: [entity?.isActive, []],
      icon: [entity?.icon, []],
      services: this.fb.array([]),
    });

    this.originalEntityName = entity?.name;
  }

  addService(service?: IShippingService): void {
    const f = this.fb.group({
      href: [service?.href, []],
      isActive: [service?.isActive, []],
      name: [service?.name, [Validators.required, ]],
      icon: [service?.icon, []],
      minimumWeight: [service?.minimumWeight ?? 0, [Validators.required, ]],
      handlingFee: [service?.handlingFee ?? 0, [Validators.required, ]],
      graceAmount: [service?.graceAmount ?? 0, [Validators.required, ]],
      description: [service?.description, []]
    });
    this.services.push(f);
  }

  removeService(index: number): void {
    this.services.removeAt(index);
  }

}
