import {Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {AbstractDetailComponent, ToastService} from '@nusantara/core';
import {IKgxWms} from '@nusantara/models/integrations/kgx-wms';
import {KgxWmsService} from '@nusantara/services/integrations/kgx-wms.service';

@Component({
  selector: 'nus-kgx-wms',
  template: `
    <nus-detail-title originalName="WMS KGX" typeName="WMS KGX"></nus-detail-title>
    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>
    <form [formGroup]="form" (ngSubmit)="save()" #f>
      <div class="wrapper">
        <label>
          <span i18n="WMS Company ID">Company ID</span>
          <input type="text" [formControl]="companyId" name="companyId" maxlength="50">
          <nus-field-errors [control]="companyId"></nus-field-errors>
        </label>
        <label>
          <span i18n="WMS Authentication Token">Auth Token</span>
          <input type="text" [formControl]="authToken" name="authToken" maxlength="100">
          <nus-field-errors [control]="authToken"></nus-field-errors>
        </label>
      </div>
      <div class="wrapper">
        <label>
          <span i18n="WMS Category ID">Category ID</span>
          <input type="text" [formControl]="categoryId" name="categoryId" maxlength="50">
          <nus-field-errors [control]="categoryId"></nus-field-errors>
        </label>
        <label>
          <span i18n="WMS Unit Of Measurement ID">Unit Of Measurement ID</span>
          <input type="text" [formControl]="uomId" name="uomId" maxlength="50">
          <nus-field-errors [control]="uomId"></nus-field-errors>
        </label>
        <label>
          <span i18n="WMS Consignment PO ID">Consignment PO ID</span>
          <input type="text" [formControl]="consignmentPoId" name="consignmentPoId" maxlength="50">
          <nus-field-errors [control]="consignmentPoId"></nus-field-errors>
        </label>
        <label>
          <span i18n="WMS Supplier ID">Supplier ID</span>
          <input type="text" [formControl]="supplierId" name="supplierId" maxlength="50">
          <nus-field-errors [control]="supplierId"></nus-field-errors>
        </label>
        <label>
          <span i18n="WMS Picking Type ID">Picking Type ID</span>
          <input type="text" [formControl]="pickingTypeId" name="pickingTypeId" maxlength="50">
          <nus-field-errors [control]="pickingTypeId"></nus-field-errors>
        </label>
        <label>
          <span i18n="WMS Customer ID">Customer ID</span>
          <input type="text" [formControl]="customerId" name="customerId" maxlength="50">
          <nus-field-errors [control]="customerId"></nus-field-errors>
        </label>
      </div>
      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        [hideDelete]="true">
      </nus-detail-actions>
    </form>
  `,
  styles: [
    '.container { display: grid; grid-template-columns: 3fr 1fr; grid-column-gap: 24px; }',
    '.wrapper { padding: 16px 24px; border: solid 1px var(--grey); border-radius: 4px; margin-bottom: 24px; }',
  ]
})
export class KgxWmsComponent extends AbstractDetailComponent<IKgxWms> implements OnInit {

  entity?: IKgxWms;

  constructor(route: ActivatedRoute,
              router: Router,
              public fb: FormBuilder,
              toast: ToastService,
              service: KgxWmsService) {
    super(route, router, toast, service);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  get companyId(): FormControl {
    return this.form.get('companyId') as FormControl;
  }

  get categoryId(): FormControl {
    return this.form.get('categoryId') as FormControl;
  }

  get uomId(): FormControl {
    return this.form.get('uomId') as FormControl;
  }

  get consignmentPoId(): FormControl {
    return this.form.get('consignmentPoId') as FormControl;
  }

  get supplierId(): FormControl {
    return this.form.get('supplierId') as FormControl;
  }

  get pickingTypeId(): FormControl {
    return this.form.get('pickingTypeId') as FormControl;
  }

  get customerId(): FormControl {
    return this.form.get('customerId') as FormControl;
  }

  get authToken(): FormControl {
    return this.form.get('authToken') as FormControl;
  }

  initializeForm(entity?: IKgxWms) {
    this.form = this.fb.group({
        href: [entity?.href,],
        companyId: [entity?.companyId, [Validators.required, Validators.pattern('^[0-9]*$')]],
        categoryId: [entity?.categoryId, [Validators.required, Validators.pattern('^[0-9]*$')]],
        uomId: [entity?.uomId, [Validators.required, Validators.pattern('^[0-9]*$')]],
        consignmentPoId: [entity?.consignmentPoId, [Validators.required, Validators.pattern('^[0-9]*$')]],
        supplierId: [entity?.supplierId, [Validators.required, Validators.pattern('^[0-9]*$')]],
        pickingTypeId: [entity?.pickingTypeId, [Validators.required, Validators.pattern('^[0-9]*$')]],
        customerId: [entity?.customerId, [Validators.required, Validators.pattern('^[0-9]*$')]],
        authToken: [entity?.authToken, [Validators.required,]],
      }
    );

    this.entity = entity;
  }
  save() {
    super.save();
  }

}
