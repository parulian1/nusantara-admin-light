import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractDetailComponent, DialogResult, ToastService } from '@nusantara/core';
import { IProduct } from '@nusantara/models/products';
import { IPoints, IProductPoints } from '@nusantara/models';
import { PointsService } from '@nusantara/services';
import { ProductSelectionModalComponent } from '@nusantara/shared';

@Component({
  selector: 'nus-points',
  template: `
    <h2>Points</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <nus-tabs>
        <nus-tab [title]="'Configuration'">
          <div class="points-config">

            <div class="points-name">
              <label>
                <span>Points Name</span>
                <input type="text" [formControl]="name" maxlength="50" placeholder="Points Name">
                <nus-field-errors [control]="name"></nus-field-errors>
              </label>
            </div>

            <span class="subtitle">Transaction Value</span>

            <div class="transaction-points">
              <label>
                <span>Every transaction of</span>
                <span class="rp-text">Rp</span>
                <input type="text" [formControl]="transactionAmount" maxlength="50" placeholder="x">
                <nus-field-errors [control]="transactionAmount"></nus-field-errors>
              </label>

              <label>
                <span class="customer-get">customer get</span>
                <input type="text" [formControl]="point" maxlength="50" placeholder="y Points">
                <nus-field-errors [control]="point"></nus-field-errors>
              </label>
            </div>

            <span class="subtitle">Rounding off transaction value to points</span>

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

            <span class="subtitle">Earning Points Platform</span>

            <div class="points-platform">
              <label>
                <input type="checkbox" [formControl]="appliedOnOnline" name="appliedOnOnline">
                <span>Online</span>
              </label>

              <label>
                <input type="checkbox" [formControl]="appliedOnOffline" name="appliedOnOffline">
                <span>Offline</span>
              </label>

              <label>
                <input type="checkbox" [formControl]="appliedOnApps" name="appliedOnApps">
                <span>Apps</span>
              </label>
            </div>

            <span class="subtitle">Points Expire</span>

            <div class="points-expire">
              <label [ngClass]="{'active': expireType === 'never'}">
                <input type="radio" id="tab_never" value="never" formControlName="expireType">
                Never
              </label>

              <label [ngClass]="{'active': expireType === 'after_earning'}">
                <input type="radio" id="tab_after_earning" value="after_earning" formControlName="expireType">
                After earning
                <input type="text" class="expire-at" [formControl]="expireAt" [hidden]="expireType !== 'after_earning'"
                       placeholder="x Days">
              </label>

              <label [ngClass]="{'active': expireType === 'customer_not_active'}">
                <input type="radio" id="tab_customer_not_active" value="customer_not_active"
                       formControlName="expireType">
                If customer not active
                <input type="text" class="expire-at" [formControl]="expireAt"
                       [hidden]="expireType !== 'customer_not_active'" placeholder=" x Days">
              </label>

              <label [ngClass]="{'active': expireType === 'every_year'}">
                <input type="radio" id="tab_every_year" value="every_year" formControlName="expireType">
                Every year on
                <input type="text" class="expire-at" [formControl]="expireAt"
                       [hidden]="expireType !== 'every_year'" maxlength=" 50" placeholder="x Days">
              </label>
            </div>


          </div>
        </nus-tab>
        <nus-tab [title]="'Products'">
          <span class="subtitle">Products that can be exchanged for points</span>
          <table class="product-table">
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
              <td>
                <button type="button" (click)="selectProduct()" class="add-button">
                  Add Product
                </button>
              </td>
            </tr>
            </tbody>
          </table>
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
    ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: #E7E7E7;
      opacity: 1; /* Firefox */
    }

    :-ms-input-placeholder { /* Internet Explorer 10-11 */
      color: #E7E7E7;
    }

    ::-ms-input-placeholder { /* Microsoft Edge */
      color: #E7E7E7;
    }

    .points-name > label > span {
      font-size: 14px;
      font-weight: bold;
      line-height: 20px;
    }

    label > input {
      border-radius: 8px;
      font-family: Lato, sans-serif;
      font-size: 14px;
      line-height: 22px;
      margin: 12px 0;
      min-height: 48px;
    }

    .transaction-points {
      align-items: center;
      display: flex;
    }

    .transaction-points > label {
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

    .transaction-rounding {
      display: flex;
      align-items: center;
    }

    .transaction-rounding > label:first-child {
      margin-right: 30px;
    }

    .transaction-rounding > label:not(:first-child) {
      margin: 0 30px;
    }

    .transaction-rounding > label {
      align-items: center;
      display: flex;
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

    .points-platform > label {
      display: flex;
      align-items: center;
      cursor: pointer;
      min-height: auto;
      height: 48px;
      width: fit-content;
    }

    .points-platform > label > input {
      margin-right: 12px;
      width: 16px;
      height: 16px;
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
      grid-template-columns: auto 200px auto;
      grid-template-rows: auto;
    }

    .points-expire > label > input {
      height: 18px;
      margin-right: 11px;
      min-height: auto;
      width: 18px;
    }

    .points-expire > label > input.expire-at {
      height: 48px;
      margin-right: 11px;
      min-height: auto;
      width: 200px;
      border-radius: 8px;
    }

    .subtitle {
      font-size: 14px;
      font-weight: bold;
      margin-top: 16px;
      line-height: 20px;
      color: #485368;
    }

    .rp-text {
      background-color: #F4F4F4;
      border: 1px solid #E7E7E7;
      border-radius: 8px;
      color: #282828;
      display: flex;
      font-size: 14px;
      font-weight: 400;
      justify-content: center;
      line-height: 22px;
      margin: 0 7px 0 30px;
      padding: 13px 8px;
      width: 30px;
    }

    table.product-table {
      margin-top: 12px;
    }

    table.product-table > tbody > tr > td > button {
      cursor: pointer;
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

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get transactionAmount(): FormControl { return this.form.get('transactionAmount') as FormControl; }
  get point(): FormControl { return this.form.get('point') as FormControl; }
  get rounding(): string { return this.form.get('rounding').value; }
  get appliedOnOnline(): FormControl { return this.form.get('appliedOnOnline') as FormControl; }
  get appliedOnOffline(): FormControl { return this.form.get('appliedOnOffline') as FormControl; }
  get appliedOnApps(): FormControl { return this.form.get('appliedOnApps') as FormControl; }
  get expireType(): string { return this.form.get('expireType').value; }
  get expireAt(): FormControl { return this.form.get('expireAt') as FormControl; }
  get products(): FormArray { return this.form.get('products') as FormArray; }

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
      expireAt: [entity?.expireAt, []],
      products: this.fb.array([])
    });

    entity?.products.forEach((value) => {
      this.addProduct(value);
    });
  }

  selectProduct() {
    this.productSelectionModal.open();
  }

  addProduct(product?: IProductPoints): void {
    const f = this.fb.group({
      href: [product?.product.href, []],
      name: [product?.product.name, []],
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
    super.save();
  }

  removeProduct(i: number): void {
    this.products.removeAt(i);
  }
}
