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
import {
  IShopeeCredential,
  IShopeeAuthResponse,
  IMarketplaceWarehouse,
} from '@nusantara/models';
import { MarketplaceClientEnum } from '../../markeplace-client-enum';

@Component({
  selector: 'nus-shopee-client-form',
  template: `
    <form [formGroup]="form">
      <label>
        <div class="tooltip"><span class="mpFormTitle">Shop ID</span> <i class="material-icons marketplace tooltip" *ngIf="shopIdInfo">info</i>
          <span class="tooltiptext" *ngIf="shopIdInfo">{{shopIdInfo}}</span>
        </div>
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
        <div class="tooltip"><span class="mpFormTitle">Partner ID</span> <i class="material-icons marketplace tooltip" *ngIf="partnerIdInfo">info</i>
          <span class="tooltiptext" *ngIf="partnerIdInfo">{{partnerIdInfo}}</span>
        </div>
        <input type="text" formControlName="partnerId" placeholder="Input Partner ID"/>
        <nus-field-errors-marketplace
          [control]="partnerId"
          variable="Partner ID"
        ></nus-field-errors-marketplace>
      </label>

      <label>
        <div class="tooltip"><span class="mpFormTitle">Partner Key</span> <i class="material-icons marketplace tooltip" *ngIf="partnerKeyInfo">info</i>
          <span class="tooltiptext" *ngIf="partnerKeyInfo">{{partnerKeyInfo}}</span>
        </div>
        <input type="text" formControlName="partnerKey" placeholder="Input Partner Key"/>
        <nus-field-errors-marketplace
          [control]="partnerKey"
          variable="Partner Key"
        ></nus-field-errors-marketplace>
      </label>

      <label>
        <div class="tooltip"> <span class="mpFormTitle">Shop URL</span> <i class="material-icons marketplace tooltip" *ngIf="partnerShopUrlInfo">info</i>
          <span class="tooltiptext" *ngIf="partnerShopUrlInfo">{{partnerShopUrlInfo}}</span>
        </div>
        <input type="text" formControlName="redirectUrl" placeholder="Input Shop URL"/>
        <nus-field-errors-marketplace
          [control]="redirectUrl"
          variable="Shop Url"
        ></nus-field-errors-marketplace>
      </label>

      <label>
        <div class="tooltip"><span class="mpFormTitle">Warehouse</span> <i class="material-icons marketplace tooltip" *ngIf="WarehouseInfo">info</i>
          <span class="tooltiptext" *ngIf="WarehouseInfo">{{WarehouseInfo}}</span>
        </div> <br>
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
      <nus-variant-client-form
        (isSplit)="isSplitValue($event)"
        [shopSlug]="shopSlug"
        [isEdit]="isEdit" *ngIf="!isEdit">
      </nus-variant-client-form>
      <button type="button" (click)="onCancel()" class="control secondary">
        Cancel
      </button>
      <div
        *ngIf="isEdit; then thenBlock; else elseBlock"
        class="actions-container"
      ></div>
      <ng-template #thenBlock>
        <button
          type="submit"
          [disabled]="!form.valid"
          class="control"
          (click)="onUpdate()"
        >
          Connect
        </button>
      </ng-template>
      <ng-template #elseBlock>
        <button
          type="submit"
          [disabled]="!form.valid"
          class="control"
          (click)="onConnect()"
        >
          Connect
        </button>
      </ng-template>
    </form>
  `,
  styles: [
    `
      button:not(:first-child) {
        margin-left: 5px;
      }

      .marketplace{
        font-size: 18px;
      }

      label{
        padding-bottom: 24px !important;
      }

      select{
        background-color: white !important;
        max-width: none !important;
        width: 100%;
        height: 40px;
        border-radius: 4px;
      }

      input{
        height: 40px;
        border-radius: 4px;
      }
      /* Tooltip container */
      .tooltip {
          position: relative;
          display: inline-block;
      }
      .mpFormTitle{
        margin-right: 5px;
        font-size: .7em;
        font-weight: 700;
      }

      /* Tooltip text */
      .tooltip .tooltiptext {
        visibility: hidden;
        width: 312px;
        color: black;
        text-align: left;
        padding: 10px;
        border-radius: 6px;
        background-color: white;
        /* Position the tooltip text */
        position: absolute;
        z-index: 1;
        top: 125%;
        left: 40px;
        /* Fade in tooltip */
        opacity: 0;
        transition: opacity 1s;

        box-shadow: 2px 2px lightgray;
      }

      /* Tooltip arrow */
      /*.tooltip .tooltiptext::after {*/
      /*  content: "";*/
      /*  position: absolute;*/
      /*  bottom: 100%;*/
      /*  left: 6%;*/

      /*  width: 0;*/
      /*  height: 0;*/
      /*  border-left: 10px solid transparent;*/
      /*  border-right: 10px solid transparent;*/
      /*  border-bottom: 10px solid white;*/
      /*  filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, .5));*/
      /*}*/

      /* Show the tooltip text when you mouse over the tooltip container */
      .tooltip:hover .tooltiptext {
          visibility: visible;
          opacity: 1;
      }
    `
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
  warehouses: IMarketplaceWarehouse[] = [];
  variantValue : boolean;
  shopIdInfo: string;
  partnerKeyInfo: string;
  partnerIdInfo: string;
  partnerShopUrlInfo: string;
  WarehouseInfo: string;

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
    this.shopIdInfo = "Go to your Store Profile at Shopee Seller > See column PC Shop > Click on 'See' > Copy the number after /shop/";
    this.partnerKeyInfo = "To get your Partner Key, go to Shopee Open Platform and create APP console"
    this.partnerIdInfo = "Partner ID is assigned upon registration is successful. Required for all requests."
    this.service
      .getWarehouse(MarketplaceClientEnum.shopee)
      .subscribe((data: IMarketplaceWarehouse[]) => {
        this.warehouses = data;
      });

    if (this.shopSlug) {
      this.fillFormDetail(this.shopSlug);
    }
  }

  fillFormDetail(shopId: string) {
    this.service
      .getConnection(shopId)
      .subscribe((data: IShopeeAuthResponse) => {
        if (data != null) {
          this.form.patchValue({
            partnerId: data.partnerId,
            partnerKey: data.partnerKey,
            redirectUrl: data.redirectUrl,
            shopId: data.shopId,
            warehouseId: data.warehouseId,
          });
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

  initializeForm(entity?: IShopeeCredential) {
    this.form = this.fb.group({
      partnerId: [entity?.partnerId, [Validators.required, Validators.maxLength(100)]],
      partnerKey: [entity?.partnerKey, [Validators.required,Validators.maxLength(100)]],
      redirectUrl: [entity?.redirectUrl, [Validators.required,Validators.maxLength(100)]],
      shopId: [entity?.shopId, [Validators.required, this.isInteger()]],
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
      marketplace: MarketplaceClientEnum.shopee,
      partner_id: this.form.value.partnerId,
      partner_key: this.form.value.partnerKey,
      redirect_url: this.form.value.redirectUrl,
      shop_id: this.form.value.shopId,
      warehouse_id: this.form.value.warehouseId,
      split_variant: this.variantValue,
    };
    return formValue;
  }

  onConnect() {
    this.service.connect(this.getFormValue()).subscribe(
      (resp: IShopeeAuthResponse) => {
        this.showSignInWindow(resp);
      },
      (err) => {
        this.showErrorToast(err);
      }
    );
  }

  onUpdate() {
    this.service.updateConnection(this.getFormValue(), this.shopSlug).subscribe(
      (resp: IShopeeAuthResponse) => {
        this.showSignInWindow(resp);
      },
      (err: HttpErrorResponse) => {
        this.showErrorToast(err);
      }
    );
  }

  onCancel() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  showErrorToast(resp: HttpErrorResponse) {
    this.toast?.addMessage(resp.error.message, 'error', ToastLevelEnum.error);
  }

  showSignInWindow(resp: IShopeeAuthResponse) {
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
