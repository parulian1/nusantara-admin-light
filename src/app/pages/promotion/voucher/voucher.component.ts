import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators, FormBuilder, FormArray, ValidatorFn, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {AbstractDetailComponent, DialogResult, Logger, ToastService} from '@nusantara/core';
import {drf, INamedHrefEntity, IVoucher} from '@nusantara/models';
import {ProductService, VoucherService} from '@nusantara/services';
import {IProduct} from '../../../models/products';
import * as XLSX from 'xlsx';
import {CustomerGroupModalComponent, ProductSelectionModalComponent} from '../../../shared';

declare var window: any; // Needed on Angular 8+

const log = new Logger('ProductPromotionComponent');


const DiscAmountValidator: ValidatorFn = (fg: FormGroup) => {
  const discAmount = fg.get('amount').value;
  const discType = fg.get('type').value;

  if (discType === 'percentage') {
    if (((discAmount > 0) && (discAmount < 100))) {
      return null;
    } else {
      return { discAmount: true};
    }

  }
  return null;
};

@Component({
  selector: 'nus-voucher',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Voucher">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span i18n>Name</span>
        <input type="text" [formControl]="name" maxlength="50">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span i18n>Code</span>
        <input type="text" [formControl]="code" maxlength="10">
        <nus-field-errors [control]="code"></nus-field-errors>
      </label>

      <label>
        <span i18n>Type</span>
        <select [formControl]="type">
          <option *ngFor="let t of typeChoices" [ngValue]="t.value">{{ t.displayName }}</option>
        </select>
      </label>

      <label>
        <span i18n>Discount Amount</span>
        <input type="number" [formControl]="amount" placeholder="Ex, 10000000">
        <nus-field-errors [control]="amount"></nus-field-errors>
      </label>

      <label>
        <span i18n>Max Discount Amount</span>
        <input type="text" [formControl]="maxAmount" placeholder="Ex, 10000000">
        <nus-field-errors [control]="maxAmount"></nus-field-errors>
      </label>

      <label>
        <span i18n>Discount Based On</span>
        <select [formControl]="discountBase">
          <option *ngFor="let t of discountBaseChoices" [ngValue]="t.value">{{ t.displayName }}</option>
        </select>
      </label>

      <label>
        <span i18n>Minimum Order Amount</span>
        <input type="number" [formControl]="minimumOrderAmount" placeholder="Ex, 10000000">
        <nus-field-errors [control]="minimumOrderAmount"></nus-field-errors>
      </label>


      <label class="max-usage-setting">
        <span i18n>Maximum Usage</span>
        <span class="type-options">
          <label *ngFor="let option of maxUsedChoices" class="types">
            <input type="radio" name="types" [value]="option.value" [formControl]="maxUsed"
              (change)="optionChange(option.value)"> {{ option.displayName}}
          </label>
        </span>
        <input type="number" [formControl]="maxUsedQty" placeholder="Ex, 10000000"
               [disabled]="disableMaxUsedQty" [hidden]="disableMaxUsedQty">
        <nus-field-errors [control]="maxUsedQty" [hidden]="disableMaxUsedQty"></nus-field-errors>
      </label>

      <label class="max-usage-per-user-setting">
        <span i18n>Maximum Usage Per User</span>
        <input type="number" [formControl]="maxUsedUser" placeholder="Ex, 10000000">
        <nus-field-errors [control]="maxUsedUser"></nus-field-errors>
      </label>

      <label>
        <span i18n>Valid From</span>
        <nus-field-datetime [control]="validFrom" [minDate]="minDateValidFrom" [maxDate]="maxDateValidFrom"></nus-field-datetime>
        <nus-field-errors [control]="validFrom"></nus-field-errors>
      </label>

      <label>
        <span i18n>Valid To</span>
        <nus-field-datetime [control]="validTo" [minDate]="minDateValidTo" [maxDate]="maxDateValidTo"></nus-field-datetime>
        <nus-field-errors [control]="validTo"></nus-field-errors>
      </label>

      <label class="toggle">
        <input type="checkbox"
               class="toggle"
               [formControl]="isActive"
               name="is-active"/>
        <span i18n>Is Active</span>
        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>

      <span class="eligible-product">
        <h2 class="title-2" i18n>Voucher Eligible Products</h2>
        <button type="button" class="control" (click)="uploadProductXLSX()" [disabled]="checkVoucherDateValid()">
          <i class="material-icons">publish</i>
          <span i18n>Upload from XLSX</span>
        </button>
      </span>

      <table>
        <thead>
        <tr>
          <th class="numeric">#</th>
          <th i18n>Product</th>
          <th i18n>Action</th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let control of products.controls; let i=index">
          <td class="numeric">{{ i + 1 }}</td>
          <td>{{ control.get('name').value }}</td>
          <td>
            <button (click)="products.removeAt(i)" type="button" [disabled]="checkVoucherDateValid()" class="remove-button">
              <i class="material-icons">remove_circle_outline</i>
            </button>
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <button type="button" (click)="selectProduct()"  [disabled]="checkVoucherDateValid()" class="new-add-button wide" i18n>
              <i class="material-icons">add</i> Add Product
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <div id="customer-groups-wrapper">
        <label>
          <h3 i18n>Customer Groups</h3>
          <button type="button" (click)="selectCustomerGroup()" class="new-add-button">
            <i class="material-icons">add</i>
            <span i18n>Select Customer Group</span>
          </button>
        </label>
        <div class="pill-wrapper">
          <div *ngFor="let customerGroup of customerGroups.value; let i=index" class="pill">
            <span class="subheading-2">{{ customerGroup.name }}</span>
            <button type="button" class="remove-button" (click)="customerGroups.removeAt(i)">
              <i class="material-icons">highlight_off</i>
            </button>
          </div>
        </div>
      </div>

      <a href="{{ service.productListDownloadUrl }}" target="_blank" *ngIf="hasProductUrl" i18n>Download Product List</a>

      <nus-detail-actions
        [component]="this"
        [hideDelete]="!!entity && entity?.href && !entity?.isActive"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>

    <!-- Modals -->
    <nus-product-selection-modal></nus-product-selection-modal>
    <nus-customer-group-selection-modal [selectedGroups]="entity?.customerGroups" #customerGroupModal>
    </nus-customer-group-selection-modal>
  `,
  styles: [
    '.eligible-product { display: flex; margin-bottom: 10px; justify-content: space-between; }',
    '.eligible-product button { display: flex; align-items: center; }',
    `
      #customer-groups-wrapper {
        margin-top: 20px;
      }
      .pill-wrapper, .type-options {
        display: flex;
        flex-wrap: wrap;
      }
      .types {
        margin-right: 20px;
      }
      .max-usage-setting, .types {
        min-height: 40px;
      }
    `
  ]
})
export class VoucherComponent extends AbstractDetailComponent<IVoucher> implements OnInit, AfterViewInit {

  typeChoices: drf.IChoice[] = [
    {displayName: 'Percentage', value: 'percentage'},
    {displayName: 'Amount Off', value: 'amount_off'},
  ];

  discountBaseChoices: drf.IChoice[] = [
    {displayName: 'Quantity on Cart', value: 'quantity'},
    {displayName: 'Total Amount on Cart', value: 'total_amount'}
  ];

  maxUsedChoices: drf.IChoice[] = [
    {displayName: 'Only One Time', value: 'one_time'},
    {displayName: 'More Than Once', value: 'more_than_once'},
  ];

  hasProductUrl = false;
  minDateValidTo: string | Date = null;
  maxDateValidTo: string | Date = null;
  minDateValidFrom: string | Date = null;
  maxDateValidFrom: string | Date = null;

  disableMaxUsedQty = true;
  disableMaxUsedUser = true;

  public entity: IVoucher;

  @ViewChild(ProductSelectionModalComponent) productSelectionModal: ProductSelectionModalComponent;
  @ViewChild('customerGroupModal') customerGroupSelectionModal: CustomerGroupModalComponent;

  constructor(service: VoucherService,
              private fb: FormBuilder,
              protected productService: ProductService,
              toast: ToastService,
              route: ActivatedRoute,
              router: Router) {
    super(route, router, toast, service);
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get type(): FormControl {
    return this.form.get('type') as FormControl;
  }

  get code(): FormControl {
    return this.form.get('code') as FormControl;
  }

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  get minimumOrderAmount(): FormControl {
    return this.form.get('minimumOrderAmount') as FormControl;
  }

  get discountBase(): FormControl {
    return this.form.get('discountBase') as FormControl;
  }

  get maxUsed(): FormControl {
    return this.form.get('maxUsed') as FormControl;
  }

  get maxAmount(): FormControl {
    return this.form.get('maxAmount') as FormControl;
  }

  get validFrom(): FormControl {
    return this.form.get('validFrom') as FormControl;
  }

  get validTo(): FormControl {
    return this.form.get('validTo') as FormControl;
  }

  get products(): FormArray {
    return this.form.get('products') as FormArray;
  }

  get isActive(): FormControl {
    return this.form.get('isActive') as FormControl;
  }

  get maxUsedQty(): FormControl {
    return this.form.get('maxUsedQty') as FormControl;
  }

  get customerGroups(): FormArray {
    return this.form.get('customerGroups') as FormArray;
  }

  get maxUsedUser(): FormControl {
    return this.form.get('maxUsedUser') as FormControl;
  }

  initializeForm(entity?: IVoucher) {
    this.entity = entity;
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, Validators.maxLength(50)]],
      href: [entity?.href],
      type: [entity?.type, [Validators.required]],
      discountBase: [entity?.discountBase, [Validators.required]],
      code: [entity?.code, [Validators.required, Validators.maxLength(10)]],
      amount: [entity?.amount, [Validators.required, Validators.min(0)]],
      minimumOrderAmount: [entity?.minimumOrderAmount ?? 0, [Validators.required, Validators.min(0)]],
      maxAmount: [entity?.maxAmount ?? 0, [Validators.required, Validators.min(0)]],
      maxUsed: [entity?.maxUsed ?? 'one_time', [Validators.required, Validators.min(1)]],
      validFrom: [this.convertDateTime(entity?.validFrom), [Validators.required]],
      validTo: [this.convertDateTime(entity?.validTo), [Validators.required]],
      isActive: [entity?.isActive, []],
      products: this.fb.array([]),
      maxUsedQty: [entity?.maxUsedQty ?? 0, [Validators.max(32767), Validators.min(0)]],
      customerGroups: this.fb.array([]),
      maxUsedUser: [entity?.maxUsedUser ?? 0, [Validators.max(32767), Validators.min(0)]],
    }, {
      validator: DiscAmountValidator
    });

    // need to mark as touched to make custom styling works
    this.form.controls.isActive.markAsTouched();

    for (const prod of entity?.products ?? []) {
      this.addProduct(prod);
    }

    if ((window.localStorage.getItem('site_domain') === 'marthatilaarshop.com') || (window.localStorage.getItem('site_domain') === 'www.marthatilaarshop.com')) {
      // TODO: Bad thing, should get this from API
      this.hasProductUrl = true;
    }

    const today = new Date();
    this.minDateValidTo = entity?.validTo ? entity.validTo : today;
    this.minDateValidFrom = entity?.validFrom ? entity.validFrom : today;

    if (today > new Date(entity?.validTo)) {
      // passed/historical voucher, admin can not edit anything
      this.form.disable();
      this.maxDateValidFrom = entity.validFrom;
      this.maxDateValidTo = entity.validTo;
    } else if (today > new Date(entity?.validFrom)) {
      // ongoing voucher, admin can ONLY edit "valid to" date and / or Inactive a promotion
      this.form.disable();
      this.form.controls.href.enable();
      this.form.controls.validTo.enable();
      this.form.controls.isActive.enable();
      this.minDateValidFrom = entity.validFrom;
      this.maxDateValidFrom = entity.validFrom;
    }

    for (const customerGroup of entity?.customerGroups ?? []) {
      this.addCustomerGroup(customerGroup);
    }

    console.log('this.maxUsed.value', this.maxUsed.value);
    if (this.maxUsed.value !== 'one_time') {
      this.disableMaxUsedQty = false;
    }
  }

  ngAfterViewInit() {
    this.productSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed());
    this.customerGroupSelectionModal.onClose.subscribe(() => this.onCustomerGroupSelectionModalClosed());
  }

  addProduct(product: INamedHrefEntity) {

    if ((this.products.value as Array<IProduct>).filter(p => p.href === product.href).length > 0) {
      log.info('Product already in list -- skipping');
      return;
    }

    this.products.push(
      this.fb.group({
        name: [product.name],
        href: [product.href]
      }));
  }

  selectProduct() {
    this.productSelectionModal.open();
  }

  onProductSelectionModalClosed() {
    if (this.productSelectionModal.result === DialogResult.OK) {

      const selectedProduct = this.productSelectionModal.product.value as IProduct;

      const f = this.fb.group({
        name: [selectedProduct.name, []],
        href: [selectedProduct.href, []]
      });
      this.products.push(f);
    }
  }

  convertDateTime(timestamp: string) {
    if (timestamp) {
      const date = new Date(timestamp);

      const year = date.getFullYear();
      let month: string | number = date.getMonth() + 1; // getMonth() is zero-indexed, so we'll increment to get the correct month number
      let day: string | number = date.getDate();
      let hours: string | number = date.getHours();
      let minutes: string | number = date.getMinutes();
      let seconds: string | number = date.getSeconds();

      month = (month < 10) ? '0' + month : month;
      day = (day < 10) ? '0' + day : day;
      hours = (hours < 10) ? '0' + hours : hours;
      minutes = (minutes < 10) ? '0' + minutes : minutes;
      seconds = (seconds < 10) ? '0' + seconds : seconds;
      return (`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
    }
    return '';
  }

  getTimeZone() {
    const offset = new Date().getTimezoneOffset();
    const o = Math.abs(offset);
    return (offset < 0 ? '+' : '-') + ('00' + Math.floor(o / 60)).slice(-2) + ':' + ('00' + (o % 60)).slice(-2);
  }

  uploadProductXLSX(): void {
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.onchange = (evt: any) => {
      const target: DataTransfer = evt.target as DataTransfer;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        const sheetAsJson = XLSX.utils.sheet_to_json(ws, {header: 1});
        // start @ 1 to skip header?
        for (let i = 1; i < sheetAsJson.length; i++) {
          console.log(sheetAsJson[i][1]);

          const slug = sheetAsJson[i][1];
          this.productService.fetch(slug).subscribe(
            (product) => {
              this.addProduct(product);
            },
            error => {
              console.log(`Failed to add product: ${sheetAsJson[i][0]}`);
            }
          );
        }
      };
      reader.readAsBinaryString(target.files[0]);
    };
    input.click();
  }

  checkVoucherDateValid(): boolean {
    // Disable button if its not new form and voucher is ongoing, passed/historical
    const today = new Date();
    return this.entity && today > new Date(this.validFrom.value);
  }

  addCustomerGroup(customerGroup: INamedHrefEntity) {
    if ((this.customerGroups.value as Array<INamedHrefEntity>).filter((p) => {
      return p.href === customerGroup.href;
    }).length > 0) {
      log.info('Customer Group already in list -- skipping');
      return;
    }

    const f = this.fb.group({
      name: [customerGroup.name],
      href: [customerGroup.href]
    });

    this.customerGroups.push(f);
  }

  onCustomerGroupSelectionModalClosed() {
    if (this.customerGroupSelectionModal.result === DialogResult.OK) {
      const selectedCustomerGroup = this.customerGroupSelectionModal.group.value as INamedHrefEntity;

      if ((this.customerGroups.value as Array<INamedHrefEntity>).filter((p) => {
        return p.href === selectedCustomerGroup.href;
      }).length > 0) {
        log.info('Customer Group already in list -- skipping');
        return;
      }
      const f = this.fb.group({
        name: [selectedCustomerGroup.name, []],
        href: [selectedCustomerGroup.href, []],
      });
      this.customerGroups.push(f);

    }
  }

  selectCustomerGroup() {
    this.customerGroupSelectionModal.open();
  }

  optionChange(value: string) {
    if (value !== 'one_time') {
      this.disableMaxUsedQty = false;
    } else {
      this.disableMaxUsedQty = true;
      this.maxUsedQty.setValue(1);
    }
  }
}
