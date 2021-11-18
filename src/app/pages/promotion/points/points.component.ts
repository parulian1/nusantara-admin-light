import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {AbstractDetailComponent, DialogResult, ToastService} from '@nusantara/core';
import {IProduct} from '@nusantara/models/products';
import {IPoints, IProductPoints} from '@nusantara/models';
import {PointsService} from '@nusantara/services';
import {ProductSelectionModalComponent} from '@nusantara/shared';
import {of} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'nus-points',
  template: `
    <h1 class="title-1" i18n>Points</h1>
    <form [formGroup]="form" (ngSubmit)="save()" class="fluid">
      <nus-tabs>
        <nus-tab [title]="'Configuration'">
          <div class="points-config">

            <span class="subheading-2" i18n>Transaction Value</span>

            <div class="transaction-points">
              <label>
                <span i18n>Every transaction of</span>
                <span class="rp-text">Rp</span>
                <input type="text" mask="separator" thousandSeparator="." [formControl]="transactionAmount"
                       placeholder="x">
                <nus-field-errors [control]="transactionAmount"></nus-field-errors>
              </label>

              <label>
                <span class="customer-get" i18n>customer get</span>
                <input type="text" mask="separator" thousandSeparator="." [formControl]="point" placeholder="y Points">
                <nus-field-errors [control]="point"></nus-field-errors>
              </label>
            </div>

            <span class="subheading-2" i18n>Rounding off transaction value to points</span>

            <div class="transaction-rounding">
              <label [ngClass]="{'active': rounding === 'up'}" i18n>
                <input type="radio" id="tab_rounding_up" value="up" formControlName="rounding">
                Rounding Up
              </label>

              <label [ngClass]="{'active': rounding === 'down'}" i18n>
                <input type="radio" id="tab_rounding_down" value="down" formControlName="rounding">
                Rounding Down
              </label>

              <label [ngClass]="{'active': rounding === 'nearest'}" i18n>
                <input type="radio" id="tab_nearest" value="nearest" formControlName="rounding">
                Nearest
              </label>
            </div>


            <div class="rounding-description">
              <ul>
                <li i18n><i class="material-icons">info_outline</i>Pembulatan ke atas (Rounding Up): Jika nilainya Rp 1,6x,
                  maka pelanggan mendapatkan 2y point
                </li>
                <li i18n><i class="material-icons">info_outline</i>Pembulatan ke bawah (Rounding Down): Jika nilainya Rp
                  1,6x, maka pelanggan mendapatkan 1y point
                </li>
                <li i18n><i class="material-icons">info_outline</i>Pembulatan terdekat (Nearest): Jika nilainya Rp 1,6x,
                  maka pelanggan mendapatkan 2y point dan Jika nilainya Rp 1,4x, maka pelanggan mendapatkan 1y point
                </li>
              </ul>
            </div>

            <div class="earning-points">
              <span class="subheading-2" i18n>Earning Points Platform</span>
              <label class="checkbox">
                <input type="checkbox" [formControl]="appliedOnOnline" name="appliedOnOnline">
                <span i18n>Online (Website)</span>
              </label>
              <label class="checkbox">
                <input type="checkbox" [formControl]="appliedOnOffline" name="appliedOnOffline">
                <span i18n>Offline (POS)</span>
              </label>
            </div>

            <div class="points-expire">
              <span class="subheading-2" i18n>Points Expire</span>
              <label [ngClass]="{'active': expireType === 'never'}" class="radio" i18n>
                <input type="radio" id="tab_never" value="never" formControlName="expireType">
                Never
              </label>
              <label [ngClass]="{'active': expireType === 'after_earning'}" class="radio">
                <input type="radio" id="tab_after_earning" value="after_earning" formControlName="expireType" i18n>
                After earning
                <input type="number" class="expire-at" [(ngModel)]="expireAtAfterEarning"
                       [ngModelOptions]="{standalone: true}" [hidden]="expireType !== 'after_earning'"
                       placeholder="x Days">
                <span class="subheading-2" [hidden]="expireType !== 'after_earning'" i18n>Days</span>
              </label>

              <label [ngClass]="{'active': expireType === 'customer_not_active'}" class="radio">
                <input type="radio" id="tab_customer_not_active" value="customer_not_active"
                        formControlName="expireType" i18n>
                If customer not active
                <input type="number" class="expire-at" [(ngModel)]="expireAtCustomerNotActive"
                       [ngModelOptions]="{standalone: true}" [hidden]="expireType !== 'customer_not_active'"
                       placeholder=" x Days">
                <span class="subheading-2" [hidden]="expireType !== 'customer_not_active'" i18n>Days</span>
              </label>

              <label [ngClass]="{'active': expireType === 'every_year'}" class="radio">
                <input type="radio" id="tab_every_year" value="every_year" formControlName="expireType" i18n>
                Every year on
                <input type="text" mask="d0-m0" [dropSpecialCharacters]="false" class="expire-at"
                       [(ngModel)]="expireAtEveryYear" [ngModelOptions]="{standalone: true}"
                       [hidden]="expireType !== 'every_year'" placeholder="dd-mm">
              </label>
            </div>
          </div>
        </nus-tab>
        <nus-tab [title]="'Products'">
          <div class="product-table">
            <p class="subheading-2" i18n>Products that can be exchanged for points</p>
            <div class="product-table__search control">
              <i class="material-icons">search</i>
              <input type="search" placeholder="Search Product Name or SKU" [formControl]="queryText">
            </div>
            <table>
              <thead>
                <tr>
                  <th i18n>Product</th>
                  <th i18n>Product Price</th>
                  <th i18n>Points</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <nus-product-points
                  *ngFor="let control of filteredProducts$; let i=index"
                  [form]="control"
                  (remove)="removeProduct(i)"
                ></nus-product-points>
                <tr>
                  <td colspan="4">
                    <button type="button" (click)="selectProduct()" class="new-add-button wide" i18n>
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

    .product-table__search {
      display: flex;
      border: solid 1px var(--grey);
      background-color: transparent;
      align-items: center;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .product-table__search > i {
      background-color: white;
      color: var(--nav-background);
      line-height: 31px;
      padding-left: 13px;
    }
    .product-table__search > input[type=search] {
      border: none !important;
    }

  `]
})
export class PointsComponent extends AbstractDetailComponent<IPoints> implements OnInit, AfterViewInit {

  @ViewChild(ProductSelectionModalComponent) productSelectionModal: ProductSelectionModalComponent;

  entity: IPoints;
  productPoints: Array<IProductPoints>;
  control: FormGroup;

  timeoutId: any;
  reloadTimeout = 650;
  queryText = new FormControl('');
  filteredProducts$: AbstractControl[];

  expireAtAfterEarning: string;
  expireAtCustomerNotActive: string;
  expireAtEveryYear: string;

  constructor(route: ActivatedRoute,
              router: Router,
              service: PointsService,
              toast: ToastService,
              public fb: FormBuilder) {
    super(route, router, toast, service);
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

  get products(): FormArray {
    return this.form.get('products') as FormArray;
  }

  clearExpiredInput() {
    // Clear expire-at input when expire type change
    this.form.get('expireType').valueChanges.subscribe(() => {
      this.expireAtAfterEarning = '';
      this.expireAtCustomerNotActive = '';
      this.expireAtEveryYear = '';
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((data: { entity: IPoints }) => {
      this.entity = data.entity;
      this.productPoints = data.entity.products;
    });
    this.clearExpiredInput();
    this.queryText.valueChanges.subscribe(
      (newValue) => { this.onQueryTextChanged(newValue); }
    );
  }

  ngAfterViewInit() {
    this.productSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed());
  }

  initializeForm(entity?: IPoints, productPoints?: IProductPoints) {
    this.form = this.fb.group({
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

    // need to mark as touched to make custom styling works
    this.form.controls.rounding.markAsTouched();
    this.form.controls.appliedOnOnline.markAsTouched();
    this.form.controls.appliedOnOffline.markAsTouched();
    this.form.controls.appliedOnApps.markAsTouched();
    this.form.controls.expireType.markAsTouched();

    this.expireAtAfterEarning = entity?.expireAt;
    this.expireAtCustomerNotActive = entity?.expireAt;
    this.expireAtEveryYear = entity?.expireAt;

    this.filteredProducts$ = this.products.controls;
  }

  selectProduct() {
    this.productSelectionModal.open();
  }

  addProduct(product?: IProductPoints): void {
    const basePrice = this.getProductBasePrice(product?.product.priceLists);
    const f = this.fb.group({
      product: this.fb.group({
        href: [product?.product.href, []],
        name: [product?.product.name, []],
        price: [basePrice, []],
        upc: [product?.product.upc, []]
      }),
      amount: [product?.amount, [Validators.required, Validators.min(1)]]
    });

    this.products.push(f);
  }

  onProductSelectionModalClosed() {
    if (this.productSelectionModal.result === DialogResult.OK) {

      const selectedProduct = this.productSelectionModal.product.value as IProduct;
      const basePrice = this.getProductBasePrice(selectedProduct.priceLists);

      const checkDuplicate = this.products.controls.filter(data => data.value.product.href === selectedProduct.href);
      if (checkDuplicate.length > 0) {
        this.toast?.addError('Product ' + selectedProduct.name + ' is already on the list!', 'Failed to add product');
        return;
      }

      const f = this.fb.group({
        product: this.fb.group({
          name: [selectedProduct.name, []],
          href: [selectedProduct.href, []],
          price: [basePrice, []],
          upc: [selectedProduct.upc, []]
        }),
        amount: [0, [Validators.required, Validators.min(1)]]
      });

      this.products.push(f);
      this.onQueryTextChanged(this.queryText.value);
    }
  }

  save() {

    if (this.expireType === 'never') {
      this.form.value.expireAt = '';
    }
    if (this.expireType === 'after_earning') {
      this.form.value.expireAt = this.expireAtAfterEarning;
    }
    if (this.expireType === 'customer_not_active') {
      this.form.value.expireAt = this.expireAtCustomerNotActive;
    }
    if (this.expireType === 'every_year') {
      this.form.value.expireAt = this.expireAtEveryYear;
    }

    super.save();
  }

  removeProduct(i: number): void {
    const selectedProduct = this.filteredProducts$[i].value;
    const index = this.products.value.findIndex( p => p.product.name === selectedProduct.product.name);
    this.products.removeAt(index);
    this.onQueryTextChanged(this.queryText.value);
  }

  getProductBasePrice(priceLists: Array<any>) {
    const priceData = priceLists.find(obj => {
      return obj.type === 'default';
    });
    let basePrice = 0;
    if (priceData !== undefined) {
      const priceRange = priceData.ranges.find(range => {
        return range.minQuantity === 1;
      });

      if (priceRange !== undefined) {
        basePrice = priceRange.price;
      }
    }

    return basePrice;
  }

  onQueryTextChanged(newValue: string) {

    if (!!this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    // don't run if the value hasn't actually changed from the original.
    if (newValue === '') {
      this.filteredProducts$ = this.products.controls;
    } else {
      this.timeoutId = setTimeout(() => {
        // wait to see if the user is still typing more before searching
        of(this.products.controls).pipe(
          map((products: AbstractControl[]) =>
            products.filter((group: AbstractControl) => {
              const product = group.get('product');
              return product.get('name').value
                .toLowerCase()
                .includes(this.queryText.value.toLowerCase()) || product.get('upc').value
                .toLowerCase()
                .includes(this.queryText.value.toLowerCase());
            })
          )
        ).subscribe(val => this.filteredProducts$ = val);
      }, this.reloadTimeout);
    }
  }
}
