import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {AbstractDetailComponent, ToastLevelEnum, ToastService} from '@nusantara/core';
import { MarketplaceClientService } from '@nusantara/services';
import {MarketplaceClientEnum} from '../markeplace-client-enum';
import { marketplace } from '@nusantara/models';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'nus-tokopedia-form',
  template: `
    <form [formGroup]="form" class="fluid">
      <label>
        <span>Partner ID
          <nus-tooltip [text]="partnerIdInfo"></nus-tooltip>
        </span>
        <input type="text" formControlName="partnerId" placeholder="Input Partner ID"/>
        <nus-field-errors-marketplace
          [control]="partnerId"
          variable="Partner ID"
        ></nus-field-errors-marketplace>
      </label>

      <label>
        <span>Partner Key
          <nus-tooltip [text]="partnerKeyInfo"></nus-tooltip>
        </span>
        <input type="email" formControlName="partnerKey" placeholder="Input Partner Key"/>
        <nus-field-errors-marketplace
          [control]="partnerKey"
          variable="Partner Key"
        ></nus-field-errors-marketplace>
      </label>

      <label *ngIf="!isEdit">
        <span>FS ID
          <nus-tooltip [text]="fsIdInfo"></nus-tooltip>
        </span>
        <input type="email" formControlName="fsId" placeholder="Input FS ID"/>
        <nus-field-errors-marketplace
          [control]="fsId"
          variable="FS ID"
        ></nus-field-errors-marketplace>
        <div *ngIf="form.get('fsId').errors?.notNumeric" class="error-detail">
          FS ID must be integer
        </div>
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
})
export class TokopediaClientFormComponent
  extends AbstractDetailComponent<any>
  implements OnInit {
  form: FormGroup;
  @Input() shopSlug?: string;
  @Input() isEdit: boolean;
  warehouses: marketplace.IMarketplaceWarehouse[] = [];
  fsIdInfo = "FS ID is Application ID (APP ID) from App Console";
  partnerKeyInfo = "Tokopedia Partner Key is Client Secret from App Console"
  partnerIdInfo = "Tokopedia Partner ID is Client ID from App Console"

  constructor(
    public service: MarketplaceClientService,
    public router: Router,
    public route: ActivatedRoute,
    public fb: FormBuilder,
    public toast: ToastService
  ) {
    super(route, router, toast, service);
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
      this.initializeForm();
  }


  get partnerId(): FormControl {
    return this.form.get('partnerId') as FormControl;
  }
  get partnerKey(): FormControl {
    return this.form.get('partnerKey') as FormControl;
  }

  get fsId(): FormControl {
    return this.form.get('fsId') as FormControl;
  }

  get warehouseId(): FormControl {
    return this.form.get('warehouseId') as FormControl;
  }

  initializeForm(entity?: marketplace.ITokopediaCredential) {
    this.form = this.fb.group({
      partnerId: [entity?.partnerId, [Validators.required, Validators.maxLength(100)]],
      partnerKey: [entity?.partnerKey, [Validators.required,Validators.maxLength(100)]],
      fsId: [entity?.fsId, [Validators.required, this.isInteger()]],
      warehouseId: [entity?.warehouse, [Validators.required]],
    });
  }

  fillFormDetail(sellerEmail: string) {
    this.service
      .getConnection(sellerEmail)
      .subscribe((data: marketplace.ITokopediaAuthResponse) => {
        if (data != null) {
          this.form.patchValue({
            partnerId: data.partnerId,
            partnerKey: data.partnerKey,
            warehouseId: data.warehouseId,
            fsId: data.fsId,
          });
        }
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
      marketplace: MarketplaceClientEnum.tokopedia,
      partner_id: this.form.value.partnerId,
      partner_key: this.form.value.partnerKey,
      fs_id: this.form.value.fsId,
      warehouse_id: this.form.value.warehouseId,
      split_variant: false,
    };
    return formValue;
  }

  onConnect() {
    this.service.connect(this.getFormValue()).subscribe(
      (resp: marketplace.ITokopediaAuthResponse) => {
        this.showSignInWindow(resp);
      },
      (err) => {
        this.showErrorToast(err);
      }
    );
  }

  onUpdate() {
    this.service.updateConnection(this.getFormValue(), this.shopSlug).subscribe(
      (resp: marketplace.ITokopediaAuthResponse) => {
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

  showSignInWindow(resp: marketplace.ITokopediaAuthResponse) {
    if (resp){
      if (!resp.isConnected) {
        this.toast?.addMessage(
          `Successfully connected with your Tokopedia Store`,
          'Connected',
          ToastLevelEnum.info
        );
      }
      this.onCancel();
    } else {
      this.toast?.addMessage(
        `Please recheck the credential in Tokopedia Authentication Management.`,
        'Marketplace Configuration Failed.',
        ToastLevelEnum.info
      );
    }

  }
}
