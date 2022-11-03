import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RequireIsEnterpriseGuard } from "@nusantara/auth";
import { AbstractDetailComponent, ToastService } from "@nusantara/core";
import { IWarehouse } from "@nusantara/models";
import { IPartner } from "@nusantara/models/integrations/partner";
import { SiteConfigService, WarehouseService } from "@nusantara/services";
import { PartnerService } from "@nusantara/services/integrations/partner.service";
import { PartnerExternalEnum } from "./partner-external-enum";

@Component({
  selector: 'nus-forstok-external-form',
  template: `
    <form [formGroup]="form" class="fluid" (ngSubmit)="save()">
      <label>
        <span i18n
          >Name
          <nus-tooltip
            [text]="'Registered Name in Forstok'"
          ></nus-tooltip>
        </span>
        <input type="text" formControlName="name" name="name" />
        <nus-field-errors [control]="form.get('name')"></nus-field-errors>
      </label>
      <label>
        <span i18n
          >Forstok ID
          <nus-tooltip
            [text]="'Registered Forstok ID provided by Forstok'"
          ></nus-tooltip>
        </span>
        <input type="text" formControlName="forstokId" name="forstokId" />
        <nus-field-errors [control]="form.get('forstokId')"></nus-field-errors>
      </label>
      <label>
        <span i18n
          >Secret Key
          <nus-tooltip
            [text]="'Registered Secret Key provided by Forstok'"
          ></nus-tooltip>
        </span>
        <input type="text" formControlName="secretKey" name="secretKey" />
        <nus-field-errors [control]="form.get('secretKey')"></nus-field-errors>
      </label>

      <label>
        <span i18n>Warehouse</span>
        <select formControlName="warehouseId">
          <option [value]="null" i18n>Select Warehouse</option>
          <option *ngFor="let opt of warehouses" [ngValue]="opt.warehouseId">
            {{ opt.name }}
          </option>
        </select>
        <nus-field-errors [control]="form.get('warehouse')"></nus-field-errors>
      </label>

      <nus-detail-actions
        [component]="this"
        [hideDelete]="true"
        (cancel)="navigateToParent(true)"
      >
      </nus-detail-actions>
    </form>
  `,
  styles: [
    'button:not(:first-of-type) { margin-left: 5px; }',
    '.action-buttons { margin-top: 20px; }'
  ],
})
export class ForstokFormComponent
  extends AbstractDetailComponent<IPartner>
  implements OnInit
{
  @Input() shopSlug?: string;
  @Input() isEdit: boolean;
  @Input() entity: IPartner;
  warehouses:IWarehouse[] = [];

  constructor(
    service: PartnerService,
    router: Router,
    route: ActivatedRoute,
    public fb: FormBuilder,
    toast: ToastService,
    public configService: SiteConfigService,
    public warehouseService: WarehouseService,
    public enterpriseGuard: RequireIsEnterpriseGuard
  ) {
    super(route, router, toast, service);
  }

  ngOnInit() {
    super.ngOnInit();
    this.route.data.subscribe((data: { entity: IPartner }) => {
      this.entity = data.entity;
    });
    this.warehouseService.getWarehouse().subscribe((data: IWarehouse[]) => {
      this.warehouses = data
    });

    this.isEdit = !!this.route.snapshot.paramMap.get("slug");
    if (this.isEdit) {
      this.form.get("partner").disable();
    }
  }

  initializeForm(entity?: IPartner) {
    this.form = this.fb.group({
      slug: [this.route.snapshot.paramMap.get("slug"), []],
      name: [entity?.name, [Validators.required]],
      forstokId: [
        entity?.forstokId,
        [Validators.required],
      ],
      secretKey: [entity?.secretKey, [Validators.required]],
      warehouse: [entity?.warehouse, [Validators.required]]
    });

    // need to mark as touched to make custom styling works
  }

  getFormValue() {
    const formValue = {
      partner: PartnerExternalEnum.forstok,
      name: this.form.value.name,
      slug: this.form.value.slug,
      forstokId:  this.form.value.forstokId,
      secretKey: this.form.value.secretKey,
      warehouse: this.form.value.warehouse
    };
    return formValue;
  }
}
