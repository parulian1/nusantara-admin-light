import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RequireIsEnterpriseGuard } from "@nusantara/auth";
import { AbstractDetailComponent, ToastService } from "@nusantara/core";
import { IPartner } from "@nusantara/models/integrations/partner";
import { SiteConfigService } from "@nusantara/services";
import { PartnerService } from "@nusantara/services/integrations/partner.service";

@Component({
  selector: "nus-partner",
  template: ` <nus-detail-title
      [originalName]="originalEntityName"
      [typeName]="entityTypeName"
    >
    </nus-detail-title>

    <form [formGroup]="form" (ngSubmit)="save()">
      <label>
        <span i18n>Partner</span>
        <select formControlName="partner" name="partner">
          <option value="wms">WMS</option>
        </select>
        <nus-field-errors [control]="form.get('partner')"></nus-field-errors>
      </label>

      <label>
        <span i18n
          >Client ID
          <nus-tooltip
            [text]="'Consignment product owner provided by WMS'"
          ></nus-tooltip>
        </span>
        <input type="number" formControlName="clientId" name="clientId" />
        <nus-field-errors [control]="form.get('clientId')"></nus-field-errors>
      </label>

      <label>
        <span i18n
          >Company ID
          <nus-tooltip
            [text]="'Registered identification provided by WMS'"
          ></nus-tooltip>
        </span>
        <input type="number" formControlName="companyId" name="companyId" />
        <nus-field-errors [control]="form.get('companyId')"></nus-field-errors>
      </label>

      <label>
        <span i18n
          >Category ID
          <nus-tooltip
            [text]="'Registered category provided by WMS'"
          ></nus-tooltip>
        </span>
        <input type="number" formControlName="categoryId" name="categoryId" />
        <nus-field-errors [control]="form.get('categoryId')"></nus-field-errors>
      </label>

      <label>
        <span i18n
          >Customer ID
          <nus-tooltip
            [text]="'Registered customer provided by WMS'"
          ></nus-tooltip>
        </span>
        <input type="number" formControlName="customerId" name="customerId" />
        <nus-field-errors [control]="form.get('customerId')"></nus-field-errors>
      </label>

      <label>
        <span i18n
          >Access
          <nus-tooltip
            [text]="'Registered token provided by WMS'"
          ></nus-tooltip>
        </span>
        <textarea formControlName="access" name="access"></textarea>
        <nus-field-errors [control]="form.get('access')"></nus-field-errors>
      </label>

      <label class="checkbox">
        <input
          type="checkbox"
          formControlName="isActive"
          name="isActive"
          i18n
        />
        Auto push to WMS
        <nus-tooltip [text]="'For enabled send product and received PO / SO automatically'"></nus-tooltip>
        <nus-field-errors [control]="form.get('isActive')"></nus-field-errors>
      </label>

      <nus-detail-actions
        [component]="this"
        [hideDelete]="true"
        (cancel)="navigateToParent(true)"
      >
      </nus-detail-actions>
    </form>`
})
export class PartnerComponent
  extends AbstractDetailComponent<IPartner>
  implements OnInit
{
  entity: IPartner;
  isEdit: boolean;

  constructor(
    service: PartnerService,
    router: Router,
    route: ActivatedRoute,
    public fb: FormBuilder,
    toast: ToastService,
    public configService: SiteConfigService,
    public enterpriseGuard: RequireIsEnterpriseGuard
  ) {
    super(route, router, toast, service);
  }

  ngOnInit() {
    super.ngOnInit();
    this.route.data.subscribe((data: { entity: IPartner }) => {
      this.entity = data.entity;
    });

    this.isEdit = !!this.route.snapshot.paramMap.get("slug");
    if (this.isEdit) {
      this.form.get("partner").disable();
    }
  }

  initializeForm(entity?: IPartner) {
    this.form = this.fb.group({
      partner: [
        entity?.partner,
        [Validators.required, Validators.maxLength(100)],
      ],
      slug: [this.route.snapshot.paramMap.get("slug"), []],
      clientId: [
        entity?.clientId,
        [Validators.required, Validators.max(99999999)],
      ],
      companyId: [
        entity?.companyId,
        [Validators.required, Validators.max(99999999)],
      ],
      categoryId: [
        entity?.categoryId,
        [Validators.required, Validators.max(99999999)],
      ],
      customerId: [
        entity?.customerId,
        [Validators.required, Validators.max(99999999)],
      ],
      access: [entity?.access, [Validators.required]],
      isActive: [entity?.isActive ?? true],
    });

    // need to mark as touched to make custom styling works
    this.form.controls.isActive.markAsTouched();
  }

  getFormValue() {
    if (this.isEdit) {
      this.form.patchValue({
        partner: this.entity.partner,
      });
      return this.form.getRawValue();
    }
    return this.form.value;
  }
}
