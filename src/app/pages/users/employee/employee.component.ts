import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IAccessGroup, IEmployee, IHttpFailure, IWarehouse } from '@nusantara/models';
import { EmployeeService, WarehouseService } from '@nusantara/services';
import {
  AbstractDetailComponent,
  ErrorResult, IResultResponse, ToastLevelEnum,
  ToastService,
} from '@nusantara/core';

import { AuthService, RequireIsEnterpriseGuard } from '@nusantara/auth';
import { EmployeeWarehouseHostComponent } from './warehouse';
import { EmployeeAccessGroupHostComponent } from './access-group';
import { IJwtClaims } from '@nusantara/auth/models';


@Component({
  selector: 'nus-employee-detail',
  template: `
    <nus-detail-title [originalName]="originalEntityName" typeName="Employee">
    </nus-detail-title>

    <form [formGroup]="form" (ngSubmit)="save()">
      <label class="hidden">
        <span>Name</span>
        <input type="text" [formControl]="name"/>
      </label>
      <label>
        <span>Employee ID</span>
        <input type="text" [formControl]="identityNumber"/>
      </label>

      <label>
        <span>First Name</span>
        <input type="text" [formControl]="firstName"/>
      </label>

      <label>
        <span>Last Name</span>
        <input type="text" [formControl]="lastName"/>
      </label>

      <label>
        <span>Email Address</span>
        <div *ngIf="!entity; else emailReadOnly">
          <input type="email" [formControl]="email"/>
        </div>
        <ng-template #emailReadOnly>
          <div style="font-size: 0.85rem;">{{ email.value }}</div>
        </ng-template>
      </label>

      <label>
        <span>Phone Number</span>
        <input type="tel" [formControl]="phoneNumber"/>
      </label>

      <label class="checkbox">
        <span>Is Active</span>
        <input type="checkbox" [formControl]="isActive"/>
        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>

      <label class="checkbox">
        <span>Use POS</span>
        <input type="checkbox" [formControl]="canUsePos" (ngModelChange)="onCanUsePosChange($event)"/>
        <nus-field-errors [control]="canUsePos"></nus-field-errors>
      </label>

      <label *ngIf="isUsePos">
        <span>PIN</span>
        <input type="password" maxlength="4" autocomplete="new-password" [formControl]="pin"/>
      </label>

      <nus-employee-warehouse-host
        [entity]="entity"
        [choices]="warehouseChoices"
        [form]="warehouses"
      >
      </nus-employee-warehouse-host>

      <div style="margin-top: 1rem;" *ngIf="enterpriseGuard.canActivate(null, null)">
        <nus-employee-access-group-host
          [entity]="entity"
          [choices]="accessGroupChoices"
          [form]="accessGroups">
        </nus-employee-access-group-host>
      </div>

      <div class="mt-3" *ngIf="entity">
        <h4 class="is-marginless">Send Reset Password Email?</h4>
        <div class="mt-1">
          <button
            type="button"
            (click)="sendResetPassword()"
            class="button-email"
            [class.button-email--disabled]="isLoadingResetPassword"
            [disabled]="isLoadingResetPassword"
          >
            Send Reset Password
          </button>
        </div>
      </div>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()"
      >
      </nus-detail-actions>
    </form>
  `,
  styles: [`
    .button-email {
      border-radius: 2px;
      border: none;
      background-color: #4ab4c6;
      font-weight: lighter;
      font-size: 1em;
      text-decoration: none;
      height: 31px;
      line-height: 31px;
      padding: 0 15px;
      box-sizing: border-box;
      transition: all 0.2s;
      cursor: pointer;
      color: white;
    }

    .button-email--disabled {
      background-color: #7b869b;
      color: #dedede;
      cursor: not-allowed;
    }
  `],
})
export class EmployeeComponent
  extends AbstractDetailComponent<IEmployee>
  implements OnInit {
  @ViewChild(EmployeeWarehouseHostComponent)
  EmployeeWarehouseHostComponent: EmployeeWarehouseHostComponent;
  @ViewChild(EmployeeAccessGroupHostComponent)
  EmployeeAccessGroupHostComponent: EmployeeAccessGroupHostComponent;

  warehouseChoices: IWarehouse[] = [];
  accessGroupChoices: IAccessGroup[] = [];

  entity?: IEmployee;
  isUsePos = false;

  /**
   * send email
   */
  isLoadingResetPassword = false;
  currentUser: IJwtClaims;

  constructor(
    service: EmployeeService,
    protected authService: AuthService,
    route: ActivatedRoute,
    router: Router,
    toast: ToastService,
    private warehouseService: WarehouseService,
    private fb: FormBuilder,
    public enterpriseGuard: RequireIsEnterpriseGuard
  ) {
    super(route, router, toast, service);
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { warehouses: IWarehouse[], accessGroups: IAccessGroup[] }) => {
      this.warehouseChoices = data.warehouses;
      this.accessGroupChoices = data.accessGroups;
    });

    super.ngOnInit();
    this.handleCurrentUser();
  }

  initializeForm(entity?: IEmployee) {
    this.form = this.fb.group({
      name: [entity?.firstName, []],
      identityNumber: [entity?.identityNumber, [Validators.required]],
      firstName: [entity?.firstName, [Validators.required]],
      lastName: [entity?.lastName, [Validators.required]],
      email: [entity?.email, [Validators.required]],
      href: [entity?.href, []],
      phoneNumber: [entity?.phoneNumber, []],
      isActive: [entity?.isActive ?? true, [Validators.required]],
      warehouses: this.fb.array([], [Validators.required]),
      accessGroups: this.fb.array([]),
      title: [entity?.firstName, []], // used as formality when delete data
      canUsePos: [entity?.canUsePos ?? false, []],
      pin: ['', [Validators.maxLength(4)]],
    });

    this.entity = entity;

    // need to mark as touched to make custom styling works
    this.form.controls.isActive.markAsTouched();
    this.form.controls.canUsePos.markAsTouched();

    this.isUsePos = this.canUsePos.value;
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }
  get identityNumber(): FormControl {
    return this.form.get('identityNumber') as FormControl;
  }
  get firstName(): FormControl {
    return this.form.get('firstName') as FormControl;
  }
  get lastName(): FormControl {
    return this.form.get('lastName') as FormControl;
  }
  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }
  get phoneNumber(): FormControl {
    return this.form.get('phoneNumber') as FormControl;
  }
  get isActive(): FormControl {
    return this.form.get('isActive') as FormControl;
  }
  get warehouses(): FormArray {
    return this.form.get('warehouses') as FormArray;
  }
  get accessGroups(): FormArray {
    return this.form.get('accessGroups') as FormArray;
  }
  get canUsePos(): FormControl {
    return this.form.get('canUsePos') as FormControl;
  }
  get pin(): FormControl {
    return this.form.get('pin') as FormControl;
  }

  getFormValue(): any {
    const formValue = super.getFormValue();
    delete formValue?.title;

    if (!this.entity) {
      return { ...formValue,  email: this.email.value.toLowerCase() };
    } else {
      delete formValue?.email;
      return formValue;
    }
  }

  save(): void {
    this.name.setValue(this.firstName.value); // Handle name in success massage
    this.email.setValue(this.email.value.toLowerCase());
    this.service
      .save(this.getFormValue())
      .pipe(
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            return of(new ErrorResult<IHttpFailure>(err.error, err.status));
          } else {
            return of(
              new ErrorResult<IHttpFailure>(
                { detail: 'Network error.. probably?' },
                err.status
              )
            );
          }
        })
      )
      .subscribe((resp) => {
        if (resp.success) {
          this.onSaveSuccess(resp);
        } else {
          this.onSaveError(resp);
        }
      });
    this.form.disable();
  }

  delete(): void {
    const isDelete = confirm('Do you really want delete this data?');
    if (isDelete) {
      super.delete();
    }
  }

  protected onSaveSuccess(result: IResultResponse<IEmployee>) {
    this.EmployeeWarehouseHostComponent.saveAll(result.entity.href).subscribe(() => {});
    if (this.enterpriseGuard.canActivate(null, null)) {
      this.EmployeeAccessGroupHostComponent.saveAll(result.entity.href).subscribe(() => {});
    }

    super.onSaveSuccess(result);
  }

  handleCurrentUser(): void {
    this.currentUser = this.authService.tokenPayload as IJwtClaims;
  }

  sendResetPassword(): void {
    this.isLoadingResetPassword = true;
    this.authService.forgotPassword(this.email.value, this.currentUser.site).subscribe(() => {
      this.isLoadingResetPassword = false;
      this.toast?.addMessage(`send reset password successfully.`, 'Send Email', ToastLevelEnum.success);
    }, (error) => {
      this.onSaveError(error);
    });
  }

  onCanUsePosChange($event: boolean) {
    this.isUsePos = $event;
  }
}
