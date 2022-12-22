import {Component, OnInit, Input, forwardRef} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidatorFn,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastLevelEnum, ToastService } from '@nusantara/core';
import {MarketplaceClientService} from '@nusantara/services';
import { marketplace } from '@nusantara/models';
import { MarketplaceClientEnum } from '../markeplace-client-enum';

@Component({
  selector: 'nus-jdid-client-form',
  template: `
    <form [formGroup]="form" class="fluid">
      <label>
        <span i18n>Shop Name
          <nus-tooltip [text]="shopNameInfo"></nus-tooltip>
        </span>
        <input type="text" formControlName="shopName" placeholder="Input Shop Name"/>
        <nus-field-errors-marketplace
          [control]="shopName"
          variable="Shop Name"
        ></nus-field-errors-marketplace>
      </label>
      <label>
        <span i18n>Shop ID
          <nus-tooltip [text]="shopIdInfo"></nus-tooltip>
        </span>
        <input type="text" formControlName="shopId" placeholder="Input Shop ID"/>
        <nus-field-errors-marketplace
          [control]="shopId"
          variable="Shop ID"
        ></nus-field-errors-marketplace>
        <div *ngIf="form.get('shopId').errors?.notNumeric" class="error-detail" i18n>
          Shop ID must be integer
        </div>
      </label>
      <label>
        <span i18n>Warehouse</span>
        <select formControlName="warehouseId">
          <option [value]="null" i18n>Select Warehouse</option>
          <option *ngFor="let opt of warehouses" [ngValue]="opt.warehouseId">
            {{ opt.name }}
          </option>
        </select>
        <nus-field-errors-marketplace
          [control]="warehouseId"
          variable="warehouse ID"
        ></nus-field-errors-marketplace>
      </label>

      <div class="action-buttons">
        <button *ngIf="isEdit"
          type="submit"
          [disabled]="!form.valid"
          class="control"
          (click)="onUpdate()" i18n>
          Connect
        </button>
        <button *ngIf="!isEdit"
          type="submit"
          [disabled]="!form.valid"
          class="control"
          (click)="onConnect()" i18n>
          Connect
        </button>
        <button type="button" (click)="onCancel()" class="control secondary ghost" i18n>
          Cancel
        </button>
      </div>
    </form>
  `,
  styles: [
    'button:not(:first-of-type) { margin-left: 5px; }',
    '.action-buttons { margin-top: 20px; }'
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JdidFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => JdidFormComponent),
      multi: true,
    },
  ],
})
export class JdidFormComponent implements OnInit {
  @Input() shopSlug?: string;
  @Input() isEdit: boolean;
  form: FormGroup;
  warehouses: marketplace.IMarketplaceWarehouse[] = [];
  shopIdInfo = "Registered Shop id in JD.ID > go to Shop Profile and there is Shop ID" ;
  shopNameInfo = "Registered Shop Name in JD.ID";

  constructor(
    private service: MarketplaceClientService,
    private fb: FormBuilder,
    private toast: ToastService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.service
      .getWarehouse(MarketplaceClientEnum.jdid)
      .subscribe((data: marketplace.IMarketplaceWarehouse[]) => {
        this.warehouses = data;
      });
    if (this.shopSlug) {
      this.fillFormDetail(this.shopSlug);
    }
  }

  fillFormDetail(shopSlug: string) {
    this.service
      .getConnection(shopSlug)
      .subscribe((data: marketplace.IJdidauthResponse) => {
        if (data != null) {
          this.form.patchValue({
            shopName: data.shopName,
            shopId: data.shopId,
            warehouseId: data.warehouseId,
          });
        }
      });
  }


  get shopName(): FormControl {
    return this.form.get('shopName') as FormControl;
  }
  get shopId(): FormControl {
    return this.form.get('shopId') as FormControl;
  }

  get warehouseId(): FormControl {
    return this.form.get('warehouseId') as FormControl;
  }

  initializeForm(entity?: marketplace.IJdidCredential) {
    this.form = this.fb.group({
      shopName: [entity?.shopName ?? '', [Validators.required,]],
      shopId: [entity?.shopId ?? '', [Validators.required, this.isInteger()]],
      warehouseId: [entity?.warehouse, [Validators.required]],
    });
  }

  check_if_is_integer(value){
    if(value==""){
      return true
    } else {
      return ((parseFloat(value) == parseInt(value)) && !isNaN(value) && (value.toString().length <= 10));
    }
  }


  isInteger(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>  {
      if(control.value!==null){
          return this.check_if_is_integer(control.value) ? null : {
              notNumeric: true
          }
      }
    }
  }

  getFormValue(): any {
    const formValue = {
      marketplace: MarketplaceClientEnum.jdid,
      shopName: this.form.value.shopName,
      warehouse_id: this.form.value.warehouseId,
      shopId: this.form.value.shopId,
    };
    return formValue;
  }

  onConnect() {
    this.service.connect(this.getFormValue()).subscribe(
      (resp: marketplace.IJdidauthResponse) => {
        this.showSignInWindow(resp);
      },
      (err) => {
        this.showErrorToast(err);
      }
    );
  }

  onUpdate() {
    this.service.updateConnection(this.getFormValue(), this.shopSlug).subscribe(
      (resp: marketplace.IJdidauthResponse) => {
        this.showSignInWindow(resp);
      },
      (err: HttpErrorResponse) => {
        this.showErrorToast(err);
      }
    );
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  showErrorToast(resp: HttpErrorResponse) {
    this.toast?.addMessage(resp.error.message, 'error', ToastLevelEnum.error);
  }

  showSignInWindow(resp: marketplace.IJdidauthResponse) {
    if (!resp.isConnected) {
      this.toast?.addMessage(
        `Confirm JD.ID Authorization Page to grant access. Click refresh when you're done.`,
        'Log in to your marketplace',
        ToastLevelEnum.info
      );
      window.open(resp.authenticationUrl, '_blank');
    }
    this.onCancel();
  }
}
