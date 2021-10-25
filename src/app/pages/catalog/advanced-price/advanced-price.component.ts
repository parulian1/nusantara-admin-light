import {AbstractDetailComponent, DialogResult, ToastService} from '@nusantara/core';
import {IAdvancedPriceList, IAdvancedPriceListProduct} from '@nusantara/models/products/advanced-price-list';
import {AdvancedPriceListService} from '@nusantara/services';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractControl, Form, FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {IWarehouse} from '@nusantara/models';
import {IProduct} from '@nusantara/models/products';
import {ProductSelectionModalComponent} from '@nusantara/shared';
import {of} from 'rxjs';
import {map} from 'rxjs/operators';
import {AdvancedPriceWarehouseModalComponent} from '@nusantara/pages/catalog/advanced-price/advanced-price-warehouse-modal.component';
import {AdvancedPriceSublocationModalComponent} from "@nusantara/pages/catalog/advanced-price/advanced-price-sublocation-modal.component";

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
            <h2 class="heading-1">Setting</h2>
            <div id="warehouse-wrapper">
              <label>
                <span>Warehouse</span>
                <button type="button" (click)="selectWarehouse()" class="new-add-button">
                  <i class="material-icons">add</i> Select Warehouse
                </button>
              </label>
              <div class="pill-wrapper">
                <div *ngFor="let wh of warehouses.value; let i=index" class="pill">
                  <span class="subheading-2">{{ wh.name }}</span>
                  <button type="button" class="remove-button" (click)="removeWarehouse(wh.code)">
                    <i class="material-icons">highlight_off</i>
                  </button>
                </div>
              </div>
            </div>
            <div id="location-wrapper" *ngIf="warehouses.length > 0">
              <label>
                <span>Location</span>
                <button type="button" class="new-add-button" (click)="selectSubLocation()">
                  <i class="material-icons">add</i> Select Location
                </button>
              </label>
              <div class="pill-wrapper">
                <div *ngFor="let subLoc of subLocation.value; let i=index" class="pill">
                  <span class="subheading-2">{{ subLoc.name }}</span>
                  <button type="button" class="remove-button" (click)="removeLocation(subLoc.href)">
                    <i class="material-icons">highlight_off</i>
                  </button>
                </div>
              </div>
            </div>
            <div id="modify-type">
              <p class="subheading-2">Modify Price by</p>
              <div class="inline-option">
                <label [ngClass]="{'active': type === 'percentage'}" class="radio">
                  <input type="radio" value="percentage" formControlName="type">
                  Percentage
                </label>
                <label [ngClass]="{'active': type === 'amount'}" class="radio">
                  <input type="radio" value="amount" formControlName="type">
                  Amount
                </label>
              </div>
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
            <div class="product-table__search control">
              <i class="material-icons">search</i>
              <input type="search" placeholder="Search Product Name or SKU" [formControl]="queryText">
            </div>
            <table>
              <thead>
              <tr>
                <th>Product</th>
                <th>UPC</th>
                <th>Default Price</th>
                <th>Modified Price</th>
                <th>New Price</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <nus-advanced-price-product
                *ngFor="let productControl of filteredProducts$; let i=index"
                [form]="productControl"
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
      <nus-advanced-price-sublocation-modal
        [choices]="subLocationChoices"
        [selectedSubLocations]="subLocation"
      ></nus-advanced-price-sublocation-modal>
    </form>
  `,
  styles: [`
    .wrapper {
      padding: 16px 24px;
      border: solid 1px var(--grey);
      border-radius: 4px;
      margin-top: 24px;
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
  `]
})

export class AdvancedPriceComponent extends AbstractDetailComponent<IAdvancedPriceList> implements OnInit, AfterViewInit {
  @ViewChild(ProductSelectionModalComponent) productSelectionModal: ProductSelectionModalComponent;
  @ViewChild(AdvancedPriceWarehouseModalComponent) advancedPriceWarehouseModal: AdvancedPriceWarehouseModalComponent;
  @ViewChild(AdvancedPriceSublocationModalComponent) advancedPriceSubLocationModal: AdvancedPriceSublocationModalComponent;

  entity?: IAdvancedPriceList;
  warehouseChoices: IWarehouse[] = [];
  subLocationChoices: Array<any> = [];

  timeoutId: any;
  reloadTimeout = 650;
  queryText = new FormControl('');
  filteredProducts$: AbstractControl[];

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
  }

  ngAfterViewInit() {
    this.productSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed());
    this.advancedPriceWarehouseModal.onClose.subscribe(() => this.onWarehouseSelectionModalClosed());
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

  get subLocation(): FormArray {
    return this.form.get('subLocation') as FormArray;
  }

  get type(): string {
    return this.form.get('type').value;
  }

  get products(): FormArray {
    return this.form.get('products') as FormArray;
  }

  initializeForm(entity?: IAdvancedPriceList) {
    this.entity = entity;

    entity?.products.forEach((value) => {
      this.addProduct(value);
    });

    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, Validators.maxLength(50)]],
      isActive: [entity?.isActive, []],
      warehouses: this.fb.array([], [Validators.minLength(1)]),
      subLocation: this.fb.array([], []),
      type: [entity?.type ?? 'percentage', [Validators.required]],
      products: this.fb.array([])
    });

    this.form.controls.isActive.markAsTouched();
  }
  /* WAREHOUSE SELECTION */
  selectWarehouse() {
    this.advancedPriceWarehouseModal.open();
  }

  onWarehouseSelectionModalClosed() {
    if (this.advancedPriceWarehouseModal.result === DialogResult.OK) {
      const selectedWarehouseCode = this.advancedPriceWarehouseModal.warehouses.value;

      // Reset warehouse and sub-location
      this.warehouses.clear();
      this.subLocationChoices = [];

      selectedWarehouseCode.forEach((wh) => {
        const whData = this.warehouseChoices.find(whObj => {
          return whObj.code === wh;
        });

        if (whData !== undefined) {
          const w = this.fb.group({
            href: [whData.href, []],
            name: [whData.name, []],
            code: [whData.code, []]
          });

          this.warehouses.push(w);

          const loc = {
            wh_name: whData.name,
            wh_code: whData.code,
            wh_location: whData.subLocations
          };

          this.subLocationChoices.push(loc);
        }
      });
      console.log(this.warehouses.value);
    }
  }

  removeWarehouse(whCode: string): void {
    const index = this.warehouses.value.findIndex(wh => wh.code === whCode);
    this.warehouses.removeAt(index);
  }
  /* WAREHOUSE SELECTION */

  /* WAREHOUSE LOCATION SELECTION */
  selectSubLocation() {
    this.advancedPriceSubLocationModal.open();
  }

  onLocationSelectionModalClosed() {
    if (this.advancedPriceSubLocationModal.result === DialogResult.OK) {
      const selectedLocationHref = this.advancedPriceSubLocationModal.location.value;

      // Reset warehouse and sub-location
      this.subLocation.clear();

      selectedLocationHref.forEach((href) => {
        console.log(href);
      });
      console.log(this.subLocation.value);
    }
  }

  removeLocation(href: string): void {
    const index = this.subLocation.value.findIndex(loc => loc.href === href);
    this.warehouses.removeAt(index);
  }
  /* WAREHOUSE LOCATION SELECTION */

  /* PRODUCT SELECTION */
  selectProduct() {
    this.productSelectionModal.open();
  }

  addProduct(product?: IAdvancedPriceListProduct): void {
    const f = this.fb.group({
      href: [product.href, []],
      name: [product.name, []],
      upc: [product.upc, []],
      defaultPrice: [product.upc, []],
      modifyAmount: [product.modifyAmount, [Validators.required, Validators.min(1)]]
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
        href: [selectedProduct.href, []],
        name: [selectedProduct.name, []],
        upc: [selectedProduct.upc, []],
        defaultPrice: [basePrice, []],
        modifyAmount: [0, [Validators.required, Validators.min(1)]]
      });

      this.products.push(f);
      this.onQueryTextChanged(this.queryText.value);
    }
  }

  removeProduct(i: number): void {
    const selectedProduct = this.filteredProducts$[i].value;
    const index = this.products.value.findIndex(p => p.product.name === selectedProduct.product.name);
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
  /* PRODUCT SELECTION */
}
