import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { OrderService, UserService } from '@nusantara/services';
import { AbstractDetailComponent, PagedResponse, ToastService } from '@nusantara/core';
import { ICustomer, ICustomerGroup, IOrder } from '@nusantara/models';

/**
 * Displays basic information about a customer, their profile, purchase history,
 * and group membership.  Only some data (basic customer information and group membership)
 * may be edited directly.
 */
@Component({
  selector: 'nus-customer-detail',
  template: `
    <h1 class="title-1">Customer Details</h1>

    <ul class="non-field-errors">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>

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

      <div *ngIf="currentTab === 'summary'" id="summary">
        <div class="shadow-box" id="summary-acquisition">
          <h2><i class="material-icons">verified</i> Acquisition</h2>
          <dl>
            <dt>Registration Date</dt>
            <dd>{{ dateJoined|date }}</dd>
            <dt>Campaign</dt>
            <dd>{{ registrationCampaign || 'None' }}</dd>
            <dt>Channel</dt>
            <dd>{{ profile.registrationChannel }}</dd>
            <dt>Last Login</dt>
            <dd>{{ (lastLogin|date) || 'Never' }}</dd>
          </dl>
        </div>

        <div class="shadow-box">
          <h2><i class="material-icons">star</i> Value</h2>
          <dl>
            <dt>Lifetime Value</dt>
            <dd>{{ profile.lifetimeValue|currency:"IDR" }}</dd>
            <dt>Orders</dt>
            <dd>{{ profile.purchaseCount }}</dd>
            <dt>Avg Basket Size</dt>
            <!-- just divide by 1 if purchase count is 0 so no divide-by-zero error -->
            <dd>{{ (profile.lifetimeValue/(profile.purchaseCount || 1)) |currency:"IDR" }}</dd>
            <dt>Last Purchase</dt>
            <dd>{{ (profile.lastPurchaseDate|date) || "None" }}</dd>
          </dl>
        </div>
      </div>

      <div *ngIf="currentTab === 'profile'" id="profile">
        <table>
          <thead>
          <tr>
            <th>Attribute</th>
            <th>Value</th>
          </tr>
          </thead>
          <tbody>
            <tr *ngFor="let kvp of profile | keyvalue">
              <td>{{ kvp.key | camelToHumanized }}</td>
              <td>{{ kvp.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="currentTab === 'orders'" id="orders">
        <table>
          <thead>
            <th>Number</th>
            <th>Date</th>
            <th>Channel</th>
            <th>Type</th>
            <th>Status</th>
            <th>Grand Total</th>
          </thead>
          <tbody>
            <tr *ngFor="let order of orders">
              <td>{{ order.orderNumber }}</td>
              <td>{{ order.created | date: 'dd/MM/yyyy HH:mm:ss' }}</td>
              <td>-</td>
              <td>{{ order.type }}</td>
              <td>{{ order.status }}</td>
              <td>{{ order.orderPayment ? order.orderPayment.amount : 0 | currency:"IDR" }}</td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="!!page">
            <nus-pagination-child [page]="page" (fetchPageNumber)="fetchOrders($event)"></nus-pagination-child>
        </div>
      </div>

      <div *ngIf="currentTab === 'groups'" id="groups">
        <table>
          <thead>
          <tr>
            <th>Group Name</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let customergroup of customerGroups">
            <td>{{ customergroup.name }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>

    </form>

  `,
  styles: [`
    #summary { display: grid; grid-template-columns: 1fr 1fr; }

    #summary dl {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto auto auto auto auto;
      font-size: 11.2px;
      padding: 0 5px;
    }
    #summary dt { font-weight: bold; }
    #summary dd { margin-left: 0; padding-bottom: 7px; font-size: 16px; }

    #summary dl dt:nth-of-type(1) { grid-column: 1/3; }
    #summary dl dd:nth-of-type(1) { grid-column: 1/3; grid-row: 2; }

    #summary dl dt:nth-of-type(2) { grid-row: 3; }
    #summary dl dd:nth-of-type(2) { grid-row: 4; }

    #summary dl dt:nth-of-type(3) { grid-column: 2; grid-row: 3; }
    #summary dl dd:nth-of-type(3) { grid-column: 2; grid-row: 4; }

    #summary dl dt:nth-of-type(4) { grid-row: 5; }
    #summary dl dd:nth-of-type(4) { grid-row: 6; }

    #summary dl dt:nth-of-type(5) { grid-column: 2; grid-row: 5; }
    #summary dl dd:nth-of-type(5) { grid-column: 2; grid-row: 6; }

    h2 {
      font-size: 16px;
      font-weight: lighter;
      text-align: center;
      color: #707070;
    }
    h2 > i {
      font-size: 1em;
    }

    .tab-header label { display: inline-block; }
    .tab-header label.active { color: var(--bhisma-orange); }
    .tab-header input:checked { background-color: var(--bhisma-orange); }
    .tab-header { margin-bottom: 5px; }
    .tab-header i { display: block; }
    .tab-header input[type=radio] { display: none; }
    .tab-header label {
      border-bottom: 2px solid;
      text-align: center;
      padding-right: 10px;
      padding-left: 10px;
    }
    .shadow-box {
      margin: 5px;
    }
  `]
})
export class CustomerDetailComponent extends AbstractDetailComponent<ICustomer> {

  dateJoined: Date;
  registrationCampaign: string;
  lastLogin: Date;
  profile: any;
  customerGroups: ICustomerGroup[];
  orders: IOrder[];

  page: PagedResponse<any>;

  private userEmail: string;

  get currentTab(): string {
    return this.form.get('currentTab').value;
  }

  constructor(service: UserService,
              route: ActivatedRoute,
              router: Router,
              toast: ToastService,
              private fb: FormBuilder,
              private orderService: OrderService) {
    super(route, router, toast, service);
  }

  ngOnInit() {
    super.ngOnInit();
    this.fetchOrders();
  }

  fetchOrders(pageNumber?: number) {

    this.orderService.fetchWithParam(pageNumber || 1, this.userEmail).subscribe((page) => {
      this.orders = page.entities;
      this.page = page;
    });
  }

  initializeForm(entity?: ICustomer) {
    this.form = this.fb.group({
      firstName: [entity?.firstName, [Validators.required, ]],
      lastName: [entity?.lastName, [Validators.required, ]],
      email: [entity?.email, [Validators.required, ]],
      href: [entity?.href, []],
      phoneNumber: [entity?.phoneNumber, []],
      homePhoneNumber: [entity?.homePhoneNumber, []],
      currentTab: ['summary', []]
    });

    this.dateJoined = new Date(entity?.dateJoined);
    this.lastLogin = entity?.lastLogin ? new Date(entity.lastLogin) : null;
    this.registrationCampaign = entity.profile?.registrationCampaign;
    this.profile = entity.profile;
    this.customerGroups = entity.customerGroups;
    this.userEmail = entity.email;
  }

}
