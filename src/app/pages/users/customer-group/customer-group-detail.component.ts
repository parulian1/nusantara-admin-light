import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { parse } from 'iso8601-duration';

import { AbstractDetailComponent, ErrorResult, IResultResponse, ToastLevelEnum, ToastService } from '@nusantara/core';
import { ICustomerGroup, CustomerGroupType, drf } from '@nusantara/models';
import { CustomerGroupService } from '@nusantara/services';

import { IError } from '@nusantara/models/base/error';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

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
        <nus-field-errors [control]="form.get('name')"></nus-field-errors>
      </label>

      <label>
        <span>Type</span>
        <select [formControl]="type">
          <option *ngFor="let opt of typeChoices" [ngValue]="opt.value">
            {{opt.displayName}}
          </option>
        </select>
        <nus-field-errors [control]="type"></nus-field-errors>
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
        <button type="button" (click)="navigateToParent(true)">Cancel</button>
        <button type="button" (click)="delete()" *ngIf="!isNew">Delete</button>
      </div>
    </form>
  `,
  styles: [
    'label { display: block; }',
    '.hidden { display: none; }',
  ]
})
export class CustomerGroupDetailComponent extends AbstractDetailComponent<ICustomerGroup> implements OnInit {
  typeChoices: drf.IChoice[] = [];

  groupsWithAmount = [CustomerGroupType.lifetimeValue, ];
  groupsWithTime = [CustomerGroupType.newCustomers, CustomerGroupType.existingCustomers, CustomerGroupType.churned, ];

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

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((data: {typeChoices: drf.IChoice[]}) => {
      this.typeChoices = data.typeChoices;
    });
  }

  initializeForm(entity?: ICustomerGroup) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, ]],
      href: [entity?.href, []],
      type: [entity?.type, [Validators.required]],
      amountThreshold: [entity?.amountThreshold, [Validators.required, Validators.min(0)]],
      timeThreshold: [parse(entity?.timeThreshold ?? 'P0D').days, [Validators.required, Validators.min(0)]],
    });

    // wire up event handlers
    this.type.valueChanges.subscribe(
      (value) => { this.onTypeChanged(value); }
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
    // @ts-ignore
    if (formValue.timeThreshold >= 0) {
      formValue.timeThreshold = `P${formValue.timeThreshold}D`;
    }

    this.service.save(formValue).pipe(catchError((err) => {
      if (err instanceof HttpErrorResponse) {
        return of(new ErrorResult<IError>(err.error, err.status));
      } else {
        return of(new ErrorResult<IError>({message: 'Network error.. probably?'}, err.status));
      }
    })).subscribe(
      result => {
        if (result instanceof ErrorResult) {
          this.onSaveFail(result.errorDetails);
        } else {
          this.onSaveSuccess(result);
          this.navigateToParent(false);
        }
      }
    );
  }

  delete() {
    this.service.delete(this.form.value).subscribe(
      resp => {
        if (resp.success) {
          this.onDeleteSuccess();
        } else {
          this.onDeleteError(resp);
        }
      },
      (err) => this.onDeleteError(err)
    );
  }

  protected onSaveSuccess(result: IResultResponse<ICustomerGroup>) {
    this.toast?.addMessage(`"${this.form.get('name')?.value ?? 'data'}" was saved successfully.`, 'Saved', ToastLevelEnum.success);
    this.navigateToParent(false);
  }

  private onSaveFail(errorDetails: IError) {
    errorDetails.details.forEach((error) => {
      this.form.controls[error.field].setErrors({
        apiError: error.message,
      });
    });
    if (this.nonFieldErrors.length) {
      this.nonFieldErrors = [];
    }
    this.nonFieldErrors.push(errorDetails.message);
  }

  protected onDeleteSuccess() {
    this.toast?.addMessage(
      `"${this.form.get('name')?.value || this.form.get('title').value}" was deleted successfully.`,
      'Deleted',
      ToastLevelEnum.success
    );
    this.navigateToParent(false);
  }
}
