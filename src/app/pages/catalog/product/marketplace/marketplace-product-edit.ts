import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import {
  SvgIconService,
  MarketplaceItemService,
} from '@nusantara/services';
import {
  AbstractDetailComponent,
  ErrorResult,
  IResultResponse,
  Logger,
  ToastLevelEnum,
  ToastService,
} from '@nusantara/core';
import { INamedHrefEntity, marketplace, products } from '@nusantara/models';
import { IError } from '@nusantara/models/base/error';
import { forbiddenNameValidator } from '@nusantara/shared/forbidden-name.directive';
import { warehouseStockValidator } from '@nusantara/shared/validate-warehouse-stock.directive';


const log = new Logger('ProductComponent');

/**
 * Allows the user to edit/create a single product.
 */
@Component({
  selector: 'nus-marketplace-product-edit',
  template: `
    <nus-detail-title [originalName]="entity.name" typeName="Product"></nus-detail-title>
      <nus-non-field-errors
        [nonFieldErrors]="nonFieldErrors">
      </nus-non-field-errors>

      <form  *ngIf="form" [formGroup]="form" (ngSubmit)="save()" class="fluid">
        <div id="general-info" class="wrapper mb-5">
          <h1 class="heading-1" i18n>Marketplace Information</h1>
          <div class="product-dimension">
            <label>
              <span i18n>Product Name</span>
              <input type="text"
                    [formControl]="name"
                    name="name"
                    placeholder="Input Name"
                    data-qa="name"/>
              <nus-field-errors [control]="name"></nus-field-errors>
            </label>
            <label>
              <span i18n>Price</span>
              <div>
                <input type="number"
                    [formControl]="price"
                    name="price"
                    min="0"
                    appOnlyNumber
                    decimal="true"
                    placeholder="Price"
                    data-qa="price"/>
                <nus-field-errors [control]="price"></nus-field-errors>
              </div>
            </label>
            <label>
              <div class="test">
                <button class="control secondary btn" [disabled]="this.loading" mat-button type="button" (click)="applyAll()">
                  <span class="judul">Apply All</span>
                  <!-- <i id="transform" class="material-icons prev-icon">expand_more</i> -->
                </button>
              </div>
            </label>
          </div>
        </div>
        <ng-container formArrayName="marketplaces">
          <div *ngFor="let market of marketplace['controls']; let i = index" [formGroupName]="i">
            <div class="pull-left">
            <h4 class="subheading-2 pull-left pad5px" i18n>{{market.value.warehouse}} - {{market.value.sublocation}}</h4>
            <p *ngIf="market.value.isManagedKgx" class="pull-right m-0 kgx">Managed and Settings by KGX</p>
            </div>
            <p class=" pull-right m-0 pad5px" i18n>Stock: {{market.value.originStock}}</p>
            <table formArrayName="stocks" class="mb-4">
              <thead>
              <tr>
                <th i18n>Marketplace</th>
                <th i18n>Product Name</th>
                <th i18n>Stock</th>
                <th i18n>Price</th>
                <th *ngIf="!market.value.isManagedKgx" i18n>Is Active</th>
              </tr>
              </thead>
              <tbody>
                  <tr *ngFor="let stock of stocks(i).controls; let x = index;" [formGroupName]="x">
                    <td>{{stock.value.marketplace}} - {{stock.value.shop}}</td>
                    <td>
                      <input type="text"
                      formControlName="name"
                      name="name"
                      placeholder="Input Name"
                      data-qa="name"
                      >
                      <nus-field-errors [control]="stock.controls.name"></nus-field-errors>
                    </td>
                    <td>
                      <div class="stock">
                        <input type="number"
                        formControlName="stock"
                        name="stock"
                        min="0"
                        appOnlyNumber
                        placeholder="Stock"
                        data-qa="stock"
                        [attr.disabled]="market.value.isManagedKgx ? true : null"
                        >
                        <i *ngIf="stock.controls.stock.errors?.invalidStock" class="material-icons dangerIcon">error_outline</i>
                      </div>
                      <nus-field-errors [control]="stock.controls.stock"></nus-field-errors>
                    </td>
                    <td>
                      <input type="number"
                      formControlName="price"
                      name="price"
                      min="0"
                      appOnlyNumber
                      decimal="true"
                      placeholder="Price"
                      data-qa="price"
                      >
                      <nus-field-errors [control]="stock.controls.price"></nus-field-errors>
                    </td>
                    <td *ngIf="!market.value.isManagedKgx">
                      <label class="toggle">
                        <input id="s2" type="checkbox"
                              class="toggle"
                              formControlName="isActive"
                              name="is-active"
                              data-qa="is-active"/>
                        <span i18n>Is Active</span>
                        <nus-field-errors [control]="stock.controls.isActive"></nus-field-errors>
                      </label>
                    </td>
                  </tr>
              </tbody>
            </table>
          </div>
        </ng-container>
        <button class="control spin-tha-wheel" [disabled]="this.loading || !this.form.valid">
          <mat-spinner *ngIf="this.loading" class="track"
          mode="determinate" value="100" [diameter]="30">
          </mat-spinner>
          <mat-spinner *ngIf="this.loading" [diameter]="30"></mat-spinner>
          <span *ngIf="!this.loading">Save</span>
        </button>
        <button class="control secondary " type="button" [disabled]="this.loading" (click)="this.navigateToProduct(true)">
          <span>Cancel</span>
        </button>
      </form>
  `,
  styles: [
    '.container { display: grid; grid-template-columns: 3fr 1fr; grid-column-gap: 24px; }',
    '.wrapper { padding: 16px 24px; border: solid 1px var(--grey); border-radius: 4px; margin-bottom: 24px; }',
    '.manage { display: grid; grid-template-columns: 7fr 1fr; grid-gap: 20px; align-items: center; }',
    '.product-dimension { display: grid; grid-template-columns: 1fr .3fr .1fr; grid-column-gap: 16px; }',
    '.test{ margin-top: 1.5rem;}',
    '.heading-1 { margin-bottom: 16px; }',
    'label.toggle { padding-bottom: 20px; width: fit-content; min-height: 0; }',
    'label.toggle > input { margin-right: 16px }',
    '.rich-text-container { padding-bottom: 16px; margin: 0 !important; }',
    '.pull-right{float: right; overflow:hidden}',
    '.m-0{margin:0}',
    '.kgx{background-color:#F0BE00; border-radius:4px;padding: 5px 10px; margin-left:2.5rem; margin-bottom:6px}',
    '.pad5px{padding:5px 0}',
    '.mb-5{margin-bottom:2.5rem}',
    ':host ::ng-deep .track circle{stroke-opacity: 0.3 !important;}',
    '.spin-tha-wheel{float:left; position:relative; margin-right:20px}',
    '.spin-tha-wheel .mat-progress-spinner{display: inline; left: 43px; position: absolute; top: 6px;}',
    '.mb-4{margin-bottom:2rem}',
    '.pull-left{float: left; overflow:hidden}',
    '.stock{position:relative}',
    '.dangerIcon{position: absolute; right:10px; top:8px; color:red;}',
    'ul { list-style: none; margin: 0; padding: 0; }',
    '.side-nav li { font-size: 14px; line-height: 20px; font-weight: bold; color: var(--tertiary); padding: 10px 32px; cursor: pointer; }',
    '.side-nav li.active { padding: 10px 24px; color: white; background: var(--tertiary-lighten); border-left: solid 8px var(--secondary); border-radius: 4px; }',
    '.side-nav li a { text-decoration: none; color: inherit; }',
    '.delete { background: none; border: none; outline: none; font-size: 18px; cursor: pointer; opacity: .5; }',
    '.package-info {line-height: 18px; margin-top: 26px; font-weight: bold; }',
    '.package-info .label { float: left; width: 25%; }',
    'table tr th.product-name { width: 25%; }',
    '.total-price { font-weight: bold; }',
    '.total-price td.price { text-align: right; }',
    '#barcode-label {display: block; margin-bottom: 4px;}',
    '#barcode-label > span:first-child {font-size: 14px; line-height: 20px; font-weight: bold; margin-right: 10px;}',
  ]
})
export class MarketplaceProductEditComponent extends AbstractDetailComponent<marketplace.IItemMarketplaceInfo> implements OnInit, AfterViewInit {

  currentActive = 'general-info';
  entity: marketplace.IItemMarketplaceInfo;

  marketplaceLink:any;
  id: string;
  totalPrice: number = 0;
  loading:boolean = false;

  itemMarketplace = [];
  stock:FormGroup;
  tempat:FormGroup;
  isDisabled:boolean;

  constructor(
              service: MarketplaceItemService,
              private fb: FormBuilder,
              route: ActivatedRoute,
              toast: ToastService,
              router: Router,
              svgIconService: SvgIconService,) {
                super(route, router, toast, service);
                svgIconService.registerIcons();
              }

  get name(): FormControl {
    return this.form?.get('name') as FormControl;
  }

  get isActive(): FormControl {
    return this.form?.get('isActive') as FormControl;
  }

  get upc(): FormControl {
    return this.form?.get('upc') as FormControl;
  }

  get price(): FormControl {
    return this.form?.get('price') as FormControl;
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap?.get('id');
    this.route.data.subscribe((
      data: {
        entity: marketplace.IItemMarketplaceInfo,
      }) => {
      this.entity = data.entity;
    });
    super.ngOnInit();
  }


  /**
   * Configures the form that is edited in this component.
   *
   * Special notes related to the ProductComponent:
   * 1. There is differing logic depending on whether we're initializing a parent or a child (variant)
   * 2. From a parent, the variants array is READ-ONLY at the API, so we DO NOT set it on this form.
   */
  initializeForm(entity?: marketplace.IItemMarketplaceInfo,) {
    this.form = this.fb.group({
      name: [entity.name, [Validators.required, Validators.maxLength(120), forbiddenNameValidator(/[^a-zA-Z0-9 \&.!]/)]],
      upc: [entity?.upc, [Validators.required, ]],
      price: [entity?.price, [Validators.required, Validators.minLength(0), Validators.max(999999999)]],
      marketplaces:this.fb.array([]),
    });
    this.setMarketplace();
  }

  /**
   * Overridden implementation: This form hosts several sub-views, which must
   * be saved separate of the main product:  Because of that, the data
   * must be deleted from the data we pass to the product service.
   */

  getFormValue(): any {
    const formValue = {
      data:[]
    };
    this.form.value.marketplaces.forEach((v) => {
      v.stocks.map(x => {
        const data = {
          stock: x.stock,
          name: x.name,
          price: x.price,
          is_active: x.isActive,
          shop_id: x.shopId,
          sublocation_id: v.sublocationId,
        }
        formValue.data.push(data);
      });
    });

    return formValue;
  }


  get marketplace(): FormArray {
    return this.form.get('marketplaces') as FormArray;
  }

  stocks(index): FormArray  {
    return this.marketplace.at(index).get('stocks') as FormArray;
  }

  applyAll(){
    this.marketplace.controls.forEach((market, i) => {
      market.get('stocks')['controls'].map((stock, index) =>{
        this.stocks(i).at(index).patchValue({
            name: this.name.value,
            price: this.price.value
          });
      });
    });
  }

  setMarketplace(){
    this.entity.marketplaces.forEach((marketplace, index) => {
      this.tempat = this.fb.group({
        warehouse: [marketplace.warehouse],
        sublocation: [marketplace.sublocation],
        sublocationId: [marketplace.sublocationId],
        isManagedKgx:[marketplace.isManagedKgx],
        originStock:[marketplace.originStock],
        stocks:this.fb.array([])
      });
      marketplace.stocks.map(p => {
        this.stock = this.fb.group({
          isActive:[p.isActive],
          stock: [p.stock,  [Validators.required, Validators.minLength(0), Validators.max(999999999), warehouseStockValidator(this.tempat)]],
          name: [p.name, [Validators.required, Validators.maxLength(120), forbiddenNameValidator(/[^a-zA-Z0-9 \&.!]/)]],
          price:[p.price, [Validators.required, Validators.minLength(0), Validators.max(999999999)]],
          shop:[p.shop],
          shopId:[p.shopId],
          marketplace:[p.marketplace],
          marketplaceProductId:[p.marketplaceProductId]
        });
        const control = <FormArray>this.tempat.get('stocks');
        control.push(this.stock);
      });
      this.marketplace.push(this.tempat);
    });
   return this.marketplace;
  }

  save() {
    if (this.form.valid) {
      this.loading = true;
      this.service.putEditProductMarketplace(this.getFormValue(), this.id).pipe(catchError(err => {
        this.loading = false;
        log.debug('err', err);
        if (err instanceof HttpErrorResponse) {
          return of(new ErrorResult<IError>(err.error, err.status));
        } else {
          return of(new ErrorResult<IError>({message: 'Network error.. probably?'}, err.status));
        }
      })).subscribe(resp => {
        this.loading = false;
        if (resp instanceof ErrorResult) {
          this.onSaveError(resp);
        } else {
          this.onSaveSuccess(resp);
          setTimeout(function(){
            window.location.reload();
          }, 3000);
        }
      });
    } else {
      window.alert('Please check your input.');
    }
    this.form.enable();
  }

  navigateToProduct(warnOnDirty: boolean = false) {
    if (warnOnDirty && this.form?.dirty) {
      const leavePage = confirm('Your changes will be lost.  Do you want to continue?');
      if (!leavePage) {
        return;
      }
    }
    this.router.navigate([`/catalog/products/${this.entity.slug}`]);
  }

  /**
   * Disables irrelevant/invalid product values for certain classes of product.
   */

  showErrorToast(errMsg: string) {
    this.toast?.addMessage(errMsg, 'error', ToastLevelEnum.error);
  }

  showInfoWindow(resp, action) {
    if (action === 'remove'){
      this.toast?.addMessage(resp, 'Successfully Removed', ToastLevelEnum.info);
    } else {
      this.toast?.addMessage(resp, 'Successfully Add', ToastLevelEnum.success);
    }
  }

  protected onSaveSuccess(result: IResultResponse<any>) {
    this.form.enable();
    this.toast?.addMessage(`"${this.form.get('name')?.value ?? 'data'}" was saved successfully.`, 'Saved', ToastLevelEnum.success);
  }

  protected onDeleteSuccess() {
    this.form.enable();
    const message = this.form.get('name')?.value ?? this.form.get('title')?.value;
    this.toast?.addMessage(`"${message}" was deleted successfully.`, 'Deleted', ToastLevelEnum.success);
    this.navigateToParent(false);
  }
}
