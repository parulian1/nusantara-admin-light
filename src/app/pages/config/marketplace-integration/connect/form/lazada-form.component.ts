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
  selector: 'nus-lazada-client-form',
  template: `
    <form [formGroup]="form" class="fluid">
      <label>
        <span>Seller Email
          <nus-tooltip [text]="sellerEmailinfo"></nus-tooltip>
        </span>
        <input type="email" formControlName="sellerEmail" placeholder="Input Seller Email"/>
        <nus-field-errors-marketplace
          [control]="sellerEmail"
          variable="Seller Email"
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
      useExisting: forwardRef(() => LazadaFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => LazadaFormComponent),
      multi: true,
    },
  ],
})
export class LazadaFormComponent implements OnInit {
  @Input() shopSlug?: string;
  @Input() isEdit: boolean;
  form: FormGroup;
  warehouses: marketplace.IMarketplaceWarehouse[] = [];
  shopIdValue: any;
  sellerEmailinfo = "Seller Email is Registered Seller Email in Lazada";

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
      .getWarehouse(MarketplaceClientEnum.lazada)
      .subscribe((data: marketplace.IMarketplaceWarehouse[]) => {
        this.warehouses = data;
      });

    if (this.shopSlug) {
      this.fillFormDetail(this.shopSlug);
    }
  }

  fillFormDetail(sellerEmail: string) {
    this.service
      .getConnection(sellerEmail)
      .subscribe((data: marketplace.ILazadaAuthResponse) => {
        if (data != null) {
          this.form.patchValue({
            sellerEmail: data.sellerEmail,
            warehouseId: data.warehouseId,
          });
        }
      });
  }


  get sellerEmail(): FormControl {
    return this.form.get('sellerEmail') as FormControl;
  }

  get warehouseId(): FormControl {
    return this.form.get('warehouseId') as FormControl;
  }

  initializeForm(entity?: marketplace.ILazadaCredential) {
    this.form = this.fb.group({
      sellerEmail: [entity?.sellerEmail ?? '', [Validators.required, Validators.email]],
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
      marketplace: MarketplaceClientEnum.lazada,
      seller_email: this.form.value.sellerEmail,
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
        `Confirm Lazada Authorization Page to grant access. Click refresh when you're done.`,
        'Log in to your marketplace',
        ToastLevelEnum.info
      );
      window.open(resp.authenticationUrl, '_blank');
    }
    this.onCancel();
  }
}
