import {AbstractDetailComponent, DialogResult, ToastService} from '@nusantara/core';
import {IAdvancedPriceList, IAdvancedPriceListProduct} from '@nusantara/models/products/advanced-price-list';
import {AdvancedPriceListService} from '@nusantara/services';
import {ActivatedRoute, Router} from '@angular/router';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {INamedHrefEntity, IWarehouse} from '@nusantara/models';
import {IProduct} from '@nusantara/models/products';
import {ProductSelectionModalComponent} from '@nusantara/shared';
import {AdvancedPriceWarehouseModalComponent} from '@nusantara/pages/catalog/advanced-price/advanced-price-warehouse-modal.component';
import {getProductBasePrice} from '@nusantara/shared/helpers';

@Component({
  selector: 'nus-advanced-price-detail',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Advanced Price">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()" class="fluid">
      <nus-tabs>
        <nus-tab [title]="'General Setting'">
          <div id="general-info-wrapper" class="wrapper">
            <h2 class="heading-1">General Information</h2>
            <label class="toggle">
              <input id="s2"
                     type="checkbox"
                     class="toggle"
                     [formControl]="isActive"
                     name="is-active"
                     data-qa="is-active"/>
              <span>Is Active</span>
              <nus-field-errors [control]="isActive"></nus-field-errors>
            </label>
            <label>
              <span>Name</span>
              <input type="text" [formControl]="name" maxlength="50">
              <nus-field-errors [control]="name"></nus-field-errors>
            </label>
          </div>
          <div id="setting-wrapper" class="wrapper">
            <div *ngIf="!this.isNew" class="non-field-warning">
              <span class="body-2" i18n>This section can't be edited, please create a new one to make changes.</span>
            </div>
            <h2 class="heading-1">Setting</h2>
            <div id="warehouse-wrapper">
              <label>
                <span i18n>Warehouse</span>
                <button type="button" (click)="selectWarehouse()" class="new-add-button" [disabled]="isDisabled">
                  <i class="material-icons">add</i>
                  <span i18n>Select Warehouse</span>
                </button>
              </label>
              <div class="pill-wrapper">
                <div *ngFor="let wh of warehouses.value; let i=index" class="pill">
                  <span class="subheading-2">{{ wh.name }}</span>
                  <button type="button" class="remove-button" (click)="removeWarehouse(wh.code)" [disabled]="isDisabled">
                    <i class="material-icons">highlight_off</i>
                  </button>
                </div>
              </div>
            </div>
            <div class="advanced-price-platform">
              <span class="subheading-2" i18n>Platform</span>
              <label class="checkbox">
                <input type="checkbox" [formControl]="isOnline" name="isOnline">
                <span i18n>Online (Website)</span>
              </label>
              <label class="checkbox">
                <input type="checkbox" [formControl]="isOffline" name="isOffline">
                <span i18n>Offline (POS)</span>
              </label>
            </div>
            <div id="modify-type" [ngClass]="{'error-default-amount': errorInputDefaultAmount}">
              <p id="radio_label" class="subheading-2">Modify Price by</p>
              <div class="inline-option" role="radiogroup" aria-labelledby="radio_label">
                <label [ngClass]="{'active': type === 'percentage'}" class="radio" role="radio">
                  <input type="radio" value="percentage" formControlName="type">
                  <span i18n>Percentage</span>
                </label>
                <label [ngClass]="{'active': type === 'amount'}" class="radio" role="radio">
                  <input type="radio" value="amount" formControlName="type">
                  <span i18n>Amount</span>
                </label>
              </div>
              <div class="input-group">
                <select class="material-icons" [formControl]="defaultAmountSign">
                  <option class="material-icons" value="negative" aria-label="negative">remove</option>
                  <option class="material-icons" value="positive" aria-label="positive">add</option>
                </select>
                <input *ngIf="type == 'percentage'" type="number" [formControl]="defaultAmountNumber" min="1" max="99"
                       step="1" appOnlyNumber/>
                <input *ngIf="type != 'percentage'" type="number" [formControl]="defaultAmountNumber" min="1"
                       appOnlyNumber/>
                <span *ngIf="type == 'percentage'" class="input-group-text">%</span>
              </div>
              <span id="error-message" *ngIf="errorInputDefaultAmount" i18n>
                Maximum percentage is 99%
              </span>
            </div>
          </div>
          <nus-detail-actions
            [component]="this"
            [hideDelete]="true"
            (cancel)="navigateToParent(true)">
          </nus-detail-actions>
        </nus-tab>
        <nus-tab [title]="'Product List'">
          <div class="product-table">
            <p class="body-2" i18n>Total {{ products.length }} items {{products.invalid}}</p>
            <div *ngIf="products.length > 1 && products.invalid"  class="non-field-errors">
              <span class="heading-2" i18n>There was an error setting the price to the product.</span>
            </div>
            <table>
              <thead>
              <tr>
                <th>Product</th>
                <th>UPC</th>
                <th>Default Price</th>
                <th>Modified Price</th>
                <th>New Price</th>
                <th>Remove</th>
              </tr>
              </thead>
              <tbody>
              <nus-advanced-price-product
                *ngFor="let productControl of products.controls; let i=index"
                [form]="productControl"
                [type]="this.type"
                [defaultAmountSign]="this.defaultAmountSign.value"
                [defaultAmountNumber]="this.defaultAmountNumber.value"
                (remove)="removeProduct(i)"
              ></nus-advanced-price-product>
              <tr>
                <td colspan="6">
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
      <nus-product-selection-modal></nus-product-selection-modal>
      <nus-advanced-price-warehouse-modal
        [choices]="warehouseChoices"
        [selectedWarehouses]="warehouses"
      ></nus-advanced-price-warehouse-modal>
    </form>
  `,
  styles: [`
    .wrapper {
      padding: 16px 24px;
      border: solid 1px var(--grey);
      border-radius: 4px;
      margin-top: 24px;
    }

    .inline-option {
      display: flex;
    }

    .inline-option > label {
      margin-inline-end: 15px;
    }

    .pill-wrapper {
      display: flex;
      flex-wrap: wrap;
    }

    .pill {
      background: var(--darken-white);
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 4px 4px 4px 8px;
      border-radius: 24px;
      min-width: fit-content;
      margin-right: 8px;
      margin-bottom: 16px;
    }

    .checkbox, .radio {
      padding: 10px 0;
      min-height: auto;
    }

    .non-field-warning {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      padding: 4px 8px;
      background: var(--alert-lighten);
      border-radius: 4px;
      margin-bottom: 16px;
    }

    div.non-field-errors {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 16px 24px;
      background: var(--error-lighten);
      border-radius: 4px;
      color: var(--error);
      margin: 16px 0;
      font-weight: 700;
    }

    .input-group {
      display: flex;
      align-content: stretch;
      max-width: 25%;
    }
    .input-group-text {
      background: var(--white);
      border: solid var(--grey);
      box-sizing: border-box;
      border-radius: 0 4px 4px 0;
      border-width: 1px 1px 1px 0;
      padding: 10px;
    }
    .input-group select {
      width: fit-content;
      border-radius: 4px 0 0 4px;
      border-width: 1px 0 1px 1px;
    }
    .input-group input {
      border-radius: 0 4px 4px 0;
    }

    .error-default-amount .input-group select{
      border-color: var(--error) !important;
    }
    .error-default-amount .input-group input{
      border-color: var(--error) !important;
      background: url('../../../../assets/warning-24px.svg') no-repeat scroll right 5px center !important;
    }
    .error-default-amount #error-message {
      color: var(--error);
      font-size: 10px;
      margin-top: 2px;
    }
  `]
})

export class AdvancedPriceComponent extends AbstractDetailComponent<IAdvancedPriceList> implements OnInit, AfterViewInit {
  @ViewChild(ProductSelectionModalComponent) productSelectionModal: ProductSelectionModalComponent;
  @ViewChild(AdvancedPriceWarehouseModalComponent) advancedPriceWarehouseModal: AdvancedPriceWarehouseModalComponent;

  entity?: IAdvancedPriceList;
  warehouseChoices: IWarehouse[] = [];

  timeoutId: any;
  reloadTimeout = 650;
  queryText = new FormControl('');

  isDisabled = false;

  defaultAmountSign: FormControl;
  defaultAmountNumber: FormControl ;
  errorInputDefaultAmount = false;

  constructor(service: AdvancedPriceListService,
              route: ActivatedRoute,
              router: Router,
              private fb: FormBuilder,
              toast: ToastService) {
    super(route, router, toast, service);
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { warehouses: IWarehouse[] }) => {
      this.warehouseChoices = data.warehouses;
    });

    super.ngOnInit();

    // Calculate the default amount each time the user changes the sign or amount
    this.defaultAmountSign.valueChanges.subscribe(
      () => {
        this.updateDefaultAmount(this.defaultAmountNumber.value);
      }
    );
    this.defaultAmountNumber.valueChanges.subscribe(
      (newValue) => {
        this.updateDefaultAmount(newValue);
      }
    );

    this.form.get('type').valueChanges.subscribe(
      (newValue) => {
        console.log('hello');
        // Set product amount for the advance price
        if (newValue === 'percentage') {
          this.errorInputDefaultAmount = this.defaultAmountNumber.value > 100;
        } else {
          this.errorInputDefaultAmount = false;
        }
      }
    );
  }

  ngAfterViewInit() {
    this.productSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed());
    this.advancedPriceWarehouseModal.onClose.subscribe(() => this.onWarehouseSelectionModalClosed());
  }

  get href(): FormControl {
    return this.form.get('href') as FormControl;
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get isActive(): FormControl {
    return this.form.get('isActive') as FormControl;
  }

  get warehouses(): FormArray {
    return this.form.get('warehouses') as FormArray;
  }

  get isOnline(): FormControl {
    return this.form.get('isOnline') as FormControl;
  }

  get isOffline(): FormControl {
    return this.form.get('isOffline') as FormControl;
  }

  get type(): string {
    return this.form.get('type').value;
  }

  get defaultAmount(): FormControl {
    return this.form.get('defaultAmount') as FormControl;
  }

  get products(): FormArray {
    return this.form.get('products') as FormArray;
  }

  initializeForm(entity?: IAdvancedPriceList) {
    this.entity = entity;

    this.form = this.fb.group({
      href: [entity?.href, []],
      name: [entity?.name, [Validators.required, Validators.maxLength(50)]],
      isActive: [entity?.isActive ?? false, []],
      warehouses: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      isOnline: [entity?.isOnline ?? false, []],
      isOffline: [entity?.isOffline ?? false, []],
      type: [entity?.type ?? 'percentage', []],
      defaultAmount: [entity?.defaultAmount ?? 1, [Validators.required]],
      products: this.fb.array([])
    });

    this.defaultAmountSign = new FormControl('positive', []);
    this.defaultAmountNumber = new FormControl(1, [Validators.required]);

    this.form.controls.isActive.markAsTouched();
    this.form.controls.isOnline.markAsTouched();
    this.form.controls.isOffline.markAsTouched();

    entity?.warehouses.forEach((value) => {
      this.addWarehouse(value);
    });

    entity?.products.forEach((value) => {
      this.addProduct(value);
    });
    if (entity) {
      this.defaultAmountNumber.setValue(Math.abs(entity?.defaultAmount));
    }

    this.isDisabled = !!this.entity;
    if (!!this.entity) {
      if (this.defaultAmount.value < 0) {
        this.defaultAmountSign.setValue('negative');
      } else {
        this.defaultAmountSign.setValue('positive');
      }

      // Disable setting form input
      this.form.controls.isOnline.disable();
      this.form.controls.isOffline.disable();
      this.form.controls.type.disable();
      this.form.controls.warehouses.disable();
      this.form.controls.defaultAmount.disable();
      this.defaultAmountNumber.disable();
      this.defaultAmountSign.disable();
    }
  }
  /* WAREHOUSE SELECTION */
  selectWarehouse() {
    this.advancedPriceWarehouseModal.open();
  }

  addWarehouse(warehouse: INamedHrefEntity) {
    const w = this.fb.group({
      href: [warehouse.href, []],
      name: [warehouse.name, []]
    });

    this.warehouses.push(w);
  }

  onWarehouseSelectionModalClosed() {
    if (this.advancedPriceWarehouseModal.result === DialogResult.OK) {
      const selectedWarehouseCode = this.advancedPriceWarehouseModal.warehouses.value;

      // Reset warehouse and sub-location
      this.warehouses.clear();

      selectedWarehouseCode.forEach((href) => {
        const whData = this.warehouseChoices.find(whObj => {
          return whObj.href === href;
        });

        if (whData !== undefined) {
          const w = this.fb.group({
            href: [whData.href, []],
            name: [whData.name, []]
          });

          this.warehouses.push(w);
        }
      });
    }
  }

  removeWarehouse(whHref: string): void {
    const index = this.warehouses.value.findIndex(wh => wh.href === whHref);
    this.warehouses.removeAt(index);
  }
  /* WAREHOUSE SELECTION */

  /* PRODUCT SELECTION */
  selectProduct() {
    this.productSelectionModal.open();
  }

  addProduct(product?: IAdvancedPriceListProduct): void {
    const f = this.fb.group({
      id: [product?.id, []],
      product: this.fb.group({
        href: [product?.product.href, []],
        name: [product?.product.name, []],
        price: [product?.product.price, []],
        upc: [product?.product.upc, []]
      }),
      amount: [product.amount, [Validators.required, Validators.min(1)]]
    });

    this.products.push(f);
  }

  onProductSelectionModalClosed() {
    if (this.productSelectionModal.result === DialogResult.OK) {

      const selectedProduct = this.productSelectionModal.product.value as IProduct;
      const basePrice = getProductBasePrice(selectedProduct.priceLists);

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
    }
  }

  removeProduct(i: number): void {
    this.products.removeAt(i);
  }
  /* PRODUCT SELECTION */

  updateDefaultAmount(newValue: number) {
    if (!!this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    console.log('updateDefaultAmount');
    let amountWithoutSign = 0;
    // wait to see if the user is still typing more before searching
    this.timeoutId = setTimeout(() => {
      amountWithoutSign = Math.abs(newValue);

      // convert amount to negative / positive value based on user selection
      const amountWithSign = this.defaultAmountSign.value === 'positive' ? amountWithoutSign : -amountWithoutSign;

      // Set product amount for the advance price
      if (this.type === 'percentage') {
        this.defaultAmount.setValue(newValue);
      } else {
        this.defaultAmount.setValue(amountWithSign);
      }

    }, this.reloadTimeout);
  }

  save() {
    if (this.isOnline.value === false && this.isOffline.value === false) {
      this.toast?.addError('Please choose at least 1 platform', 'Failed to Save');
      return;
    }
    if (this.products.value.length === 0) {
      this.toast?.addError('Please add at least 1 product', 'Failed to Save');
      return;
    }

    if (this.errorInputDefaultAmount) {
      this.toast?.addError('Please check your amount input', 'Failed to Save');
      return;
    }

    super.save();
  }
}
