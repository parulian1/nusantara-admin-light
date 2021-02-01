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
import { catchError, map, mergeMap } from 'rxjs/operators';

import { IEmployee, IHttpFailure, IWarehouse } from '@nusantara/models';
import { EmployeeService, WarehouseService } from '@nusantara/services';
import {
  AbstractDetailComponent,
  ErrorResult, SuccessResult, ToastLevelEnum,
  ToastService,
} from '@nusantara/core';

import { AuthService } from '@nusantara/auth';
import { EmployeeWarehouseHostComponent } from './warehouse';
import { IJwtClaims } from '@nusantara/auth/models';


@Component({
  selector: 'nus-employee-detail',
  template: `
    <nus-detail-title [originalName]="originalEntityName" typeName="Employee">
    </nus-detail-title>

    <form [formGroup]="form" (ngSubmit)="save()">
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
        <input type="email" [formControl]="email"/>
      </label>

      <label>
        <span>Phone Number</span>
        <input type="tel" [formControl]="phoneNumber"/>
      </label>

      <label>
        <span>Is Active</span>
        <input type="checkbox" [formControl]="isActive"/>
        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>

      <nus-employee-warehouse-host
        [entity]="entity"
        [choices]="warehouseChoices"
        [form]="warehouses"
      >
      </nus-employee-warehouse-host>

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

  warehouseChoices: IWarehouse[] = [];

  entity?: IEmployee;

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
    private fb: FormBuilder
  ) {
    super(route, router, toast, service);
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { warehouses: IWarehouse[] }) => {
      this.warehouseChoices = data.warehouses;
    });
    super.ngOnInit();
    this.handleCurrentUser();
  }

  initializeForm(entity?: IEmployee) {
    this.form = this.fb.group({
      firstName: [entity?.firstName, [Validators.required]],
      lastName: [entity?.lastName, [Validators.required]],
      email: [entity?.email, [Validators.required]],
      href: [entity?.href, []],
      phoneNumber: [entity?.phoneNumber, []],
      isActive: [entity?.isActive ?? true, [Validators.required]],
      warehouses: this.fb.array([]),
    });

    this.entity = entity;
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

  save(): void {
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
      .pipe(
        mergeMap((response: SuccessResult<IEmployee>) => {
          return this.EmployeeWarehouseHostComponent.saveAll(response.entity.href).pipe(
            map(() => response)
          );
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
}
