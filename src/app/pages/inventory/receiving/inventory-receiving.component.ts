import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../auth';
import { AbstractDetailComponent, DialogResult, ErrorResult, ToastService } from '../../../core';
import {
  inventory,
  ISubLocation,
  IWarehouse,
  marketplace
} from '@nusantara/models';
import { InventoryReceivingService, MarketplaceClientService } from '../../../services';
import {IProduct, IProductClass} from '../../../models/products';
import {
  ConfirmModalReceivingOrderComponent,
  MarketplaceChannelInfoModalComponent,
  ProductSelectionModalComponent
} from '../../../shared';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { IError } from '../../../models/base/error';
import { isObject } from 'rxjs/internal-compatibility';
import { convertStringToObject, keysToCamel } from '@nusantara/shared/helpers';

/**
 * Allows a user to receive a new batch of inventory.
 */
@Component({
  selector: 'nus-inventory-receiving',
  template: `
    <h1>Delivery Order</h1>

    <form [formGroup]="form" (ngSubmit)="saveForm()">
      <div class="container">
        <div class="general-info">
          <h3>General Information</h3>
          <div>
            <label>Received By</label>
            <span>{{ userDisplayName }}</span>
          </div>
          <div>
            <label>Approved By</label>
            <span>-</span>
          </div>
          <div>
            <label>Receiving Date</label>
            <span>{{ currentDate|date }}</span>
          </div>
          <div>
            <label>Status</label>
            <span>Pending</span>
          </div>
          <div>
            <label>DO Number</label>
            <input type="text" [formControl]="doNumber">
          </div>
          <div>
            <label for="">DC PIC</label>
            <input type="text" [formControl]="dcPic">
          </div>
          <div [formGroup]="warehouse">
            <label>Warehouse</label>
            <div class="confirm-warehouse">
              <select formControlName="href">
                <option [ngValue]="null">Select Warehouse</option>
                <option *ngFor="let wh of warehouses" [ngValue]="wh.href">
                  {{ wh.name }}
                </option>
              </select>
              <button (click)="confirmWarehouse()" type="button"
                      [disabled]="warehouse.disabled || !warehouse.valid"
                      class="control confirm">
                Confirm
              </button>
            </div>
          </div>
        </div>
        <div class="mp-info">
          <h3>Marketplace Information</h3>
          <div>
            <div>Product</div>
            <div class="count">{{ productValue }}</div>
          </div>
          <div>
            <div>Marketplace</div>
            <div class="count">{{ marketplaceValue }}</div>
          </div>
          <div>
            <div>Store</div>
            <div class="count">{{ storeValue }}</div>
          </div>
          <a (click)="showMarketplaceDetail()">More Detail</a>
        </div>
      </div>
      <div class="product-list" *ngIf="warehouse.disabled">
        <table>
          <thead>
          <tr id="mp-add-product-head">
            <th>Product (UPC)</th>
            <th>Location</th>
            <th>Quantity</th>
            <th>SKU</th>
            <th>Batch</th>
            <th>Locator</th>
            <th>Expiry Date</th>
            <th>Cost</th>
            <th>Remove</th>
          </tr>
          </thead>
          <tbody>

          <nus-inventory-receiving-line
            *ngFor="let rec of stockRecords.controls; let i=index"
            [formGroup]="rec"
            [availableSubLocations]="availableSubLocations"
            (remove)="stockRecords.removeAt(i)">
          </nus-inventory-receiving-line>

            <tr>
              <td colspan="9">
                <button type="button" (click)="addLine()" class="new-add-button wide">
                  <i class="material-icons">add</i> Add Record
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <nus-detail-actions
          [component]="this"
          (cancel)="confirmModal()"
          (delete)="delete()">
        </nus-detail-actions>
      </div>
    </form>
    <!-- Modals -->
    <nus-product-selection-modal></nus-product-selection-modal>
    <nus-marketplace-channel-info-modal [warehouseInfoDetail]="warehouseDetail"></nus-marketplace-channel-info-modal>
    <nus-confirm-receiving-modal></nus-confirm-receiving-modal>

  `,
  styles: [
    'form{ max-width: none;}',
    'h3 { font-size: 20px; margin: 0; }',
    'button.confirm { width: auto }',
    '.container { display: grid; grid-template-columns: 4fr 1fr; grid-gap: 24px; }',
    '.container > div { border: 1px solid var(--grey); border-radius: 4px; padding: 16px 24px; }',
    '.general-info > h3 { margin-bottom: 20px; }',
    '.general-info > div:not(:last-child) { margin-bottom: 23px; }',
    '.general-info label { min-height: 0; }',
    '.general-info span{ font-weight: 700; color: var(--darken-grey); }',
    '.mp-info > h3 { margin-bottom: 16px; }',
    '.mp-info > div { text-align: center; border: 1px solid var(--grey); border-radius: 4px; padding: 12px 16px; margin-bottom: 12px; }',
    '.mp-info > a { display: block; margin-top: 16px; }',
    '.mp-info .count { font-size: 28px; font-weight: 700; }',
    '.confirm-warehouse { display: grid; grid-template-columns: 5fr 1fr; grid-gap: 24px; }',
    '.product-list { margin-top: 24px; }',
  ]
})
export class InventoryReceivingComponent extends AbstractDetailComponent<inventory.IReceivingOrder> implements OnInit, AfterViewInit {

  warehouses: IWarehouse[];
  availableSubLocations: ISubLocation[] = [];
  warehouseDetail: marketplace.IWarehouseDetail[];
  productClasses: IProductClass[] = [];

  @ViewChild(ProductSelectionModalComponent) productSelectionModal: ProductSelectionModalComponent;
  @ViewChild(MarketplaceChannelInfoModalComponent) marketplaceChannelInfo: MarketplaceChannelInfoModalComponent;
  @ViewChild(ConfirmModalReceivingOrderComponent) confirmModalReceiving: ConfirmModalReceivingOrderComponent;

  currentDate: Date;
  productValue = 0;
  storeValue = 0;
  marketplaceValue = 0;
  showDetail = false;

  constructor(private fb: FormBuilder,
              public toast: ToastService,
              public authService: AuthService,
              public service: InventoryReceivingService,
              public clientService: MarketplaceClientService,
              public route: ActivatedRoute,
              public router: Router) {
    super(route, router, toast, service);
  }

  get warehouse(): FormGroup {
    return this.form.get('warehouse') as FormGroup;
  }

  get stockRecords(): FormArray {
    return this.form.get('stockRecords') as FormArray;
  }

  ngOnInit() {
    super.ngOnInit();
    this.route.data.subscribe((data: { warehouses: IWarehouse[], productClasses: IProductClass[] }) => {
      this.warehouses = data.warehouses;
      this.productClasses = data.productClasses;
    });
    this.currentDate = new Date();
  }

  ngAfterViewInit() {
    // wire-up modal closed callback
    this.productSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed());
    this.marketplaceChannelInfo.onClose.subscribe(() => this.onMarketplaceModalClosed());
    this.confirmModalReceiving.onClose.subscribe(() => this.onConfirmModalClosed());
  }

  get doNumber(): FormControl {
    return this.form.get('doNumber') as FormControl;
  }

  get dcPic(): FormControl {
    return this.form.get('dcPic') as FormControl;
  }

  initializeForm(entity?: inventory.IReceivingOrder) {
    // TODO: replace this! maybe embed href identity in token claims?
    this.form = this.fb.group({
      href: [],
      warehouse: this.fb.group({
        href: [null, Validators.required],
        // name: ['', ],
      }),
      status: ['pending', [Validators.required, ]],
      createdBy: this.fb.group({
        href: `https://bhisma.cloud/api/iam/${this.authService.tokenPayload.user_id}/`
      }),
      reviewedBy: [null, ],
      stockRecords: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      doNumber: ['', []],
      dcPic: ['', []],
    });
  }

  addLine() {
    this.productSelectionModal.open();
  }

  saveForm() {
    // check if sku is empty, set the sku value to be `upc` value
    for (const [i, val] of this.form.value.stockRecords.entries()) {
      if (val.sku === '') {
        this.stockRecords.at(i).patchValue({
          sku: val.product.upc
        });
      }
    }

    this.service.save(this.getFormValue()).pipe(catchError(err => {
      if (err instanceof HttpErrorResponse) {
        return of(new ErrorResult<IError>(err.error, err.status));
      } else {
        return of(new ErrorResult<IError>({message: 'Network error.. probably?'}, err.status));
      }
    })).subscribe(
      resp => {
        if (resp instanceof ErrorResult) {
          this.onSaveError(resp);
        } else {
          this.onSaveSuccess(resp);
          this.storeValue = this.marketplaceValue = this.productValue = 0;
          this.showDetail = false;
          this.warehouseDetail = [];
          setTimeout(function() {
            this.navigateToParent(false);
          }, 1000);
        }
      }
    );
  }

  showMarketplaceDetail() {
    this.marketplaceChannelInfo.open();
  }

  confirmModal() {
    this.confirmModalReceiving.open();
  }

  onConfirmModalClosed() {
    if (this.confirmModalReceiving.result === DialogResult.OK) {
      this.resetForm(true);
    }
  }

  confirmWarehouse(): void {
    if (!this.warehouse.value) {
      alert('You must first select a warehouse');
      return;
    }
    const wh = this.warehouses.filter(e => e.href === this.warehouse.get('href').value)[0];
    if (wh) {
      this.clientService.getWarehouseInformation(wh.code).subscribe(
        (data: marketplace.IWarehouseInfo) => {
          this.storeValue = data?.totalStore ?? 0;
          this.showDetail = true;
          this.marketplaceValue = data?.totalMarketplace ?? 0;
          this.productValue = data?.totalProduct ?? 0;
          this.warehouseDetail = data?.details ?? [];
        }
      );
      this.availableSubLocations = wh.subLocations;
      this.warehouse.disable();
    }
  }

  onProductSelectionModalClosed() {
    if (this.productSelectionModal.result === DialogResult.OK) {
      // add a new child to the form group based on the modal

      let defaultSubLocations;
      if (this.availableSubLocations?.length === 1) {
        defaultSubLocations = this.availableSubLocations[0].href;
      } else {
        defaultSubLocations = null;
      }

      const selectedProduct = this.productSelectionModal.product.value as IProduct;

      let defaultSku;
      if (selectedProduct.upc) {
        defaultSku = selectedProduct.upc;
      } else {
        defaultSku = '';
      }

      const oneProduct = this.fb.group({
        inventoryReceiving: [null, []],
        product: [selectedProduct, [Validators.required]],
        href: [null, []],
        location: this.fb.group({
          href: [defaultSubLocations, []],
          // name: ['', ],
        }),
        sku: [defaultSku, []],
        originalQuantity: [1, [Validators.required, Validators.min(1)]],
        batchNumber: ['', []],
        locator: this.fb.array([]),
        expiryDate: [null, []],
        cost: [0, [Validators.required]]
      });
      this.stockRecords.push(oneProduct);
    }
  }

  get userDisplayName(): string {
    const lastName = this.authService.tokenPayload?.last_name ?? '';
    const firstName = this.authService.tokenPayload?.first_name ?? '';
    const email = this.authService.tokenPayload?.email ?? '';
    const fullname = firstName.concat(' ', lastName);

    if (lastName && firstName && email) {
      return [fullname, `(${email})`, ].join(', ').trim();
    } else {
      return email;
    }
  }

  getFormValue() {
    return this.form.getRawValue();
  }

  resetForm(warnOnDirty = false) {
    this.form.reset();
    this.warehouse.enable();
    this.stockRecords.clear();
  }

  onMarketplaceModalClosed() {
  }

}
