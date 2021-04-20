import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {AbstractDetailComponent, DialogResult, ToastService} from '@nusantara/core';
import {IProduct} from '@nusantara/models/products';
import {IPoints, IProductPoints} from '@nusantara/models';
import {PointsService} from '@nusantara/services';
import {ProductSelectionModalComponent} from '@nusantara/shared';

@Component({
  selector: 'nus-points',
  template: `
    <h1 class="title-1">Points</h1>
    <form [formGroup]="form" (ngSubmit)="save()">
      <nus-tabs>
        <nus-tab [title]="'Configuration'">
          <div class="points-config">

            <label>
              <span>Points Name</span>
              <input type="text" [formControl]="name" maxlength="50" placeholder="Points Name">
              <nus-field-errors [control]="name"></nus-field-errors>
            </label>

            <span class="subheading-2">Transaction Value</span>

            <div class="transaction-points">
              <label>
                <span>Every transaction of</span>
                <span class="rp-text">Rp</span>
                <input type="text" mask="separator" thousandSeparator="." [formControl]="transactionAmount"
                       placeholder="x">
                <nus-field-errors [control]="transactionAmount"></nus-field-errors>
              </label>

              <label>
                <span class="customer-get">customer get</span>
                <input type="text" mask="separator" thousandSeparator="." [formControl]="point" placeholder="y Points">
                <nus-field-errors [control]="point"></nus-field-errors>
              </label>
            </div>

            <span class="subheading-2">Rounding off transaction value to points</span>

            <div class="transaction-rounding">
              <label [ngClass]="{'active': rounding === 'up'}">
                <input type="radio" id="tab_rounding_up" value="up" formControlName="rounding">
                Rounding Up
              </label>

              <label [ngClass]="{'active': rounding === 'down'}">
                <input type="radio" id="tab_rounding_down" value="down" formControlName="rounding">
                Rounding Down
              </label>

              <label [ngClass]="{'active': rounding === 'nearest'}">
                <input type="radio" id="tab_nearest" value="nearest" formControlName="rounding">
                Nearest
              </label>
            </div>


            <div class="rounding-description">
              <ul>
                <li><i class="material-icons">info_outline</i>Pembulatan ke atas (Rounding Up): Jika nilainya Rp 1,6x,
                  maka pelanggan mendapatkan 2y point
                </li>
                <li><i class="material-icons">info_outline</i>Pembulatan ke bawah (Rounding Down): Jika nilainya Rp
                  1,6x, maka pelanggan mendapatkan 1y point
                </li>
                <li><i class="material-icons">info_outline</i>Pembulatan terdekat (Nearest): Jika nilainya Rp 1,6x,
                  maka pelanggan mendapatkan 2y point dan Jika nilainya Rp 1,4x, maka pelanggan mendapatkan 1y point
                </li>
              </ul>
            </div>

            <div class="earning-points">
              <span class="subheading-2">Earning Points Platform</span>
              <label class="checkbox">
                <input type="checkbox" [formControl]="appliedOnOnline" name="appliedOnOnline">
                <span>Online (Website)</span>
              </label>
              <label class="checkbox">
                <input type="checkbox" [formControl]="appliedOnOffline" name="appliedOnOffline">
                <span>Offline (POS)</span>
              </label>
            </div>

            <div class="points-expire">
              <span class="subheading-2">Points Expire</span>
              <label [ngClass]="{'active': expireType === 'never'}" class="radio">
                <input type="radio" id="tab_never" value="never" formControlName="expireType">
                Never
              </label>
              <label [ngClass]="{'active': expireType === 'after_earning'}" class="radio">
                <input type="radio" id="tab_after_earning" value="after_earning" formControlName="expireType">
                After earning
                <input type="number" class="expire-at" [formControl]="expireAtAfterEarning"
                        [hidden]="expireType !== 'after_earning'"
                        placeholder="x Days">
                <span class="subheading-2" [hidden]="expireType !== 'after_earning'">Days</span>
              </label>

              <label [ngClass]="{'active': expireType === 'customer_not_active'}" class="radio">
                <input type="radio" id="tab_customer_not_active" value="customer_not_active"
                        formControlName="expireType">
                If customer not active
                <input type="number" class="expire-at" [formControl]="expireAtCustomerNotActive"
                        [hidden]="expireType !== 'customer_not_active'" placeholder=" x Days">
                <span class="subheading-2" [hidden]="expireType !== 'customer_not_active'">Days</span>
              </label>

              <label [ngClass]="{'active': expireType === 'every_year'}" class="radio">
                <input type="radio" id="tab_every_year" value="every_year" formControlName="expireType">
                Every year on
                <input type="text" mask="d0-m0" [dropSpecialCharacters]="false" class="expire-at"
                       [formControl]="expireAtEveryYear" [hidden]="expireType !== 'every_year'" placeholder="dd-mm">
              </label>
            </div>
          </div>
        </nus-tab>
        <nus-tab [title]="'Products'">
          <div class="product-table">
            <p class="subheading-2">Products that can be exchanged for points</p>
            <table>
              <thead>
              <tr>
                <th>Product</th>
                <th>Points</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <nus-product-points
                *ngFor="let control of products.controls; let i=index"
                [form]="control"
                (remove)="removeProduct(i)"
              ></nus-product-points>
              <tr>
                <td colspan="3">
                  <button type="button" (click)="selectProduct()" class="new-add-button wide">
                    <i class="material-icons">add</i> Add Product
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </nus-tab>
      </nus-tabs>
      <nus-detail-actions
        [component]="this"
        [hideDelete]="true"
        (cancel)="navigateToParent(true)">
      </nus-detail-actions>

      <nus-product-selection-modal></nus-product-selection-modal>

    </form>
  `,
  styles: [`
    .points-config, .product-table {
      margin-top: 20px;
    }
    .checkbox, .radio {
      padding: 10px 0;
      min-height: auto;
    }

    .radio {
      height: 60px;
    }

    .product-table > p {
      margin-bottom: 5px;
    }

    .earning-points {
      margin-bottom: 16px;
    }

    .transaction-points, .transaction-points > label,
    .transaction-rounding, .transaction-rounding > label {
      align-items: center;
      display: flex;
    }

    .transaction-points > label > input {
      max-width: 150px;
    }

    .transaction-points > label > span {
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
    }

    .transaction-points > label > span.customer-get {
      margin: 0 7px;
    }

    .transaction-rounding > label:first-child {
      margin-right: 30px;
    }

    .transaction-rounding > label:not(:first-child) {
      margin: 0 30px;
    }

    .transaction-rounding > label {
      cursor: pointer;
    }

    .transaction-rounding > label > input {
      height: 18px;
      margin-right: 11px;
      min-height: auto;
      width: 18px;
    }

    .rounding-description {
      font-size: 12px;
      font-weight: 300;
      line-height: 20px;
      margin-bottom: 20px;
    }

    .rounding-description > ul {
      list-style-type: none;
      padding: 0;
    }

    .rounding-description > ul > li {
      display: flex;
      align-items: center;
      margin: 8px 0;
    }

    .rounding-description > ul > li > i {
      margin-right: 12px;
    }

    .points-expire {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
    }

    .points-expire > label {
      align-items: center;
      cursor: pointer;
      display: grid;
      grid-template-columns: auto 200px auto auto;
      grid-template-rows: auto;
    }

    .points-expire > label > input {
      margin-right: 11px;
      min-height: auto;
    }

    .points-expire > label > input.expire-at {
      width: 200px;
    }

    .rp-text {
      background-color: var(--darken-white);
      border: 1px solid var(--lighten-grey);
      border-radius: 8px;
      color: var(--lighten-black);
      display: flex;
      font-size: 14px;
      font-weight: 400;
      justify-content: center;
      line-height: 22px;
      margin: 0 7px 0 30px;
      padding: 13px 8px;
      width: 30px;
    }

  `]
})
export class PointsComponent extends AbstractDetailComponent<IPoints> implements OnInit, AfterViewInit {

  @ViewChild(ProductSelectionModalComponent) productSelectionModal: ProductSelectionModalComponent;

  entity: IPoints;
  productPoints: Array<IProductPoints>;
  control: FormGroup;

  constructor(route: ActivatedRoute,
              router: Router,
              service: PointsService,
              toast: ToastService,
              public fb: FormBuilder) {
    super(route, router, toast, service);
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get transactionAmount(): FormControl {
    return this.form.get('transactionAmount') as FormControl;
  }

  get point(): FormControl {
    return this.form.get('point') as FormControl;
  }

  get rounding(): string {
    return this.form.get('rounding').value;
  }

  get appliedOnOnline(): FormControl {
    return this.form.get('appliedOnOnline') as FormControl;
  }

  get appliedOnOffline(): FormControl {
    return this.form.get('appliedOnOffline') as FormControl;
  }

  get appliedOnApps(): FormControl {
    return this.form.get('appliedOnApps') as FormControl;
  }

  get expireType(): string {
    return this.form.get('expireType').value;
  }

  get expireAtAfterEarning(): FormControl {
    return this.form.get('expireAtAfterEarning') as FormControl;
  }

  get expireAtCustomerNotActive(): FormControl {
    return this.form.get('expireAtCustomerNotActive') as FormControl;
  }

  get expireAtEveryYear(): FormControl {
    return this.form.get('expireAtEveryYear') as FormControl;
  }

  get products(): FormArray {
    return this.form.get('products') as FormArray;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((data: { entity: IPoints }) => {
      this.entity = data.entity;
      this.productPoints = data.entity.products;
    });
  }

  ngAfterViewInit() {
    this.productSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed());
  }

  initializeForm(entity?: IPoints, productPoints?: IProductPoints) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, Validators.maxLength(50)]],
      href: [entity?.href, []],
      transactionAmount: [entity?.transactionAmount, [Validators.required]],
      point: [entity?.point, [Validators.required]],
      rounding: [entity?.rounding ?? 'up', [Validators.required]],
      appliedOnOnline: [entity?.appliedOnOnline ?? false, []],
      appliedOnOffline: [entity?.appliedOnOffline ?? false, []],
      appliedOnApps: [entity?.appliedOnApps ?? false, []],
      expireType: [entity?.expireType ?? 'never', [Validators.required]],
      expireAtAfterEarning: [entity?.expireAt, []],
      expireAtCustomerNotActive: [entity?.expireAt, []],
      expireAtEveryYear: [entity?.expireAt, []],
      expireAt: [entity?.expireAt, []],
      products: this.fb.array([])
    });

    entity?.products.forEach((value) => {
      this.addProduct(value);
    });


    // need to mark as touched to make custom styling works
    this.form.controls.rounding.markAsTouched();
    this.form.controls.appliedOnOnline.markAsTouched();
    this.form.controls.appliedOnOffline.markAsTouched();
    this.form.controls.appliedOnApps.markAsTouched();
    this.form.controls.expireType.markAsTouched();
  }

  selectProduct() {
    this.productSelectionModal.open();
  }

  addProduct(product?: IProductPoints): void {
    const f = this.fb.group({
      product: this.fb.group({
        href: [product?.product.href, []],
        name: [product?.product.name, []],
      }),
      amount: [product?.amount, []]
    });

    this.products.push(f);
  }

  onProductSelectionModalClosed() {
    if (this.productSelectionModal.result === DialogResult.OK) {

      const selectedProduct = this.productSelectionModal.product.value as IProduct;

      const f = this.fb.group({
        product: this.fb.group({
          name: [selectedProduct.name, []],
          href: [selectedProduct.href, []]
        }),
        amount: [0, []]
      });

      this.products.push(f);
    }
  }

  save() {

    if (this.expireType === 'never') {
      this.form.value.expireAt = '';
    }
    if (this.expireType === 'after_earning') {
      this.form.value.expireAt = this.form.value.expireAtAfterEarning;
    }
    if (this.expireType === 'customer_not_active') {
      this.form.value.expireAt = this.form.value.expireAtCustomerNotActive;
    }
    if (this.expireType === 'every_year') {
      this.form.value.expireAt = this.form.value.expireAtEveryYear;
    }

    super.save();
  }

  removeProduct(i: number): void {
    this.products.removeAt(i);
  }
}
