import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductPromotionService } from '@nusantara/services';
import { AbstractDetailComponent, DialogResult } from '@nusantara/core';
import { IProduct, IProductPromotion, ProductPromotionType } from '@nusantara/models/products';
import { INamedHrefEntity } from '../../../models/base';
import { ProductSelectionModalComponent } from '../../../shared/product-selection-modal.component';

@Component({
  selector: 'nus-category',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Product Promotion">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span>Name</span>
        <input type="text" [formControl]="name">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span>Type</span>
        <select [formControl]="type">
          <option *ngFor="let t of types" [ngValue]="t">{{ t }}</option>
        </select>
      </label>

      <label>
        <span>Amount</span>
        <input type="number" [formControl]="amount">
        <nus-field-errors [control]="amount"></nus-field-errors>
      </label>

      <label>
        <span>Minimum Order Amount</span>
        <input type="number" [formControl]="minimumOrderAmount">
        <nus-field-errors [control]="minimumOrderAmount"></nus-field-errors>
      </label>

      <label>
        <span>Max Amount</span>
        <input type="text" [formControl]="maxAmount">
        <nus-field-errors [control]="maxAmount"></nus-field-errors>
      </label>

      <label>
        <span>Is Exclusive</span>
        <input type="checkbox" [formControl]="isExclusive">
        <nus-field-errors [control]="isExclusive"></nus-field-errors>
      </label>

      <label>
        <span>Is Active</span>
        <input type="checkbox" [formControl]="isActive">
        <nus-field-errors [control]="isActive"></nus-field-errors>
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

      <table>
        <thead>
        <tr>
          <th>Product</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let control of products.controls; let i=index">
          <td>{{ control.get('name').value }}</td>
          <td>
            <button (click)="products.removeAt(i)" type="button" class="remove-button">
              <i class="material-icons">remove_circle_outline</i>
            </button>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <button type="button" (click)="selectProduct()" class="add-button">
              Add Product
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>

      <!-- Modals -->
      <nus-product-selection-modal></nus-product-selection-modal>

    </form>
  `,
  styles: [ ]
})
export class ProductPromotionComponent extends AbstractDetailComponent<IProductPromotion> implements OnInit, AfterViewInit {

  types: Array<ProductPromotionType> = ['percentage', 'amount_off', 'override_price'];
  @ViewChild(ProductSelectionModalComponent) productSelectionModal: ProductSelectionModalComponent;

  constructor(public service: ProductPromotionService,
              public route: ActivatedRoute,
              public router: Router,
              private fb: FormBuilder) {
    super();
  }

  initializeForm(entity?: IProductPromotion) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, ]],
      href: [entity?.href, []],
      type: [entity?.type, [Validators.required]],
      amount: [entity?.amount, [Validators.required]],
      minimumOrderAmount: [entity?.minimumOrderAmount ?? 0, [Validators.required, Validators.min(0)]],
      maxAmount: [entity?.maxAmount, [Validators.required, Validators.min(0)]],
      isExclusive: [entity?.isExclusive ?? false, [Validators.required]],
      isActive: [entity?.isActive ?? true, [Validators.required]],
      validFrom: [entity?.validFrom, [Validators.required]],
      validTo: [entity?.validTo, []],
      products: this.fb.array([]),
    });

    for (const prod of entity?.products ?? []) {
      this.addProduct(prod);
    }
  }

  ngAfterViewInit() {
    this.productSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed());
  }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get products(): FormArray { return this.form.get('products') as FormArray; }
  get type(): FormControl { return this.form.get('type') as FormControl; }
  get amount(): FormControl { return this.form.get('amount') as FormControl; }
  get minimumOrderAmount(): FormControl { return this.form.get('minimumOrderAmount') as FormControl; }
  get maxAmount(): FormControl { return this.form.get('maxAmount') as FormControl; }
  get isExclusive(): FormControl { return this.form.get('isExclusive') as FormControl; }
  get validFrom(): FormControl { return this.form.get('validFrom') as FormControl; }
  get validTo(): FormControl { return this.form.get('validTo') as FormControl; }
  get isActive(): FormControl { return this.form.get('isActive') as FormControl; }

  addProduct(product: INamedHrefEntity) {
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

}
