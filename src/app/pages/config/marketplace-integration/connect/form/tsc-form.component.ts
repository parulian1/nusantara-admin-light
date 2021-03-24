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
  selector: 'nus-tsc-client-form',
  template: `
    <form [formGroup]="form" class="fluid">
      <label>
        <span>Shop ID
          <nus-tooltip [text]="credentialInfo"></nus-tooltip>
        </span>
        <input formControlName="shopId" placeholder="Input Shop ID"/>
        <nus-field-errors-marketplace
          [control]="shopId"
          variable="Shop ID"
        ></nus-field-errors-marketplace>
        <div *ngIf="form.get('shopId').errors?.notNumeric" class="error-detail">
          Shop ID must be integer and Max length is 10
        </div>
      </label>

      <label>
        <span>Partner ID
          <nus-tooltip [text]="credentialInfo"></nus-tooltip>
        </span>
        <input type="text" formControlName="partnerId" placeholder="Input Partner ID"/>
        <nus-field-errors-marketplace
          [control]="partnerId"
          variable="Partner ID"
        ></nus-field-errors-marketplace>
      </label>

      <label>
        <span>Partner Key
          <nus-tooltip [text]="credentialInfo"></nus-tooltip>
        </span>
        <input type="text" formControlName="partnerKey" placeholder="Input Partner Key"/>
        <nus-field-errors-marketplace
          [control]="partnerKey"
          variable="Partner Key"
        ></nus-field-errors-marketplace>
      </label>

      <label>
        <span>Warehouse</span>
        <select formControlName="warehouseId">
          <option [value]="null">Select Warehouse</option>
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
          (click)="onUpdate()">
          Connect
        </button>
        <button *ngIf="!isEdit"
          type="submit"
          [disabled]="!form.valid"
          class="control"
          (click)="onConnect()">
          Connect
        </button>
        <button type="button" (click)="onCancel()" class="control secondary ghost">
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
      useExisting: forwardRef(() => TscFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TscFormComponent),
      multi: true,
    },
  ],
})
export class TscFormComponent implements OnInit {
  @Input() shopSlug?: string;
  @Input() isEdit: boolean;
  form: FormGroup;
  warehouses: marketplace.IMarketplaceWarehouse[] = [];
  variantValue: boolean;
  credentialInfo = 'Contact our support by email to integrations.gramedia.digital to get your partner credential (ShopID/PartnerID/Partner Key)';
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
            partnerId: data.partnerId,
            partnerKey: data.partnerKey,
            redirectUrl: data.redirectUrl,
            shopId: data.shopId,
            warehouseId: data.warehouseId,
          });
          this.shopIdValue = data.shopId;
        }
      });
  }

  get partnerId(): FormControl {
    return this.form.get('partnerId') as FormControl;
  }
  get partnerKey(): FormControl {
    return this.form.get('partnerKey') as FormControl;
  }
  get redirectUrl(): FormControl {
    return this.form.get('redirectUrl') as FormControl;
  }
  get shopId(): FormControl {
    return this.form.get('shopId') as FormControl;
  }
  get warehouseId(): FormControl {
    return this.form.get('warehouseId') as FormControl;
  }

  initializeForm(entity?: marketplace.IShopeeCredential) {
    this.form = this.fb.group({
      partnerId: [entity?.partnerId, [Validators.required, Validators.maxLength(100)]],
      partnerKey: [entity?.partnerKey, [Validators.required, Validators.maxLength(100)]],
      shopId: [entity?.shopId, [Validators.required, this.isInteger()]],
      warehouseId: [entity?.warehouse, [Validators.required]],
    });

    if (this.isEdit){
      this.shopId.disable();
    }
  }

  check_if_is_integer(value){
    if (value === ''){
      return true;
    } else {
      return ((parseFloat(value) === parseInt(value)) && !isNaN(value) && (value.toString().length <= 10));
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
      marketplace: MarketplaceClientEnum.tsc,
      partner_id: this.form.value.partnerId,
      partner_key: this.form.value.partnerKey,
      redirect_url: this.form.value.redirectUrl,
      shop_id: this.isEdit ? this.shopIdValue : this.form.value.shopId,
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

  isSplitValue(event: any) {
    this.variantValue = event;
  }
}
