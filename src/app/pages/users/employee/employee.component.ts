import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CustomerService } from '@nusantara/services';
import { AbstractDetailComponent, ToastService } from '@nusantara/core';
import { IEmployee } from '@nusantara/models';

@Component({
  selector: 'nus-employee-detail',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Employee">
    </nus-detail-title>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span>First Name</span>
        <input type="text" formControlName="firstName">
      </label>

      <label>
        <span>Last Name</span>
        <input type="text" formControlName="lastName">
      </label>

      <label>
        <span>Email Address</span>
        <input type="email" formControlName="email">
      </label>

      <label>
        <span>Phone Number</span>
        <input type="tel" formControlName="phoneNumber">
      </label>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
  `,
  styles: [ ]
})
export class EmployeeComponent extends AbstractDetailComponent<IEmployee> implements OnInit {

  constructor(service: CustomerService,
              route: ActivatedRoute,
              router: Router,
              toast: ToastService,
              private fb: FormBuilder) {
    super(route, router, toast, service);
  }

  initializeForm(entity?: IEmployee) {
    this.form = this.fb.group({
      firstName: [entity?.firstName, [Validators.required, ]],
      lastName: [entity?.lastName, [Validators.required, ]],
      email: [entity?.email, [Validators.required, ]],
      href: [entity?.href, []],
      phoneNumber: [entity?.phoneNumber, []],
    });
  }

}
