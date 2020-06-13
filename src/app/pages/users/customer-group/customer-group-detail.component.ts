import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { parse } from 'iso8601-duration';

import { AbstractDetailComponent, IChoiceFieldChoice } from '@nusantara/core';
import { ICustomerGroup, CustomerGroupType } from '@nusantara/models';
import { CustomerGroupService } from '@nusantara/services';

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

    <form [formGroup]="form" (ngSubmit)="submit()">
      <label>
        <span>Name</span>
        <input type="text" formControlName="name">
      </label>

      <label>
        <span>Type</span>
        <select formControlName="type">
          <option *ngFor="let opt of typeChoices" [ngValue]="opt.value">
            {{opt.displayName}}
          </option>
        </select>
      </label>

      <label [ngClass]="{'hidden': form.get('timeThreshold').disabled}">
        <span>{{ timeThresholdLabel }}</span>
        <input type="number" formControlName="timeThreshold">
      </label>

      <label [ngClass]="{'hidden': form.get('amountThreshold').disabled}">
        <span>{{ amountThresholdLabel }}</span>
        <input type="number" formControlName="amountThreshold">
      </label>

      <div class="actions-container">
        <button type="submit" [disabled]="!form.valid">Save</button>
        <button (click)="navigateToParent(true)">Cancel</button>
        <button (click)="delete()" *ngIf="!isNew">Delete</button>
      </div>
    </form>
  `,
  styles: [
    'label { display: block; }',
    '.hidden { display: none; }',
  ]
})
export class CustomerGroupDetailComponent extends AbstractDetailComponent<ICustomerGroup> implements OnInit {

  typeChoices: IChoiceFieldChoice[] = [];

  groupsWithAmount = [CustomerGroupType.lifetimeValue, ];
  groupsWithTime = [CustomerGroupType.newCustomers, CustomerGroupType.existingCustomers, CustomerGroupType.churned, ];

  constructor(public service: CustomerGroupService,
              public route: ActivatedRoute,
              public router: Router,
              private fb: FormBuilder) {
    super();
  }

  get type(): FormControl { return this.form.get('type') as FormControl; }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((data: {typeChoices: IChoiceFieldChoice[]}) => {
      this.typeChoices = data.typeChoices;
    });
  }

  initializeForm(entity?: ICustomerGroup) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, ]],
      href: [entity?.href, []],
      type: [entity?.type, [Validators.required]],
      amountThreshold: [entity?.amountThreshold, [Validators.required]],
      timeThreshold: [parse(entity?.timeThreshold ?? 'P0D').days, [Validators.required]],
    });

    // wire up event handlers
    this.type.valueChanges.subscribe(
      (value) => this.onTypeChanged(value)
    );
    // trigger manually so initial state of the form is accurate.
    this.onTypeChanged(this.type.value);
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
        return '?!';
    }
  }

  get amountThresholdLabel(): string {
    switch (this.currentType) {
      case CustomerGroupType.lifetimeValue:
        return 'Minimum LTV';
      default:
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

  submit() {

    // convert this to the proper type.  find a better solution here.
    const formValue = this.form.value as ICustomerGroup;
    if (formValue.timeThreshold) {
      formValue.timeThreshold = `P${formValue.timeThreshold}D`;
    }

    this.service.save(formValue).subscribe(
      resp => {
        if (resp.success) {
          this.navigateToParent(false);
        } else {
          alert('There was a problem saving');
        }
      }
    );
  }

  delete() {
    this.service.delete(this.form.get('href').value).subscribe(
      resp => {
        if (resp.success) {
          this.navigateToParent(false);
        } else {
          alert('Error deleting');
        }
      }
    );
  }
}
