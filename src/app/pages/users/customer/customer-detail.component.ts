import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { OrderService, UserService } from '@nusantara/services';
import { AbstractDetailComponent, PagedResponse, ToastService } from '@nusantara/core';
import { ICustomer, ICustomerGroup, IOrder } from '@nusantara/models';
import { RequireIsEnterpriseGuard } from '@nusantara/auth';
import { CustomerPointModalComponent } from '@nusantara/pages/users/customer/customer-point-modal.component';

/**
 * Displays basic information about a customer, their profile, purchase history,
 * and group membership.  Only some data (basic customer information and group membership)
 * may be edited directly.
 */
@Component({
  selector: 'nus-customer-detail',
  template: `
    <h1 class="title-1" i18n>Customer Details</h1>

    <ul class="non-field-errors">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span i18n>First Name</span>
        <input type="text" formControlName="firstName">
      </label>

      <label>
        <span i18n>Last Name</span>
        <input type="text" formControlName="lastName">
      </label>

      <label>
        <span i18n>Email Address</span>
        <input type="email" formControlName="email">
      </label>

      <label>
        <span i18n>Phone Number</span>
        <input type="tel" formControlName="phoneNumber">
      </label>

      <label>
        <span i18n>Home Phone Number</span>
        <input type="tel" formControlName="homePhoneNumber">
      </label>

      <div class="tab-header">
        <label [ngClass]="{'active': currentTab === 'summary'}">
          <i class="material-icons">analytics</i>
          <input type="radio" id="tab_summary" value="summary" formControlName="currentTab" i18n>
          Summary
        </label>

        <label [ngClass]="{'active': currentTab === 'profile'}">
          <i class="material-icons">face</i>
          <input type="radio" id="tab_profile" value="profile" formControlName="currentTab" i18n>
          Profile
        </label>

        <label [ngClass]="{'active': currentTab === 'orders'}">
          <i class="material-icons">receipt_long</i>
          <input type="radio" id="tab_profile" value="orders" formControlName="currentTab" i18n>
          Orders
        </label>

        <label [ngClass]="{'active': currentTab === 'groups'}" *ngIf="enterpriseGuard.canActivate(null, null)">
          <i class="material-icons">group_work</i>
          <input type="radio" id="tab_profile" value="groups" formControlName="currentTab" i18n>
          Groups
        </label>
      </div>

      <div *ngIf="currentTab === 'summary'" id="summary">
        <div class="shadow-box" id="summary-acquisition">
          <h2 i18n><i class="material-icons">verified</i> Acquisition</h2>
          <dl>
            <dt i18n>Registration Date</dt>
            <dd>{{ dateJoined|date }}</dd>
            <dt i18n>Campaign</dt>
            <dd>{{ registrationCampaign || 'None' }}</dd>
            <dt i18n>Channel</dt>
            <dd>{{ profile.registrationChannel }}</dd>
            <dt i18n>Last Login</dt>
            <dd>{{ (lastLogin|date) || 'Never' }}</dd>
          </dl>
        </div>

        <div class="shadow-box">
          <h2 i18n><i class="material-icons">star</i> Value</h2>
          <dl>
            <dt i18n>Lifetime Value</dt>
            <dd>{{ profile.lifetimeValue|currency:"IDR" }}</dd>
            <dt i18n>Orders</dt>
            <dd>{{ profile.purchaseCount }}</dd>
            <dt i18n>Avg Basket Size</dt>
            <!-- just divide by 1 if purchase count is 0 so no divide-by-zero error -->
            <dd>{{ (profile.lifetimeValue/(profile.purchaseCount || 1)) |currency:"IDR" }}</dd>
            <dt i18n>Last Purchase</dt>
            <dd>{{ (profile.lastPurchaseDate|date) || "None" }}</dd>
          </dl>
        </div>
      </div>

      <div *ngIf="currentTab === 'profile'" id="profile">
        <section id="customer-point-summary">
          <div id="customer-total-point">
            <img src="/assets/point-icon.svg" alt="Profile Image">
            <span i18n>{{ userPoint | number }} Point</span>
          </div>
          <div>
            <a (click)="pointHistory()" i18n>Points History</a>
          </div>
        </section>
        <table>
          <thead>
          <tr>
            <th i18n>Attribute</th>
            <th i18n>Value</th>
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
            <th i18n>Number</th>
            <th i18n>Date</th>
            <th i18n>Channel</th>
            <th i18n>Type</th>
            <th i18n>Status</th>
            <th i18n>Grand Total</th>
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
            <th i18n>Group Name</th>
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

      <nus-customer-point-modal
        [entity]="entity"
        #pointHistoryModal
      ></nus-customer-point-modal>

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
    #customer-point-summary {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 12px 24px;
      border: 1px solid #B4B4B4;
      box-sizing: border-box;
      border-radius: 4px;
      margin: 16px 0;
    }
    #customer-point-summary span{
      font-weight: bold;
      font-size: 16px;
      line-height: 24px;
    }
    #customer-total-point {
      display: flex;
    }
    #customer-total-point img{
      margin-inline-end: 8px;
    }
  `]
})
export class CustomerDetailComponent extends AbstractDetailComponent<ICustomer> implements OnInit{

  dateJoined: Date;
  registrationCampaign: string;
  lastLogin: Date;
  profile: any;
  customerGroups: ICustomerGroup[];
  orders: IOrder[];
  userPoint: number;
  entity?: ICustomer;

  page: PagedResponse<any>;

  private userEmail: string;

  get currentTab(): string {
    return this.form.get('currentTab').value;
  }

  @ViewChild('pointHistoryModal') pointHistoryModal: CustomerPointModalComponent;

  constructor(service: UserService,
              route: ActivatedRoute,
              router: Router,
              toast: ToastService,
              private fb: FormBuilder,
              private orderService: OrderService,
              public enterpriseGuard: RequireIsEnterpriseGuard) {
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
    this.userPoint = entity.userPoint ? entity.userPoint : 0;
    this.entity = entity;
  }

  pointHistory() {
    this.pointHistoryModal.open();
  }

}
