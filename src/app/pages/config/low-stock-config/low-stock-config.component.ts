import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {AbstractDetailComponent, DialogResult, ToastService} from '@nusantara/core';
import {ICustomThresholdProduct, ILowStock, IProduct} from '@nusantara/models/products';
import {LowStockService} from '@nusantara/services/low-stock.service';
import {drf, IWarehouse} from '@nusantara/models';
import {ProductSelectionModalComponent} from "@nusantara/shared";

@Component({
  selector: 'nus-low-stock-config',
  template: `
    <nus-page-title i18n-title title="Low Stock Config"></nus-page-title>
    <form [formGroup]="form" (ngSubmit)="save()" class="fluid">
      <div class="container">
        <div class="low-stock-config">
          <label class="toggle">
            <input type="checkbox"
                   class="toggle"
                   [formControl]="isActive"
                   name="is-active"/>
            <span i18n>Is Active</span>
            <nus-field-errors [control]="isActive"></nus-field-errors>
          </label>

          <label>
            <span i18n>General Threshold</span>
            <input type="text" placeholder="insert quantity threshold" [formControl]="quantity">
            <nus-field-errors [control]="quantity"></nus-field-errors>
          </label>

          <label class="checkbox">
            <input type="checkbox" [formControl]="customThreshold" name="customThreshold">
            <span i18n>Custom threshold</span>
          </label>

          <table *ngIf="customThreshold.value == true" class="customThresholdProduct">
            <thead>
              <tr>
                <th i18n>Name</th>
                <th i18n>UPC</th>
                <th i18n>Threshold</th>
                <th class="action" i18n>Remove</th>
              </tr>
            </thead>
            <tbody>
              <nus-custom-threshold-product
                *ngFor="let control of customThresholdProducts?.controls; let i=index"
                [form]="control"
                (remove)="this.customThresholdProducts.removeAt(i)"
              ></nus-custom-threshold-product>
              <tr>
                <td colspan="4">
                  <button type="button" (click)="selectProduct()" class="new-add-button wide" i18n>
                    <i class="material-icons">add</i> Add Product
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <label>
            <span i18n>Email Alert</span>
            <p i18n class="body-2">Send daily email notification when stock is low. / Email notification will be send
              regularly every 6 am</p>
            <div class="email-input">
              <input type="text"
                     placeholder="insert email to receive daily notification"
                     (keydown)="removeChipAlert()"
                     (keydown.enter)="addChips()"
                     [formControl]="email"
                     #emailInput>
              <button type="button" class="control" [disabled]="!this.email.valid" (click)="addChips()">Add</button>
            </div>
            <div class="email-chip-error">{{emailChipError}}</div>
            <nus-field-errors [control]="email"></nus-field-errors>
          </label>

          <div class="email-chips">
            <div class="email-chip-item" *ngFor="let email of emails.value; let i=index">
              <span>{{email}}</span>
              <button type="button" class="remove-button" (click)="removeChips(email)">
                <i class="material-icons">highlight_off</i>
              </button>
            </div>
          </div>

          <p class="body-2">
            You can view reports and lists of low stock products in the report menu or click <a [routerLink]="['/reports/low-stock-products']">here</a>
          </p>
        </div>
      </div>
      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()" [hideDelete]="true">
      </nus-detail-actions>
    </form>

    <nus-product-selection-modal></nus-product-selection-modal>
  `,
  styles: [
    `
      .container {
        display: grid;
        grid-template-columns: 4fr 1fr;
        grid-gap: 24px;
        margin-bottom: 16px;
      }

      .low-stock-config .checkbox {
        min-height: 0;
      }

      .low-stock-config label .email-input {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      .low-stock-config label .email-input input {
        margin-right: 14px;
      }

      .low-stock-config label .email-chip-error {
        font-size: 11px;
        color: var(--error);
      }

      .low-stock-config .email-chips {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 16px;
      }

      .low-stock-config .email-chips .email-chip-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        background: var(--darken-white);
        border-radius: 24px;
        padding: 6px 8px;
        margin: 4px 2px 0 0;
      }

      .low-stock-config .email-chips .email-chip-item span {
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
        color: var(--darken-grey);
      }

      .low-stock-config .email-chips .email-chip-item button {
        background: none;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
      }

      .low-stock-config button[type=submit] {
        width: 280px;
      }

      .customThresholdProduct {
        margin: 18px 0;
      }
    `,
    'table { table-layout: fixed }',
    'td { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    'th.action, td.action { width: 5%; }'
  ]
})
export class LowStockConfigComponent extends AbstractDetailComponent<ILowStock> {
  @ViewChild(ProductSelectionModalComponent) productSelectionModal: ProductSelectionModalComponent;
  @ViewChild('emailInput') emailInput: ElementRef;

  entity: ILowStock;
  warehouses: Array<{ href: string, name: string, code: string }>;
  subLocationTypes: Array<drf.IChoice>;

  emailChipError = '';

  constructor(route: ActivatedRoute,
              router: Router,
              service: LowStockService,
              toast: ToastService,
              public fb: FormBuilder) {
    super(route, router, toast, service);
  }

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get isActive(): FormControl {
    return this.form.get('isActive') as FormControl;
  }

  get quantity(): FormControl {
    return this.form.get('quantity') as FormControl;
  }

  get emails(): FormArray {
    return this.form.get('emails') as FormArray;
  }

  get customThreshold(): FormControl {
    return this.form.get('customThreshold') as FormControl;
  }

  get customThresholdProducts(): FormArray {
    return this.form.get('customThresholdProducts') as FormArray;
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.route.data.subscribe((data: {
      entity: ILowStock,
      subLocationTypes: drf.IChoice[],
      allWarehouses: IWarehouse[]
    }) => {
      this.entity = data.entity;
      this.subLocationTypes = data.subLocationTypes;
      this.warehouses = data.allWarehouses;
    });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.productSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed());
  }

  initializeForm(entity?: ILowStock) {
    this.form = this.fb.group({
      href: [entity?.href, []],
      isActive: [entity?.isActive, []],
      quantity: [entity?.quantity, [Validators.required, Validators.min(1), Validators.pattern(`^\\d+$`)]],
      email: [entity?.email, [Validators.pattern(`^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$`)]],
      emails: this.fb.array([]),
      customThreshold: [false, []],
      customThresholdProducts: this.fb.array([])
    });

    entity?.customThresholdProducts.forEach((value) => {
      this.addProduct(value);
    });
    if (entity?.customThresholdProducts.length > 0) {
      this.form.get('customThreshold').setValue(true);
    }

    this.form.controls.isActive.markAsTouched();
    this.form.controls.customThreshold.markAsTouched();

    entity?.emails.forEach(value => {
      this.emails.push(this.fb.control(value.toLowerCase(), []));
    });
  }

  addChips() {
    if (this.emailInput.nativeElement.value === '') {
      return;
    }

    if (this.emails.value.findIndex(item => item === this.email.value) !== -1) {
      this.emailChipError = 'Email already inserted. Please check again';
      return;
    }

    if (this.email.valid) {
      this.emails.push(this.fb.control(this.email.value.toLowerCase(), []));
      this.emailInput.nativeElement.value = '';
    } else {
      this.emailChipError = 'Invalid email. Please enter valid email.';
    }
  }

  removeChips(email: string) {
    const index = this.emails.value.findIndex(item => item === email);
    this.emails.removeAt(index);
  }

  removeChipAlert() {
    this.emailChipError = '';
  }

  selectProduct() {
    this.productSelectionModal.open();
  }

  addProduct(product?: ICustomThresholdProduct): void {
    const f = this.fb.group({
      product: this.fb.group({
        href: [product?.product.href, []],
        name: [product?.product.name, []],
        upc: [product?.product.upc, []]
      }),
      amount: [product?.amount, [Validators.required, Validators.min(1)]]
    });

    this.customThresholdProducts.push(f);
  }

  onProductSelectionModalClosed() {
    if (this.productSelectionModal.result === DialogResult.OK) {

      const selectedProduct = this.productSelectionModal.product.value as IProduct;

      const checkDuplicate = this.customThresholdProducts.controls.filter(data => data.value.product.href === selectedProduct.href);
      if (checkDuplicate.length > 0) {
        this.toast?.addError('Product ' + selectedProduct.name + ' is already on the list!', 'Failed to add product');
        return;
      }

      const f = this.fb.group({
        product: this.fb.group({
          name: [selectedProduct.name, []],
          href: [selectedProduct.href, []],
          upc: [selectedProduct.upc, []]
        }),
        amount: [1, [Validators.required, Validators.min(1)]]
      });

      this.customThresholdProducts.push(f);
    }
  }
}
