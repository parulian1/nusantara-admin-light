import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../auth';
import {DialogResult, ToastService, AbstractDetailComponent, ErrorResult} from '../../../core';
import {inventory, ISubLocation, IWarehouse, IWarehouseDetail, IWarehouseInformation} from '../../../models';
import {InventoryReceivingService, MarketplaceClientService} from '../../../services';
import { IProduct } from '../../../models/products';
import {
  ProductSelectionModalComponent,
  MarketplaceInfoDetailModalComponent,
  ConfirmModalReceivingOrderComponent
} from '../../../shared';
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {of} from "rxjs";
import {IError} from "../../../models/base/error";

/**
 * Allows a user to receive a new batch of inventory.
 */
@Component({
  selector: 'nus-inventory-receiving',
  template: `
    <h1 style="font-weight: 700">Receiving Inventory Order</h1>

    <form [formGroup]="form" (ngSubmit)="saveForm()">
    <div id="mp-form" >
      <span style="color: #365dc3; font-weight: 700">General Information</span>
      <div class="inventory-order-meta">
            <label class="marketplace-label">Received By</label>
            <span>{{userDisplayName}}</span>
      </div>
      <div class="inventory-order-meta">
            <label class="marketplace-label">Approved By</label>
            <span>-</span>
      </div>
      <div class="inventory-order-meta">
            <label class="marketplace-label">Receiving Date</label>
            <span>{{ currentDate|date }}</span>
      </div>
      <div class="inventory-order-meta">
            <label class="marketplace-label">Status</label>
            <span>Pending</span>
      </div>
      <div class="inventory-order-meta" [formGroup]="warehouse">
            <label class="marketplace-label">Warehouse</label>
            <select formControlName="href" style="margin-right: 10px;width: 80%;">
              <option [ngValue]="null">Select Warehouse</option>
              <option *ngFor="let wh of warehouses" [ngValue]="wh.href">
                {{ wh.name }}
              </option>
            </select>
            <button (click)="confirmWarehouse()"
            type="button" id="mp-button"
            [disabled]="warehouse.disabled || !warehouse.valid"
            class="control">Confirm</button>
      </div>
    </div>
    <div id="mp-receiving-information">
        <span style="color: #365dc3; font-weight: 700">Marketplace Information</span>
        <div class="mp-info">
          <p>Product</p>
          <p class="info-value">{{productValue}}</p>
        </div>
        <div class="mp-info">
          <p>Marketplace</p>
          <p class="info-value">{{marketplaceValue}}</p>
        </div>
        <div class="mp-info">
          <p>Store</p>
          <p class="info-value">{{storeValue}}</p>
        </div>
        <div class="mp-info-detail" *ngIf="showDetail">
          <button type="button" (click)="showMarketplaceDetail()" id="more-detail-button">More Detail</button>
        </div>
    </div>
    <div *ngIf="warehouse.disabled" style="padding-top: 30px;">
        <table class="line-items">
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
            [form]="rec"
            [availableSubLocations]="availableSubLocations"
            (remove)="stockRecords.removeAt(i)">
          </nus-inventory-receiving-line>

          <tr>
            <td colspan="9">
              <button type="button" (click)="addLine()" class="add-button-inventory">
                <i class="material-icons">add</i> Add Record
              </button>
            </td>
          </tr>

        </table>

        <nus-detail-actions-mp
          [component]="this"
          (cancel)="confirmModal()"
          (delete)="delete()">
        </nus-detail-actions-mp>
      </div>
    </form>
    <!-- Modals -->
    <nus-product-selection-modal></nus-product-selection-modal>
    <nus-marketplace-info-detail-modal [warehouseInfoDetail]="warehouseDetail"></nus-marketplace-info-detail-modal>
    <nus-confirm-receiving-modal></nus-confirm-receiving-modal>

  `,
  styles: [`
    form{
      max-width: none;
    }
    #mp-form {
      float: left;
      width: 70%;
      height: 396px;
      padding: 1em 1em 1em 1em;
      background: white;
      border: 1px solid #c1c1c1;
      margin-top: 5px;
      margin-right: 30px;
      border-radius: 8px;
    }

    #mp-receiving-information{
      float: left;
      width: 18%;
      height: 396px;
      padding: 1em 1em 1em 1em;
      background: white;
      border: 1px solid #c1c1c1;
      margin-top: 5px;
      border-radius: 8px;
    }

    #mp-receiving-information>a{
      text-align: center;
    }

    #mp-receiving-information>span{
      margin-left: 24px;
    }

    .mp-info{
      width: 85%;
      height: 80px;
      border-radius: 8px;
      border: 1px solid #c1c1c1;
      margin-top: 30px;
      margin-right: 24px;
      margin-left: 24px;
      text-align: center;
      color: #5A5A5A;
    }

    .add-button-inventory{
      display: flex ;
      align-items: center;
      justify-content: center;
      background-color: white;
      width: 100%;
      height: 56px;
      border-radius: 4px;
    }

    .mp-info>p{
      margin-bottom: 5px;
    }

    .mp-info-detail{
      text-align: center;
      margin-top: 20px;
    }

    .mp-info-detail>a{
      text-decoration: None;
      color: #FF7D09;
      font-weight: 700;
    }

    .info-value{
      font-size: 25px;
      margin:auto;
      font-weight: 700;
    }

    #mp-button{
      width: 18%;
      height: 40px;
      border-radius: 4px;
    }

    .inventory-order-meta{
      padding-top: 20px;
    }

    .inventory-order-meta>select{
      background-color: white;
      height: 40px;
      border-radius: 4px;
    }

    .inventory-order-meta>span{
      font-weight: 700;
      color: #5A5A5A;
    }

    .line-items {
      margin-top: 424px;
      border-radius: 8px;
    }

    #mp-add-product-head {
      background-color: #F4F4F4;
      height: 56px;
    }

    .marketplace-label{
      min-height: 0;
    }

    #more-detail-button{
      background:none;
      border:none;
      margin:0;
      padding:0;
      cursor: pointer;
      color: #FF7D09;
      font-weight: 700;
      font-size: 14px;
    }
  `
  ]
})
export class InventoryReceivingComponent extends AbstractDetailComponent<inventory.IReceivingOrder> implements OnInit, AfterViewInit {

  warehouses: IWarehouse[];
  availableSubLocations: ISubLocation[] = [];
  warehouseDetail : IWarehouseDetail[];

  @ViewChild(ProductSelectionModalComponent) productSelectionModal: ProductSelectionModalComponent;
  @ViewChild(MarketplaceInfoDetailModalComponent) marketplaceInfoModal: MarketplaceInfoDetailModalComponent;
  @ViewChild(ConfirmModalReceivingOrderComponent) confirmModalReceiving: ConfirmModalReceivingOrderComponent;

  currentDate: Date;
  productValue: number=0;
  storeValue:number=0;
  marketplaceValue:number=0;
  showDetail: boolean=false;

  constructor(private fb: FormBuilder,
              public toast: ToastService,
              public authService: AuthService,
              public service: InventoryReceivingService,
              public clientService: MarketplaceClientService,
              public route: ActivatedRoute,
              public router: Router) {
    super(route, router, toast, service);
  }

  get warehouse(): FormGroup { return this.form.get('warehouse') as FormGroup; }
  get stockRecords(): FormArray { return this.form.get('stockRecords') as FormArray; }

  ngOnInit() {
    super.ngOnInit();
    this.route.data.subscribe((data: { warehouses: IWarehouse[]}) => {
      this.warehouses = data.warehouses;
    });
    this.currentDate = new Date();
  }

  ngAfterViewInit() {
    // wire-up modal closed callback
    this.productSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed());
    this.marketplaceInfoModal.onClose.subscribe(() => this.onMarketplaceModalClosed());
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
    });
  }

  addLine() {
    this.productSelectionModal.open();
  }

  saveForm(){
    this.service.save(this.getFormValue()).pipe(catchError(err => {
      if (err instanceof HttpErrorResponse) {
        return of(new ErrorResult<IError>(err.error, err.status));
      } else {
        return of(new ErrorResult<IError>({message: 'Network error.. probably?'}, err.status));
      }
    })).subscribe(
      resp => {
        if (resp instanceof ErrorResult) {
          this.onSaveError(resp.errorDetails);
        } else {
          this.onSaveSuccess(resp);
          this.storeValue = this.marketplaceValue = this.productValue = 0;
          this.showDetail = false;
          this.warehouseDetail = [];
          setTimeout(function(){
             this.navigateToParent(false);
          }, 1000);
        }
      }
    );
    this.form.disable();
  }

  showMarketplaceDetail() {
    this.marketplaceInfoModal.open();
  }

  confirmModal() {
    this.confirmModalReceiving.open();
  }


  confirmWarehouse(): void {
    if (!this.warehouse.value) {
      alert('You must first select a warehouse');
      return;
    }
    const wh = this.warehouses.filter(e => e.href === this.warehouse.get('href').value)[0];
    if (wh) {

      this.clientService.getWarehouseInformation(wh.code).subscribe(
        (data: IWarehouseInformation) => {
          this.storeValue = data.totalStore;
          this.showDetail = true;
          this.marketplaceValue = data.totalMarketplace;
          this.productValue = data.totalProduct;
          this.warehouseDetail = data.details;
        }
      );
      this.availableSubLocations = wh.subLocations;
      this.warehouse.disable();
    }
  }

  onProductSelectionModalClosed() {
    if (this.productSelectionModal.result === DialogResult.OK) {
      // add a new child to the form group based on the modal

      const selectedProduct = this.productSelectionModal.product.value as IProduct;
      const oneProduct = this.fb.group({
            inventoryReceiving: [null, []],
            product: [selectedProduct, [Validators.required]],
            href: [null, []],
            location:  this.fb.group({
              href: [null, Validators.required],
              // name: ['', ],
            }),
            sku: ['', [Validators.required, ]],
            originalQuantity: [1, [Validators.required, Validators.min(1), ]],
            batchNumber: ['', [Validators.required]],
            locator: this.fb.array([], [Validators.required, Validators.minLength(1)]),
            expiryDate: [null, []]
          });
          this.stockRecords.push(oneProduct);
    }
  }

  get userDisplayName(): string {
    const last_name = this.authService.tokenPayload.last_name;
    const first_name = this.authService.tokenPayload.first_name;
    const email = this.authService.tokenPayload.email;
    const fullname = first_name.concat(" ", last_name);

    if(last_name && first_name && email){
      return [fullname,`(${email})`,].join(', ').trim();
    } else {
      return email;
    }
  }

  getFormValue() {
    return this.form.getRawValue();
  }

  onMarketplaceModalClosed() {}

}
