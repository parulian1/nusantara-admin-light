import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AbstractDetailComponent, DialogResult, NusantaraValidators, ToastService} from '@nusantara/core';
import {IGiftVoucher, INamedHrefEntity, IWarehouse} from '@nusantara/models';
import {GiftVoucherService} from '@nusantara/services';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {WarehouseSelectionModalComponent} from "@nusantara/shared/modals/warehouse-selection-modal.component";
import {convertDateTime} from "@nusantara/shared/helpers";

@Component({
  selector: 'nus-gift-voucher',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Gift Voucher">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()">
      <div class="container">
        <div class="wrapper">
          <h1 class="heading-1">Gift Voucher</h1>

          <label>
            <span i18n>Voucher Name</span>
            <input type="text" [formControl]="name" maxlength="50">
            <nus-field-errors [control]="name"></nus-field-errors>
          </label>

          <label>
            <span i18n>Voucher Code</span>
            <input type="text" [formControl]="code" maxlength="10">
            <nus-field-errors [control]="code"></nus-field-errors>
          </label>

          <label>
            <span i18n>Voucher Amount (Rp.)</span>
            <input type="number" [formControl]="amount" placeholder="Ex, 10000000">
            <nus-field-errors [control]="amount"></nus-field-errors>
          </label>

          <div class="gift-voucher-date">
            <label>
              <span i18n>Valid From</span>
              <nus-field-datetime [control]="validFrom" [minDate]="minDateValidFrom"
                                  [maxDate]="maxDateValidFrom"></nus-field-datetime>
              <nus-field-errors [control]="validFrom"></nus-field-errors>
              <div *ngIf="validFrom.errors?.maxDateTime" class="error-detail" i18n>
                Input must be less than Valid To
              </div>
            </label>

            <label>
              <span i18n>Valid To</span>
              <nus-field-datetime [control]="validTo" [minDate]="minDateValidTo"
                                  [maxDate]="maxDateValidTo"></nus-field-datetime>
              <nus-field-errors [control]="validTo"></nus-field-errors>
              <div *ngIf="validTo.errors?.minDateTime" class="error-detail" i18n>
                Input must be larger than Valid From
              </div>
            </label>
          </div>

          <label class="toggle">
            <input type="checkbox"
                   class="toggle"
                   [formControl]="isActive"
                   name="is-active"/>
            <span i18n>Is Active</span>
            <nus-field-errors [control]="isActive"></nus-field-errors>
          </label>
        </div>

      </div>
      <div class="container">
        <div class="wrapper">
          <h1 class="heading-1">Applicable on</h1>

          <label role="radio" class="radio">
            <input type="radio" [value]="true" [formControl]="allWarehouse" i18n>
            All Warehouses
          </label>

          <label role="radio" class="radio">
            <input type="radio" [value]="false" [formControl]="allWarehouse" i18n>
            Selected Warehouse Only
          </label>

          <div *ngIf="!allWarehouse.value" class="warehouse-table">
            <table>
              <thead>
              <tr>
                <th i18n>Warehouse</th>
                <th i18n>Delete</th>
              </tr>
              </thead>
              <tbody>
              <tr *ngFor="let control of warehouses?.controls; let i=index">
                <td>{{ control.get('name').value }}</td>
                <td>
                  <button (click)="warehouses.removeAt(i)" type="button" class="remove-button" [disabled]="checkVoucherDateValid()">
                    <i class="material-icons">delete_outline</i>
                  </button>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <button type="button" class="new-add-button wide" (click)="selectWarehouse()"
                          [disabled]="checkVoucherDateValid()" i18n>
                    <i class="material-icons">add</i> Add Warehouse
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <nus-detail-actions
        [component]="this"
        [hideDelete]="!!entity && entity?.href && !entity?.isActive"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>

    <!-- Modals -->
    <nus-warehouse-selection-modal></nus-warehouse-selection-modal>

  `,
  styles: [
    'h1 { margin-bottom: 0.75rem; }',
    'form{ max-width: none;}',
    'h3 { font-size: 20px; margin: 0; }',
    '.container { display: grid; grid-template-columns: 4fr 1fr; grid-gap: 24px; margin-bottom: 16px;}',
    '.wrapper { border: 1px solid var(--grey); border-radius: 4px; padding: 16px 24px; }',
    '.wrapper:not(:last-child) { margin-bottom: 24px; }',
    '.wrapper label { min-height: 0; }',
    '.wrapper span{ font-weight: 700; color: var(--darken-grey); }',
    `.gift-voucher-date { display: grid; grid-template-columns: repeat(2, 1fr); grid-column-gap: 30px; }`
  ]
})
export class GiftVoucherComponent extends AbstractDetailComponent<IGiftVoucher> implements OnInit, AfterViewInit {
  @ViewChild(WarehouseSelectionModalComponent) warehouseSelectionModal: WarehouseSelectionModalComponent;

  public entity: IGiftVoucher;
  minDateValidTo: string | Date = null;
  maxDateValidTo: string | Date = null;
  minDateValidFrom: string | Date = null;
  maxDateValidFrom: string | Date = null;
  warehouseChoices: IWarehouse[];

  constructor(service: GiftVoucherService,
              private  fb: FormBuilder,
              toast: ToastService,
              route: ActivatedRoute,
              router: Router) {
    super(route, router, toast, service);
  }

  setWarehouseValidator() {
    const warehouses = this.form.get('warehouses');

    // Set warehouse form to required, if gift voucher on selected warehouse only
    this.form.get('allWarehouse').valueChanges.subscribe(value => {
      if (value === true) {
        warehouses.setValidators([Validators.required]);
      } else {
        warehouses.setValidators([]);
      }
      warehouses.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data:{ warehouses: IWarehouse[]}) => {
      this.warehouseChoices = data.warehouses;
    })
    super.ngOnInit();
    this.setWarehouseValidator();
    this.allWarehouse.markAsTouched();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.warehouseSelectionModal.onClose.subscribe(() => this.onWarehouseSelectionModalClosed());

    // Update date validation every time validFrom and validTo change
    this.form.get('validFrom').valueChanges.subscribe(value => {
      this.form.get('validTo').setValidators(NusantaraValidators.minDateTime(value))
    });

    this.form.get('validTo').valueChanges.subscribe(value => {
      this.form.get('validFrom').setValidators(NusantaraValidators.maxDateTime(value))
    });
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get code(): FormControl {
    return this.form.get('code') as FormControl;
  }

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  get validFrom(): FormControl {
    return this.form.get('validFrom') as FormControl;
  }

  get validTo(): FormControl {
    return this.form.get('validTo') as FormControl;
  }

  get isActive(): FormControl {
    return this.form.get('isActive') as FormControl;
  }

  get allWarehouse(): FormControl {
    return this.form.get('allWarehouse') as FormControl
  }

  get warehouses(): FormArray {
    return this.form.get('warehouses') as FormArray;
  }

  initializeForm(entity?: IGiftVoucher) {
    this.entity = entity;
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, Validators.maxLength(50)]],
      href: [entity?.href],
      code: [entity?.code, [Validators.required, Validators.maxLength(10)]],
      amount: [entity?.amount, [Validators.required, Validators.min(1)]],
      validFrom: [convertDateTime(entity?.validFrom), [Validators.required]],
      validTo: [convertDateTime(entity?.validTo), [Validators.required]],
      isActive: [entity?.isActive, []],
      allWarehouse: [entity?.allWarehouse || true, [Validators.required]],
      warehouses: this.fb.array([]),
    });

    // need to mark as touched to make custom styling works
    this.form.controls.isActive.markAsTouched();

    const today = new Date();
    this.minDateValidTo = entity?.validTo ? entity.validTo : today;
    this.minDateValidFrom = entity?.validFrom ? entity.validFrom : today;

    if (today > new Date(entity?.validTo)) {
      // passed/historical gift voucher, admin can not edit anything
      this.form.disable();
      this.maxDateValidFrom = entity.validFrom;
      this.maxDateValidTo = entity.validTo;
    } else if (today > new Date(entity?.validFrom)) {
      // ongoing gift voucher, admin can ONLY edit "valid to" date and / or Inactive a gift voucher
      this.form.disable();
      this.form.controls.href.enable();
      this.form.controls.validTo.enable();
      this.form.controls.isActive.enable();
      this.minDateValidFrom = entity.validFrom;
      this.maxDateValidFrom = entity.validFrom;
    }

    if (entity?.warehouses.length > 0){
      this.form.get('allWarehouse').setValue(false);
    }
    entity?.warehouses.forEach((value) => {
      this.addWarehouse(value);
    });
  }

  /* WAREHOUSE SELECTION */
  selectWarehouse() {
    this.warehouseSelectionModal.open();
  }

  addWarehouse(warehouse: INamedHrefEntity) {
    const w = this.fb.group({
      href: [warehouse.href, []],
      name: [warehouse.name, []]
    });

    this.warehouses.push(w);
  }

  onWarehouseSelectionModalClosed() {
    if (this.warehouseSelectionModal.result === DialogResult.OK) {
      const selectedWarehouse = this.warehouseSelectionModal.warehouse.value as IWarehouse;
      const w = this.fb.group({
        href: [selectedWarehouse.href, []],
        name: [selectedWarehouse.name, []]
      });

      this.warehouses.push(w);
    }
  }
  /* WAREHOUSE SELECTION */

  checkVoucherDateValid() {
    // Disable button if it's not new form or ongoing and voucher is passed/historical
    const today = new Date();
    return this.entity && today > new Date(this.validTo.value);
  }
}
