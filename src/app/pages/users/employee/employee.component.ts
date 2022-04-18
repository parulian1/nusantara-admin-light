import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl, ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IAccessGroup, IEmployee, IHttpFailure, IWarehouse } from '@nusantara/models';
import { EmployeeService, SiteConfigService, WarehouseService, DefaultPinConfigService } from '@nusantara/services';
import {
  AbstractDetailComponent, DialogResult,
  ErrorResult, IResultResponse, Logger, ToastLevelEnum,
  ToastService,
} from '@nusantara/core';

import { AuthService, RequireIsEnterpriseGuard } from '@nusantara/auth';
import { EmployeeWarehouseHostComponent } from './warehouse';
import { EmployeeAccessGroupHostComponent } from './access-group';
import { IJwtClaims } from '@nusantara/auth/models';
import { ConfirmModalResetPinComponent } from '@nusantara/shared/confirm-modal-reset-pin.component';
import { getSlugFromHref } from '@nusantara/shared/helpers';

const logger = new Logger('EmployeeComponent');

@Component({
  selector: 'nus-employee-detail',
  template: `
    <nus-detail-title [originalName]="originalEntityName" typeName="Employee">
    </nus-detail-title>

    <form [formGroup]="form" (ngSubmit)="save()" class="fluid">
      <div id="personal-info" class="wrapper">
        <h1 class="heading-1" i18n>Personal Information</h1>
        <label class="hidden">
          <span i18n>Name</span>
          <input type="text" [formControl]="name"/>
          <nus-field-errors [control]="name"></nus-field-errors>
        </label>
        <label>
          <span i18n>Employee ID</span>
          <input type="text" [formControl]="identityNumber"/>
          <nus-field-errors [control]="identityNumber"></nus-field-errors>
        </label>

        <label>
          <span i18n>First Name</span>
          <input type="text" [formControl]="firstName"/>
          <nus-field-errors [control]="firstName"></nus-field-errors>
        </label>

        <label>
          <span i18n>Last Name</span>
          <input type="text" [formControl]="lastName"/>
          <nus-field-errors [control]="lastName"></nus-field-errors>
        </label>

        <label>
          <span i18n>Email Address</span>
          <div *ngIf="!entity; else emailReadOnly">
            <input type="email" [formControl]="email"/>
            <nus-field-errors [control]="email"></nus-field-errors>
          </div>
          <ng-template #emailReadOnly>
            <div style="font-size: 0.85rem;">{{ email.value }}</div>
          </ng-template>
        </label>

        <label>
          <span i18n>Phone Number</span>
          <input type="tel" [formControl]="phoneNumber"/>
          <nus-field-errors [control]="phoneNumber"></nus-field-errors>
        </label>

        <label class="toggle">
          <input type="checkbox"
                 class="toggle"
                 [formControl]="isActive"
                 name="is-active"/>
          <span i18n>Is Active</span>
          <nus-field-errors [control]="isActive"></nus-field-errors>
        </label>
      </div>

      <div id="pos-info" class="wrapper"  *ngIf="enterpriseLicense()">
        <h1 class="heading-1" i18n>Point Of Sales (Optional)</h1>
        <label class="toggle">
          <input type="checkbox"
                 class="toggle"
                 [formControl]="canUsePos"
                 name="is-active"
                 (ngModelChange)="onCanUsePosChange($event)"/>
          <span i18n>Use Pos</span>
          <nus-field-errors [control]="canUsePos"></nus-field-errors>
        </label>

        <p *ngIf="isCreateForm && hasDefaultPinConfig" i18n>Login to BHISMA POS using Default PIN</p>
        <p *ngIf="isCreateForm && !hasDefaultPinConfig" i18n>Default PIN has not been filled, please fill in <a
          routerLink="/config/pos-integration/default-pin-config" style="color:#EA730B;" >here</a></p>

        <button *ngIf="!isCreateForm && isUsePos"
                (click)="confirmModalResetPinComponent.open()"
                type="button" class="new-add-button wide control secondary"
                [class.button-email--disabled]="isLoadingResetPIN"
                [disabled]="isLoadingResetPIN" i18n
        >
          Reset to Default PIN
        </button>

        <div *ngIf="isUsePos" style="margin-top: 16px;">
          <nus-employee-warehouse-host
            [entity]="entity"
            [choices]="warehouseChoices"
            [form]="warehouses"
          >
          </nus-employee-warehouse-host>
        </div>
      </div>

      <div style="margin-top: 1rem;" *ngIf="enterpriseGuard.canActivate(null, null)">
        <table>
          <thead>
          <tr>
            <th i18n>Access Group</th>
            <th i18n>Delete</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let groupEntity of entity?.groups?.entities">
            <td>{{ groupEntity.name }}</td>
            <td></td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-3" *ngIf="entity">
        <h4 class="is-marginless" i18n>Send Reset Password Email?</h4>
        <div class="mt-1">
          <button
            type="button"
            (click)="sendResetPassword()"
            class="button-email"
            [class.button-reset-pin--disabled]="isLoadingResetPassword"
            [disabled]="isLoadingResetPassword" i18n
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

    <!-- Modals -->
    <nus-confirm-modal-reset-pin></nus-confirm-modal-reset-pin>
  `,
  styles: [`
    .wrapper { padding: 16px 24px; border: solid 1px var(--grey); border-radius: 4px; margin-bottom: 24px; }
    .heading-1 { margin-bottom: 16px; }
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
    .button-email--disabled, .button-reset-pin--disabled {
      background-color: #7b869b;
      color: #dedede;
      cursor: not-allowed;
    }
  `],
})
export class EmployeeComponent
  extends AbstractDetailComponent<IEmployee>
  implements OnInit, AfterViewInit {
  @ViewChild(EmployeeWarehouseHostComponent)
  EmployeeWarehouseHostComponent: EmployeeWarehouseHostComponent;
  @ViewChild(EmployeeAccessGroupHostComponent)
  EmployeeAccessGroupHostComponent: EmployeeAccessGroupHostComponent;
  @ViewChild(ConfirmModalResetPinComponent) confirmModalResetPinComponent: ConfirmModalResetPinComponent;

  warehouseChoices: IWarehouse[] = [];
  accessGroupChoices: IAccessGroup[] = [];

  entity?: IEmployee;
  isUsePos = false;

  isCreateForm = true;
  currentActive = 'personal-info';
  hasDefaultPinConfig: boolean;

  /**
   * send email
   */
  isLoadingResetPassword = false;
  currentUser: IJwtClaims;

  isLoadingResetPIN = false;

  constructor(
    service: EmployeeService,
    protected authService: AuthService,
    route: ActivatedRoute,
    router: Router,
    toast: ToastService,
    private warehouseService: WarehouseService,
    private fb: FormBuilder,
    public enterpriseGuard: RequireIsEnterpriseGuard,
    private configService: SiteConfigService,
    protected defaultPinService: DefaultPinConfigService,
  ) {
    super(route, router, toast, service);
  }

  setWarehouseValidator() {
    const warehouses = this.form.get('warehouses');

    // Update warehouse form. set to required if user can use pos
    this.form.get('canUsePos').valueChanges.subscribe(canUsePos => {
      if (canUsePos === true) {
        warehouses.setValidators([Validators.required]);
      } else {
        warehouses.setValidators([]);
      }
      warehouses.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { warehouses: IWarehouse[], accessGroups: IAccessGroup[] }) => {
      this.warehouseChoices = data.warehouses;
      this.accessGroupChoices = data.accessGroups;
      logger.debug('OnInit data Subscribe', data);
    });
    super.ngOnInit();
    logger.debug('OnInit this entity', this.entity);
    this.handleCurrentUser();
    this.setWarehouseValidator();
    this.checkDefaultPinConfig();
  }

  ngAfterViewInit() {
    this.confirmModalResetPinComponent.onClose.subscribe(() => this.onConfirmModalClosed());
  }

  initializeForm(entity?: IEmployee) {
    this.originalEntityName = entity ? 'Edit Employee' : 'Add Employee';
    this.isCreateForm = !entity;

    this.form = this.fb.group({
      name: [entity?.firstName, []],
      identityNumber: [entity?.identityNumber, [Validators.required]],
      firstName: [entity?.firstName, [Validators.required]],
      lastName: [entity?.lastName, [Validators.required]],
      email: [entity?.email, [Validators.required]],
      href: [entity?.href, []],
      phoneNumber: [entity?.phoneNumber,
        [
          Validators.required, Validators.pattern('^[0-9]*$'),
          Validators.minLength(9), Validators.maxLength(14)
        ]
      ],
      isActive: [entity?.isActive ?? true, [Validators.required]],
      warehouses: this.fb.array([], []),
      accessGroups: this.fb.array([]),
      title: [entity?.firstName, []], // used as formality when delete data
      canUsePos: [entity?.canUsePos ?? false, []],
    });

    this.entity = entity;

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

  getFormValue(): any {
    const formValue = super.getFormValue();
    delete formValue?.title;

    if (!this.entity) {
      return {...formValue, email: this.email.value.toLowerCase()};
    } else {
      delete formValue?.email;
      return formValue;
    }
  }

  save(): void {
    this.name.setValue(this.firstName.value); // Handle name in success massage
    this.email.setValue(this.email.value.toLowerCase());
    this.form.disable();
    this.service
      .save(this.getFormValue())
      .pipe(
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            return of(new ErrorResult<IHttpFailure>(err.error, err.status));
          } else {
            return of(
              new ErrorResult<IHttpFailure>(
                {detail: 'Network error.. probably?'},
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
          this.form.enable();
        }
      });

  }

  delete(): void {
    const isDelete = confirm('Do you really want delete this data?');
    if (isDelete) {
      super.delete();
    }
  }

  protected onSaveSuccess(result: IResultResponse<IEmployee>) {
    if (this.isUsePos) {
      this.EmployeeWarehouseHostComponent.saveAll(result.entity.href).subscribe(() => {});
    } else {
      this.warehouseService.deleteAllEmployeeWarehouse(getSlugFromHref(result.entity.href)).subscribe(() => {});
    }
    // if (this.enterpriseGuard.canActivate(null, null)) {
    //   this.EmployeeAccessGroupHostComponent.saveAll(result.entity.href).subscribe(() => {});
    // }

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

  checkDefaultPinConfig(): void {
    this.defaultPinService.fetch().subscribe((data) => {
      this.hasDefaultPinConfig = !!data.pin;
      if (!this.hasDefaultPinConfig){
        this.form.get('canUsePos').disable();
      }
    }, (error) => {
      this.hasDefaultPinConfig = false;
      this.onSaveError(error);
    });
  }

  onCanUsePosChange($event: boolean) {
    this.isUsePos = $event;
  }

  enterpriseLicense() {
    return this.configService.isEnterpriseLicense();
  }

  onConfirmModalClosed() {
    if (this.confirmModalResetPinComponent.result === DialogResult.OK) {
      this.isLoadingResetPIN = true;
      this.authService.resetPin(this.entity.href).subscribe(() => {
        this.isLoadingResetPIN = false;
        this.toast?.addMessage(`Employee's PIN has been reset to default successfully.`,
          'Reset PIN', ToastLevelEnum.success);
      }, () => {
        this.isLoadingResetPIN = false;
        this.toast?.addMessage(`Reset PIN failed. Please try again.`,
          'Reset PIN', ToastLevelEnum.error);
      });
    }
  }
}
