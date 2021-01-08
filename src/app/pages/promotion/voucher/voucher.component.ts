import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators, FormBuilder, FormArray, ValidatorFn, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {AbstractDetailComponent, DialogResult, ToastService} from '@nusantara/core';
import {drf, INamedHrefEntity, IVoucher} from '@nusantara/models';
import {ProductService, VoucherService} from '@nusantara/services';
import {IProduct} from '../../../models/products';
import * as XLSX from 'xlsx';
import {ProductSelectionModalComponent} from '../../../shared';


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
        <span>Name</span>
        <input type="text" [formControl]="name" maxlength="50">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span>Code</span>
        <input type="text" [formControl]="code" maxlength="10">
        <nus-field-errors [control]="code"></nus-field-errors>
      </label>

      <label>
        <span>Type</span>
        <select [formControl]="type">
          <option *ngFor="let t of typeChoices" [ngValue]="t.value">{{ t.displayName }}</option>
        </select>
      </label>

      <label>
        <span>Discount Amount</span>
        <input type="number" [formControl]="amount" placeholder="Ex, 10000000">
        <nus-field-errors [control]="amount"></nus-field-errors>
      </label>

      <label>
        <span>Max Discount Amount</span>
        <input type="text" [formControl]="maxAmount" placeholder="Ex, 10000000">
        <nus-field-errors [control]="maxAmount"></nus-field-errors>
      </label>

      <label>
        <span>Discount Based On</span>
        <select [formControl]="discountBase">
          <option *ngFor="let t of discountBaseChoices" [ngValue]="t.value">{{ t.displayName }}</option>
        </select>
      </label>

      <label>
        <span>Minimum Order Amount</span>
        <input type="number" [formControl]="minimumOrderAmount" placeholder="Ex, 10000000">
        <nus-field-errors [control]="minimumOrderAmount"></nus-field-errors>
      </label>


      <label>
        <span>Maximum Usage</span>
        <select [formControl]="maxUsed">
          <option *ngFor="let t of maxUsedChoices" [ngValue]="t.value">{{ t.displayName }}</option>
        </select>
        <!--        <input type="number" [formControl]="maxUsed" placeholder="Ex, 10000000">-->
        <!--        <nus-field-errors [control]="maxUsed"></nus-field-errors>-->
      </label>

      <label>
        <span>Valid From</span>
        <input type="datetime-local" [formControl]="validFrom">
        <nus-field-errors [control]="validFrom"></nus-field-errors>
      </label>

      <label>
        <span>Valid To</span>
        <input type="datetime-local" [formControl]="validTo">
        <nus-field-errors [control]="validTo"></nus-field-errors>
      </label>

      <label>
        <span>Is Active</span>
        <input type="checkbox" [formControl]="isActive">
        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>

      <h2>
        Voucher Eligible Products
        <button type="button" class="control" (click)="uploadProductXLSX()">
          <i class="material-icons">publish</i>
          <span>Upload from XLSX</span>
        </button>
      </h2>

      <table>
        <thead>
        <tr>
          <th>#</th>
          <th>Product</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let control of products.controls; let i=index">
          <th>{{ i + 1 }}</th>
          <td>{{ control.get('name').value }}</td>
          <td>
            <button (click)="products.removeAt(i)" type="button" class="remove-button">
              <i class="material-icons">remove_circle_outline</i>
            </button>
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <button type="button" (click)="selectProduct()" class="add-button">
              Add Product
            </button>
          </td>
        </tr>
        </tbody>
      </table>

<!--      <a href="{{ service.productListDownloadUrl }}" target="_blank">Download Product List</a>-->

      <nus-detail-actions
        [component]="this"
        [hideDelete]="!!entity && entity?.href && !entity?.isActive"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>

    <!-- Modals -->
    <nus-product-selection-modal></nus-product-selection-modal>

  `,
  styles: []
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

  public entity: IVoucher;

  @ViewChild(ProductSelectionModalComponent) productSelectionModal: ProductSelectionModalComponent;

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

  initializeForm(entity?: IVoucher) {
    this.entity = entity;
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, Validators.maxLength(50)]],
      href: [entity?.href],
      type: [entity?.type, [Validators.required]],
      discountBase: [entity?.discountBase, [Validators.required]],
      code: [entity?.code, [Validators.required, Validators.maxLength(10)]],
      amount: [entity?.amount, [Validators.required, Validators.min(1)]],
      minimumOrderAmount: [entity?.minimumOrderAmount, [Validators.required, Validators.min(1)]],
      maxAmount: [entity?.maxAmount, [Validators.required, Validators.min(1)]],
      maxUsed: [entity?.maxUsed, [Validators.required, Validators.min(1)]],
      validFrom: [this.convertDateTime(entity?.validFrom), [Validators.required,]],
      validTo: [this.convertDateTime(entity?.validTo), [Validators.required,]],
      isActive: [entity?.isActive, []],
      products: this.fb.array([]),
    }, {
      validator: DiscAmountValidator
    });

    for (const prod of entity?.products ?? []) {
      this.addProduct(prod);
    }
  }

  ngAfterViewInit() {
    this.productSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed());
  }

  addProduct(product: INamedHrefEntity) {

    if ((this.products.value as Array<IProduct>).filter(p => p.href === product.href).length > 0) {
      console.log('Product already in list -- skipping');
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

  save() {
    this.form.value.validFrom = this.form.value.validFrom + this.getTimeZone();
    this.form.value.validTo = this.form.value.validTo + this.getTimeZone();
    super.save();
  }
}
