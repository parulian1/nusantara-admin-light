import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '@nusantara/services';
import { AbstractDetailComponent } from '@nusantara/core';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'nus-customer-detail',
  template: `
    <h1>Customer Details</h1>

    <ul class="non-field-errors">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>

    <form [formGroup]="form" (ngSubmit)="submit()">

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

      <label>
        <span>Home Phone Number</span>
        <input type="tel" formControlName="homePhoneNumber">
      </label>

      <div class="tab-header">
        <label [ngClass]="{'active': currentTab === 'summary'}">
          <i class="material-icons">analytics</i>
          <input type="radio" id="tab_summary" value="summary" formControlName="currentTab">
          Summary
        </label>

        <label [ngClass]="{'active': currentTab === 'profile'}">
          <i class="material-icons">face</i>
          <input type="radio" id="tab_profile" value="profile" formControlName="currentTab">
          Profile
        </label>

        <label [ngClass]="{'active': currentTab === 'orders'}">
          <i class="material-icons">receipt_long</i>
          <input type="radio" id="tab_profile" value="orders" formControlName="currentTab">
          Orders
        </label>

        <label [ngClass]="{'active': currentTab === 'groups'}">
          <i class="material-icons">group_work</i>
          <input type="radio" id="tab_profile" value="groups" formControlName="currentTab">
          Groups
        </label>
      </div>

      <div *ngIf="currentTab === 'summary'">
        <div>
          <h3>Acquisition</h3>
        </div>
        <div>
          <h3>Value</h3>
        </div>
      </div>


    </form>

  `,
  styles: [`
    .tab-header label {
      display: inline-block;
    }
    .tab-header label.active {
      color: var(--bhisma-orange);
    }

    .tab-header input:checked {
      background-color: var(--bhisma-orange);
    }


  `]
})
export class CustomerDetailComponent extends AbstractDetailComponent implements OnInit {

  public entity: any;

  get currentTab(): string {
    return this.form.get('currentTab').value;
  }

  constructor(public service: UserService,
              public route: ActivatedRoute,
              public router: Router,
              private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { entity: any }) => {
      this.form = this.fb.group({
        firstName: [data.entity?.firstName, [Validators.required, ]],
        lastName: [data.entity?.lastName, [Validators.required, ]],
        email: [data.entity?.email, [Validators.required, ]],
        phoneNumber: [data.entity?.phoneNumber, [Validators.required]],
        homePhoneNumber: [data.entity?.homePhoneNumber, [Validators.required]],
        currentTab: ['summary', []]
      });
    });
  }

  submit() {

  }

}
