import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { parse } from 'iso8601-duration';

import {
  AbstractDetailComponent,
  DialogResult,
  ToastService
} from '@nusantara/core';
import { ICustomerGroup, CustomerGroupType, drf, IEmailHrefUserEntity, ICustomer } from '@nusantara/models';
import { CustomerGroupService } from '@nusantara/services';
import { UserSelectionModalComponent } from '@nusantara/shared';

@Component({
  selector: 'nus-customer-group-detail',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Customer Group">
    </nus-detail-title>

    <ul class="non-field-errors">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>

    <form [formGroup]="form" (ngSubmit)="save()">
      <label>
        <span>Name</span>
        <input type="text" [formControl]="name">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span>Type</span>
        <select [formControl]="type">
          <option *ngFor="let opt of typeChoices" [ngValue]="opt.value">
            {{ opt.displayName }}
          </option>
        </select>
        <nus-field-errors [control]="type"></nus-field-errors>
      </label>

      <label [class.hidden]="timeThreshold.disabled">
        <span>{{ timeThresholdLabel }}</span>
        <input type="number" [formControl]="timeThreshold">
      </label>

      <label [class.hidden]="amountThreshold.disabled">
        <span>{{ amountThresholdLabel }}</span>
        <input type="number" [formControl]="amountThreshold">
      </label>

      <table *ngIf="type.value === manual">
        <thead>
        <tr>
          <th>User</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let control of customers.controls; let i=index">
          <td>{{ control.get('email').value }}</td>
          <td>
            <button (click)="customers.removeAt(i)" type="button" class="remove-button">
              <i class="material-icons">remove_circle_outline</i>
            </button>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <button type="button" (click)="selectUser()" class="add-button">
              Add User
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <nus-user-selection-modal [selectedUsers]="entity?.customers"></nus-user-selection-modal>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>

    </form>
  `,
  styles: [
    'label { display: block; }',
    '.hidden { display: none; }',
  ]
})
export class CustomerGroupDetailComponent extends AbstractDetailComponent<ICustomerGroup> implements OnInit, AfterViewInit {

  @ViewChild(UserSelectionModalComponent) userSelectionModal: UserSelectionModalComponent;

  typeChoices: drf.IChoice[] = [];

  groupsWithAmount = [CustomerGroupType.lifetimeValue, ];
  groupsWithTime = [CustomerGroupType.newCustomers, CustomerGroupType.existingCustomers, CustomerGroupType.churned, ];

  entity?: ICustomerGroup;
  manual: string =  CustomerGroupType.manual;

  constructor(service: CustomerGroupService,
              route: ActivatedRoute,
              router: Router,
              private fb: FormBuilder,
              toast: ToastService) {
    super(route, router, toast, service);
  }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get href(): FormControl { return this.form.get('href') as FormControl; }
  get type(): FormControl { return this.form.get('type') as FormControl; }
  get amountThreshold(): FormControl { return this.form.get('amountThreshold') as FormControl; }
  get timeThreshold(): FormControl { return this.form.get('timeThreshold') as FormControl; }
  get customers(): FormArray { return this.form.get('customers') as FormArray; }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((data: {typeChoices: drf.IChoice[]}) => {
      this.typeChoices = data.typeChoices;
    });
  }

  initializeForm(entity?: ICustomerGroup) {
    this.entity = entity;
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, ]],
      href: [entity?.href, []],
      type: [entity?.type, [Validators.required]],
      amountThreshold: [entity?.amountThreshold, [Validators.required, Validators.min(0)]],
      timeThreshold: [parse(entity?.timeThreshold ?? 'P0D').days, [Validators.required, Validators.min(0)]],
      customers: this.fb.array([]),
    });

    // wire up event handlers
    this.type.valueChanges.subscribe(
      (value) => { this.onTypeChanged(value); }
    );
    // trigger manually so initial state of the form is accurate.
    this.onTypeChanged(this.type.value);

    this.entity?.customers.forEach((customer) => {
      this.addUser(customer);
    });
  }

  get currentType(): CustomerGroupType {
    return this.form?.get('type').value as CustomerGroupType;
  }

  get timeThresholdLabel(): string {
    switch (this.currentType) {
      case CustomerGroupType.newCustomers:
        return 'Registered days ago';
      case CustomerGroupType.existingCustomers:
        return 'Registered before days ago';
      case CustomerGroupType.churned:
        return 'Last purchased ago';
      default:
        this.timeThreshold.disable();
        return '?!';
    }
  }

  get amountThresholdLabel(): string {
    switch (this.currentType) {
      case CustomerGroupType.lifetimeValue:
        return 'Minimum LTV';
      default:
        this.amountThreshold.disable();
        return '?!';
    }
  }

  onTypeChanged(newType) {
    if (this.groupsWithAmount.includes(newType)) {
      this.form.get('amountThreshold').enable();
    } else {
      this.form.get('amountThreshold').disable();
    }

    const timeThreshold = this.form.get('timeThreshold');
    if (this.groupsWithTime.includes(newType)) {
      timeThreshold.enable();
    } else {
      timeThreshold.disable();
    }
  }

  selectUser() {
    this.userSelectionModal.open();
  }

  addUser(customer: IEmailHrefUserEntity) {
    this.customers.push(
      this.fb.group({
        href: [customer.href],
        email: [customer.email]
      }));
  }

  ngAfterViewInit() {
    this.userSelectionModal.onClose.subscribe(() => this.onUserSelectionModalClosed());
  }

  onUserSelectionModalClosed() {
    if (this.userSelectionModal.result === DialogResult.OK) {

      const selectedUser = this.userSelectionModal.user.value as ICustomer;

      const f = this.fb.group({
        href: [selectedUser.href, []],
        email: [selectedUser.email, []]
      });
      this.customers.push(f);
    }
  }

  getFormValue(): any {
    let formValue = super.getFormValue();
    formValue = {
      ...formValue,
      timeThreshold: `P${formValue.timeThreshold || '0'}D`
    };
    return formValue;
  }
}
