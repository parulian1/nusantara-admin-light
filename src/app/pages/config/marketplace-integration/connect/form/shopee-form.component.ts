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
  selector: 'nus-shopee-client-form',
  template: `
    <form [formGroup]="form" class="fluid">
      <label>
        <span i18n>Shop ID
          <nus-tooltip [text]="shopIdInfo"></nus-tooltip>
        </span>
        <input type="text"formControlName="shopId" placeholder="Input Shop ID"/>
        <nus-field-errors-marketplace
          [control]="shopId"
          variable="Shop ID"
        ></nus-field-errors-marketplace>
        <div *ngIf="form.get('shopId').errors?.notNumeric" class="error-detail" i18n>
          Shop ID must be integer and Max length is 10
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
      useExisting: forwardRef(() => ShopeeeClientFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ShopeeeClientFormComponent),
      multi: true,
    },
  ],
})
export class ShopeeeClientFormComponent implements OnInit {
  @Input() shopSlug?: string;
  @Input() isEdit: boolean;
  form: FormGroup;
  warehouses: marketplace.IMarketplaceWarehouse[] = [];
  variantValue: boolean;
  shopIdInfo = 'Go to your Store Profile at Shopee Seller > See column PC Shop > Click on \'See\' > Copy the number after /shop/';
  partnerKeyInfo = 'To get your Partner Key, go to Shopee Open Platform and create APP console';
  partnerIdInfo = 'Partner ID is assigned upon registration is successful. Required for all requests.';

  shopIdValue: number;

  constructor(
    private service: MarketplaceClientService,
    private fb: FormBuilder,
    private toast: ToastService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.service
      .getWarehouse(MarketplaceClientEnum.shopee)
      .subscribe((data: marketplace.IMarketplaceWarehouse[]) => {
        this.warehouses = data;
      });

    if (this.shopSlug) {
      this.fillFormDetail(this.shopSlug);
    }
    this.initializeForm();
  }

  fillFormDetail(shopId: string) {
    this.service
      .getConnection(shopId)
      .subscribe((data: marketplace.IShopeeAuthResponse) => {
        if (data != null) {
          this.form.patchValue({
            shopId: data.shopId,
            warehouseId: data.warehouseId,
          });
          this.shopIdValue = data.shopId;
        }
      });
  }

  get shopId(): FormControl {
    return this.form.get('shopId') as FormControl;
  }
  get warehouseId(): FormControl {
    return this.form.get('warehouseId') as FormControl;
  }

  initializeForm(entity?: marketplace.IShopeeCredential) {
    this.form = this.fb.group({
      shopId: [entity?.shopId, [Validators.required, this.isInteger()]],
      warehouseId: [entity?.warehouse, [Validators.required]],
    });
  }

  check_if_is_integer(value){
    if (value === ''){
      return true;
    } else {
      return ((parseFloat(value) === parseInt(value)) && !isNaN(value) && (value.toString().length <= 20));
    }
  }


  isInteger(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>  {
      if (control.value !== null){
          return this.check_if_is_integer(control.value) ? null : {
                 notNumeric: true
          };
      }
    };
  }


  getFormValue(): any {
    const formValue = {
      marketplace: MarketplaceClientEnum.shopee,
      shop_id:  this.form.value.shopId,
      warehouse_id: this.form.value.warehouseId,
      split_variant: false,
    };
    return formValue;
  }

  onConnect() {
    this.service.connect(this.getFormValue()).subscribe(
      (resp: marketplace.IShopeeAuthResponse) => {
        this.showSignInWindow(resp);
      },
      (err) => {
        this.showErrorToast(err);
      }
    );
  }

  onUpdate() {
    this.service.updateConnection(this.getFormValue(), this.shopSlug).subscribe(
      (resp: marketplace.IShopeeAuthResponse) => {
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

  showSignInWindow(resp: marketplace.IShopeeAuthResponse) {
    if (!resp.isConnected) {
      this.toast?.addMessage(
        `Open shopee tab and log in to grant access. Click refresh when you're done.`,
        'Log in to your marketplace',
        ToastLevelEnum.info
      );
      window.open(resp.authenticationUrl, '_blank');
    }
    this.onCancel();
  }
}
