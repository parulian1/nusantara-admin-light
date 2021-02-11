import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { InventoryReceivingService, WarehouseService } from '@nusantara/services';
import { IStockSearch } from '@nusantara/models/products/stock-search';
import { AbstractEditingComponent, IResultResponse } from '@nusantara/core';
import { inventory, ISubLocation, IWarehouse, products } from '@nusantara/models';
import { AuthService } from '@nusantara/auth';
import { IProduct } from '@nusantara/models/products';
import { Observable, zip } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'nus-stock-input',
  template: `
    <h3>Product Inventory</h3>
    <table [formGroup]="fm">
      <thead>
        <tr>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td data-qa="quantity">
            <input type="number" min="1" [ngClass]="{'disabled': warehouses.length < 1}" [attr.disabled]="warehouses.length < 1 ? '' : null" [formControl]="originalQuantity" data-qa="original-quantity">
            <div class="min-quantity" *ngIf="fm.get('originalQuantity').errors && fm.get('originalQuantity').errors.min">
              <small>Quantity cannot be less than current stock ( {{ currentQuantity }} )</small>
            </div>
          </td>
        </tr>
        <tr *ngIf="warehouses.length < 1">
          <td>
            <small>To input quantity, add warehouse first</small>
          </td>
        </tr>
      </tbody>
    </table>

  `,
  styles: [
    'h3 { font-size: 20px; margin: 0 0 20px 0; }',
    '.min-quantity { margin: 10px 0px; }'
  ]
})
export class StockInputComponent extends AbstractEditingComponent implements OnInit {

  @Input() public productHref: string;

  fm: FormGroup;
  inventory: Array<inventory.IInventoryOrderSummary> = [];
  warehouses: IWarehouse[];
  availableSubLocations: ISubLocation[] = [];

  entity: IStockSearch[];
  currentQuantity: number = 0;
  validStock = true;


  constructor(
    public authService: AuthService,
    public warehouseService: WarehouseService,
    private service: InventoryReceivingService,
    private route: ActivatedRoute,
    private router: Router,
    protected fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { warehouses: IWarehouse[]}) => {
      this.warehouses = data.warehouses.filter(wh => wh.isActive);
      if (this.warehouses.length > 0)
        this.availableSubLocations = this.warehouses[0].subLocations;
    });

    if (this.productHref) {
      this.warehouseService.warehouseStockSearch(this.productHref).subscribe( res => {
        this.entity = res;
        this.entity.forEach(e => {
          this.currentQuantity += +e.quantity;
          this.originalQuantity.setValue(this.currentQuantity);
          this.originalQuantity.setValidators([Validators.min(this.currentQuantity)]);
        })
      });

    }

    this.initializeForm();
    // Line Item - Form
    this.fm = this.fb.group({
      inventoryReceiving: [null, []],
      product: [null, [Validators.required]],
      href: [null, []],
      location:  this.fb.group({
        href: [null, Validators.required]
      }),
      sku: ['', [Validators.required, ]],
      originalQuantity: ['', [Validators.required, Validators.min(1)]],
      batchNumber: ['', []],
      locator: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      expiryDate: [null, []]
    });
  }

  get product(): FormControl { return this.fm.get('product') as FormControl; }
  get originalQuantity(): FormControl { return this.fm.get('originalQuantity') as FormControl; }
  get location(): FormControl { return this.fm.get('location') as FormControl; }

  get warehouse(): FormGroup { return this.form.get('warehouse') as FormGroup; }
  get stockRecords(): FormArray { return this.form.get('stockRecords') as FormArray; }

  initializeForm() {
    // TODO: replace this! maybe embed href identity in token claims?
    this.form = this.fb.group({
      href: [],
      warehouse: this.fb.group({
        href: [null, Validators.required]
      }),
      status: ['approved', [Validators.required, ]],
      createdBy: this.fb.group({
        href: `https://bhisma.cloud/api/iam/${this.authService.tokenPayload.user_id}/`
      }),
      reviewedBy: [null, ],
      stockRecords: this.fb.array([], [Validators.required, Validators.minLength(1)]),
    });
  }

  /**
   *
   * @param product The parent product which should own all the inventory.
   */
  save(product: IProduct): Observable<IResultResponse[]> {
    let stock = this.originalQuantity.value - this.currentQuantity;
    if (this.warehouses.length > 0 && stock > 0) {
      // Update stock receiving
      this.originalQuantity.setValue(stock);
      console.log('PROD', product);
      this.warehouse.get('href').setValue(this.warehouses[0].href);
      this.product.setValue(product);
      this.location.get('href').setValue(this.availableSubLocations[0].href);
      this.stockRecords.push(this.fm);

      this.inventory.push(this.form.value);
    }

    // submit all changes to the API and an observable of all responses
    return zip(
      ...this.inventory.map(value => this.service.save(value))
    );
  }




}
