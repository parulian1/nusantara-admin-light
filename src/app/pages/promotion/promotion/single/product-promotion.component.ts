import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';

import { ProductPromotionSingleService, ProductService, SiteConfigService } from '@nusantara/services';
import { AbstractDetailComponent, DialogResult, Logger, ToastService } from '@nusantara/core';
import { INamedHrefEntity } from '@nusantara/models/base';
import { IProductBundling, IProductPromotion, IPromoGroup, ProductPromotionType} from '@nusantara/models';
import { IProduct } from '@nusantara/models/products';
import { CustomerGroupModalComponent, ProductSelectionModalComponent } from '@nusantara/shared';
import { PromoCampaignModalComponent } from '@nusantara/shared/modals/promo-campaign-modal.component';

declare var window: any; // Needed on Angular 8+

const log = new Logger('ProductPromotionComponent');

@Component({
  selector: 'nus-product-promotion',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Promo">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span i18n>Name</span>
        <input type="text" [formControl]="name" maxlength="50">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span i18n>Type</span>
        <select [formControl]="type" (ngModelChange)="onPromoTypeChange($event)">
          <option *ngFor="let t of types" [ngValue]="t">{{ t }}</option>
        </select>
      </label>

      <label *ngIf="!isPromoBundling">
        <span i18n>Minimum Order Value</span>
        <input type="number" [formControl]="minimumOrderAmount"
               placeholder="ex. 1000000">
        <nus-field-errors [control]="minimumOrderAmount"></nus-field-errors>
      </label>

      <div class="promo-date">
        <label class="promo-date-label">
          <span class="subtitle" i18n>Valid From</span>
          <nus-field-datetime [control]="validFrom" [minDate]="minDateValidFrom" [maxDate]="maxDateValidFrom"></nus-field-datetime>
          <nus-field-errors [control]="validFrom"></nus-field-errors>
        </label>

        <label class="promo-date-label">
          <span class="subtitle" i18n>Valid To</span>
          <nus-field-datetime [control]="validTo" [minDate]="minDateValidTo" [maxDate]="maxDateValidTo"></nus-field-datetime>
          <nus-field-errors [control]="validTo"></nus-field-errors>
        </label>
      </div>


      <label *ngIf="!isPromoBundling">
        <span i18n>Amount</span>
        <input type="number" [formControl]="amount"
               placeholder="ex. 1000000">
        <nus-field-errors [control]="amount"></nus-field-errors>
      </label>

      <label *ngIf="!isPromoBundling">
        <span i18n>Max Amount</span>
        <input type="number" [formControl]="maxAmount"
               placeholder="ex. 1000000">
        <nus-field-errors [control]="maxAmount"></nus-field-errors>
      </label>

      <div class="promo-bundling-condition" *ngIf="isPromoBundling">
        <span class="subheading-2" i18n>Condition</span>
        <span
          class="subtitle-condition" i18n>Requirements that customers need to meet in order for the promo to be used</span>
        <table>
          <thead>
          <tr>
            <th>#</th>
            <th i18n>Product</th>
            <th i18n>Quantity</th>
          </tr>
          </thead>
          <tbody>
          <nus-product-promo-quantity
            *ngFor="let control of productBundlingCondition.controls; let i=index"
            [index]="i"
            [form]="control"
            (remove)="removeProductCondition(i)">
          </nus-product-promo-quantity>
          <tr>
            <td colspan="3">
              <button type="button" (click)="selectProductBundlingCondition()" class="new-add-button wide" i18n>
                <i class="material-icons">add</i> Add Product
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="promo-bundling-benefit" *ngIf="isPromoBundling">
        <span class="subheading-2" i18n>Benefit</span>
        <span
          class="subtitle-condition" i18n>The benefits that customers will get</span>
        <table>
          <thead>
          <tr>
            <th>#</th>
            <th i18n>Product</th>
            <th i18n>Quantity</th>
          </tr>
          </thead>
          <tbody>
          <nus-product-promo-quantity
            *ngFor="let control of productBundlingBenefit.controls; let i=index"
            [index]="i"
            [form]="control"
            (remove)="removeProductBenefit(i)">
          </nus-product-promo-quantity>
          <tr>
            <td colspan="3">
              <button type="button" (click)="selectProductBundlingBenefit()" class="new-add-button wide" i18n>
                <i class="material-icons">add</i> Add Product
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="promo-products" *ngIf="!isPromoBundling">
        <span class="upload-product">
          <h2 class="title-2" i18n>Promotion Products</h2>
          <button type="button" class="control" (click)="uploadProductXLSX()" [disabled]="checkPromoDateValid()">
            <i class="material-icons">publish</i>
            <span i18n>Upload from XLSX</span>
          </button>
        </span>

        <table>
          <thead>
          <tr>
            <th class="numeric">#</th>
            <th i18n>Product</th>
            <th i18n>Action</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let control of products?.controls; let i=index">
            <td class="numeric">{{ i + 1 }}</td>
            <td>{{ control.get('name').value }}</td>
            <td>
              <button (click)="products.removeAt(i)" [disabled]="checkPromoDateValid()" type="button" class="remove-button">
                <i class="material-icons">remove_circle_outline</i>
              </button>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <button type="button" (click)="selectProduct()" [disabled]="checkPromoDateValid()" class="new-add-button wide" i18n>
                <i class="material-icons">add</i> Add Product
              </button>
            </td>
          </tr>
          </tbody>
        </table>

        <a class="download-product" href="{{ service.productListDownloadUrl }}" target="_blank" *ngIf="hasProductUrl" i18n>Download
          Product
          List</a>
      </div>

      <label *ngIf="!isPromoBundling" class="checkbox">
        <input type="checkbox" class="input-checkbox" [formControl]="isExclusive">
        <span i18n>Is Exclusive</span>
        <nus-field-errors [control]="isExclusive"></nus-field-errors>
      </label>

      <label class="checkbox">
        <input type="checkbox" class="input-checkbox" [formControl]="isActive">
        <span i18n>Is Active</span>
        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>

      <label *ngIf="isPromoBundling" class="checkbox">
        <input type="checkbox" class="input-checkbox" [formControl]="multiplyItem">
        <span i18n>Multiply Item</span>
        <nus-field-errors [control]="multiplyItem"></nus-field-errors>
      </label>

      <label *ngIf="!isPromoBundling" class="promo-platform">
        <span class="subtitle" i18n>Platform</span>
        <label class="checkbox">
          <input type="checkbox" [formControl]="appliedOnOnline" name="appliedOnOnline">
          <span i18n>Online (Website)</span>
        </label>
        <label class="checkbox" *ngIf="enterpriseLicense()">
          <input type="checkbox" [formControl]="appliedOnOffline" name="appliedOnOffline">
          <span i18n>Offline (POS)</span>
        </label>
      </label>

      <label class="checkbox">
        <span class="subtitle" i18n>Priority</span>
        <input type="number" [formControl]="priority">
        <nus-field-errors [control]="priority"></nus-field-errors>
      </label>

      <label *ngIf="!isPromoBundling">
        <span class="subtitle" i18n>Image</span>
        <img *ngIf="imagePreviewUrl" [src]="imagePreviewUrl" alt="Banner Image" class="preview">
        <input type="file" [formControl]="banner" (change)="setImagePromoPreview($event)"
               name="bannerImage" accept="image/*">
        <nus-field-errors [control]="banner"></nus-field-errors>
      </label>

      <div class="promo-customer-groups" >
        <span class="upload-product">
          <h2 class="title-2" i18n>Customer Groups</h2>
        </span>

        <table>
          <thead>
          <tr>
            <th i18n>Name</th>
            <th i18n>Action</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let control of customerGroups?.controls; let i=index">
            <td>{{ control.get('name').value }}</td>
            <td>
              <button (click)="customerGroups.removeAt(i)" type="button" class="remove-button">
                <i class="material-icons">remove_circle_outline</i>
              </button>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <button type="button" (click)="selectCustomerGroup()" class="new-add-button wide" i18n>
                <i class="material-icons">add</i> Add Customer Group
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <label>
        <span i18n>Promo Campaign</span>
        <div class="manage">
          <div>
            <input type="hidden" [formControl]="promotionGroup" data-qa="campaign">
            <input type="text" (click)="selectPromotionGroup()" readonly [value]="selectedPromotionGroup?.name"
                   data-qa="promotion-group-pop">
            <nus-field-errors [control]="promotionGroup"></nus-field-errors>
          </div>
        </div>
      </label>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>

      <!-- Modals -->
      <nus-product-selection-modal #conditionModal></nus-product-selection-modal>
      <nus-product-selection-modal #benefitModal></nus-product-selection-modal>
      <nus-product-selection-modal #productModal></nus-product-selection-modal>
      <nus-customer-group-selection-modal [selectedGroups]="entity?.customerGroups" #customerGroupModal>
      </nus-customer-group-selection-modal>
      <nus-promo-campaign-selection-modal #promotionGroupModal></nus-promo-campaign-selection-modal>
    </form>
  `,
  styles: [`
    .promo-date {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-column-gap: 30px;
    }

    .checkbox {
      padding: 10px 0;
      min-height: auto;
      width: fit-content
    }

    .promo-products, .promo-customer-groups {
      margin: 10px 0;
      display: flex;
      flex-direction: column;
    }

    .upload-product {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .upload-product button {
      display: flex;
      align-items: center;
    }

    .download-product {
      margin-top: 5px;
    }

    .promo-bundling-benefit {
      margin: 16px 0;
      display: flex;
      flex-direction: column;
    }

    .promo-bundling-condition {
      display: flex;
      flex-direction: column;
    }

    .subtitle-condition {
      font-size: 12px;
      line-height: 20px;
      color: var(--darken-grey);
    }

    .promo-customer-groups {
      margin-bottom: 24px;
    }

  `]
})
export class ProductPromotionComponent extends AbstractDetailComponent<IProductPromotion> implements OnInit, AfterViewInit {

  entity: IProductPromotion;
  types: Array<ProductPromotionType> = ['percentage', 'amount_off', 'override_price'];
  imagePreviewUrl: string;
  isPromoBundling = false;

  hasProductUrl = false;
  minDateValidTo: string | Date = null;
  maxDateValidTo: string | Date = null;
  minDateValidFrom: string | Date = null;
  maxDateValidFrom: string | Date = null;

  selectedPromotionGroup: INamedHrefEntity = null;

  @ViewChild('productModal') productSelectionModal: ProductSelectionModalComponent;
  @ViewChild('conditionModal') productBundlingConditionSelectionModal: ProductSelectionModalComponent;
  @ViewChild('benefitModal') productBundlingBenefitSelectionModal: ProductSelectionModalComponent;
  @ViewChild('customerGroupModal') customerGroupSelectionModal: CustomerGroupModalComponent;
  @ViewChild('promotionGroupModal') promotionGroupSelectionModal: PromoCampaignModalComponent;

  constructor(service: ProductPromotionSingleService,
              route: ActivatedRoute,
              router: Router,
              toast: ToastService,
              private fb: FormBuilder,
              private configService: SiteConfigService,
              private productService: ProductService) {
    super(route, router, toast, service);
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.configService.isEnterpriseLicense()) {
      this.types.push('promo_bundling');
    }
  }

  initializeForm(entity?: IProductPromotion) {
    this.entity = entity;
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required]],
      href: [entity?.href, []],
      type: [entity?.type, [Validators.required]],
      amount: [entity?.amount ?? 0, [Validators.required, Validators.min(0)]],
      minimumOrderAmount: [entity?.minimumOrderAmount ?? 0, [Validators.required, Validators.min(0)]],
      maxAmount: [entity?.maxAmount ?? 0, [Validators.required, Validators.min(0)]],
      isExclusive: [entity?.isExclusive ?? false, [Validators.required]],
      isActive: [entity?.isActive ?? true, [Validators.required]],
      appliedOnOnline: [entity?.appliedOnOnline ?? false, []],
      appliedOnOffline: [entity?.appliedOnOffline ?? false, []],
      validFrom: [this.convertDateTime(entity?.validFrom), [Validators.required]],
      validTo: [this.convertDateTime(entity?.validTo), []],
      priority: [entity?.priority ?? 1, [Validators.required]],
      products: this.fb.array([]),
      banner: ['', []],
      productBundlingBenefit: this.fb.array([]),
      productBundlingCondition: this.fb.array([]),
      multiplyItem: [entity?.multiplyItem ?? false, []],
      customerGroups: this.fb.array([]),
      promotionGroup: this.fb.group({href: [entity?.promotionGroup?.href, [Validators.required]]}),
    });

    // need to mark as touched to make custom styling works
    this.form.controls.isExclusive.markAsTouched();
    this.form.controls.isActive.markAsTouched();
    this.form.controls.multiplyItem.markAsTouched();
    this.form.controls.appliedOnOnline.markAsTouched();
    this.form.controls.appliedOnOffline.markAsTouched();

    for (const prodBenefit of entity?.productBundlingBenefit ?? []) {
      this.addProductBenefit(prodBenefit);
    }

    for (const prodCondition of entity?.productBundlingCondition ?? []) {
      this.addProductCondition(prodCondition);
    }

    for (const prod of entity?.products ?? []) {
      this.addProduct(prod);
    }

    if (this.type.value === 'promo_bundling') {
      this.isPromoBundling = true;
    }

    this.setImagePromoPreview(entity?.banner);

    if ((window.localStorage.getItem('site_domain') === 'marthatilaarshop.com') || (window.localStorage.getItem('site_domain') === 'www.marthatilaarshop.com')) {
      // TODO: Bad thing, should get this from API
      this.hasProductUrl = true;
    }

    const today = new Date();
    this.minDateValidTo = entity?.validTo ? entity.validTo : today;
    this.minDateValidFrom = entity?.validFrom ? entity.validFrom : today;

    this.selectedPromotionGroup = entity?.promotionGroup;

    if (today > new Date(entity?.validTo)) {
      // passed/historical promo, admin can not edit anything
      this.form.disable();
      this.maxDateValidFrom = entity.validFrom;
      this.maxDateValidTo = entity.validTo;
    } else if (today > new Date(entity?.validFrom)) {
      // ongoing promo, admin can ONLY edit "valid to" date and / or Inactive a promotion
      this.form.disable();
      this.form.controls.href.enable();
      this.form.controls.validTo.enable();
      this.form.controls.isActive.enable();
      this.minDateValidFrom = entity.validFrom;
      this.maxDateValidFrom = entity.validFrom;
    }

    for (const customerGroup of entity?.customerGroups ?? []) {
      this.addCustomerGroup(customerGroup);
    }


  }

  setImagePromoPreview(data?: Event | string) {
    this.setImagePreview(data, (dataAsUrl) => this.imagePreviewUrl = dataAsUrl);
  }

  ngAfterViewInit() {
    this.productSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed());
    this.productBundlingConditionSelectionModal.onClose.subscribe(() => this.onProductBundlingConditionSelectionModalClosed());
    this.productBundlingBenefitSelectionModal.onClose.subscribe(() => this.onProductBundlingBenefitSelectionModalClosed());
    this.customerGroupSelectionModal.onClose.subscribe(() => this.onCustomerGroupSelectionModalClosed());
    this.promotionGroupSelectionModal.onClose.subscribe(() => this.onPromoGroupModalClosed());
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get products(): FormArray {
    return this.form.get('products') as FormArray;
  }

  get type(): FormControl {
    return this.form.get('type') as FormControl;
  }

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  get minimumOrderAmount(): FormControl {
    return this.form.get('minimumOrderAmount') as FormControl;
  }

  get maxAmount(): FormControl {
    return this.form.get('maxAmount') as FormControl;
  }

  get isExclusive(): FormControl {
    return this.form.get('isExclusive') as FormControl;
  }

  get validFrom(): FormControl {
    return this.form.get('validFrom') as FormControl;
  }

  get validTo(): FormControl {
    return this.form.get('validTo') as FormControl;
  }

  get priority(): FormControl {
    return this.form.get('priority') as FormControl;
  }

  get isActive(): FormControl {
    return this.form.get('isActive') as FormControl;
  }

  get appliedOnOnline(): FormControl {
    return this.form.get('appliedOnOnline') as FormControl;
  }

  get appliedOnOffline(): FormControl {
    return this.form.get('appliedOnOffline') as FormControl;
  }

  get banner(): FormControl {
    return this.form.get('banner') as FormControl;
  }

  get productBundlingBenefit(): FormArray {
    return this.form.get('productBundlingBenefit') as FormArray;
  }

  get productBundlingCondition(): FormArray {
    return this.form.get('productBundlingCondition') as FormArray;
  }

  get multiplyItem(): FormControl {
    return this.form.get('multiplyItem') as FormControl;
  }

  get customerGroups(): FormArray {
    return this.form.get('customerGroups') as FormArray;
  }

  get promotionGroup(): FormControl {
    return this.form.get('promotionGroup').get('href') as FormControl;
  }

  addProduct(product: INamedHrefEntity) {
    if ((this.products.value as Array<IProduct>).filter(p => p.href === product.href).length > 0) {
      log.info('Product already in list -- skipping');
      return;
    }

    const f = this.fb.group({
      name: [product.name],
      href: [product.href]
    });

    this.products.push(f);
  }

  addProductCondition(prodCondition?: IProductBundling) {
    const f = this.fb.group({
      name: [prodCondition.name],
      href: [prodCondition.href],
      quantity: [prodCondition.quantity]
    });

    this.productBundlingCondition.push(f);
  }

  addProductBenefit(prodBenefit?: IProductBundling) {
    const f = this.fb.group({
      name: [prodBenefit.name],
      href: [prodBenefit.href],
      quantity: [prodBenefit.quantity]
    });

    this.productBundlingBenefit.push(f);
  }

  selectProduct() {
    this.productSelectionModal.open();
  }

  selectProductBundlingCondition() {
    this.productBundlingConditionSelectionModal.open();
  }

  selectProductBundlingBenefit() {
    this.productBundlingBenefitSelectionModal.open();
  }

  onProductSelectionModalClosed() {
    if (this.productSelectionModal.result === DialogResult.OK) {
      const selectedProduct = this.productSelectionModal.product.value as IProduct;

      const f = this.fb.group({
        name: [selectedProduct.name, []],
        href: [selectedProduct.href, []],
      });
      this.products.push(f);

    }
  }

  onProductBundlingConditionSelectionModalClosed() {
    if (this.productBundlingConditionSelectionModal.result === DialogResult.OK) {
      const selectedConditionProduct = this.productBundlingConditionSelectionModal.product.value as IProductBundling;

      const f = this.fb.group({
        name: [selectedConditionProduct.name, []],
        href: [selectedConditionProduct.href, []],
        quantity: [selectedConditionProduct.quantity, []]
      });
      this.productBundlingCondition.push(f);
    }
  }

  onProductBundlingBenefitSelectionModalClosed() {
    if (this.productBundlingBenefitSelectionModal.result === DialogResult.OK) {
      const selectedBenefitProduct = this.productBundlingBenefitSelectionModal.product.value as IProductBundling;

      const f = this.fb.group({
        name: [selectedBenefitProduct.name, []],
        href: [selectedBenefitProduct.href, []],
        quantity: [selectedBenefitProduct.quantity, []]
      });
      this.productBundlingBenefit.push(f);
    }
  }

  convertDateTime(timestamp: string) {
    if (timestamp) {
      const date = new Date(timestamp);

      const year = date.getFullYear();
      let month: string | number = date.getMonth() + 1; // getMonth() is zero-indexed, so we'll increment to get the correct month number
      let day: string | number = date.getDate();
      let hours: string | number = date.getHours();
      let minutes: string | number = date.getMinutes();
      let seconds: string | number = date.getSeconds();

      month = (month < 10) ? '0' + month : month;
      day = (day < 10) ? '0' + day : day;
      hours = (hours < 10) ? '0' + hours : hours;
      minutes = (minutes < 10) ? '0' + minutes : minutes;
      seconds = (seconds < 10) ? '0' + seconds : seconds;
      return (`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
    }
    return '';
  }

  getTimeZone() {
    const offset = new Date().getTimezoneOffset();
    const o = Math.abs(offset);
    return (offset < 0 ? '+' : '-') + ('00' + Math.floor(o / 60)).slice(-2) + ':' + ('00' + (o % 60)).slice(-2);
  }

  uploadProductXLSX(): void {
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.onchange = (evt: any) => {
      const target: DataTransfer = evt.target as DataTransfer;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        const sheetAsJson = XLSX.utils.sheet_to_json(ws, {header: 1});
        // start @ 1 to skip header?
        for (let i = 1; i < sheetAsJson.length; i++) {
          console.log(sheetAsJson[i][1]);

          const slug = sheetAsJson[i][1];
          this.productService.fetch(slug).subscribe(
            (product) => {
              this.addProduct(product);
            }, error => {
              console.log(`Failed to add product: ${sheetAsJson[i][0]}`);
            }
          );


        }
      };
      reader.readAsBinaryString(target.files[0]);
      // super.readFileURL(e, (data) => {
      //
      //   const wb: XLSX.WorkBook = XLSX.read(data);
      //   // type?: 'base64' | 'binary' | 'buffer' | 'file' | 'array' | 'string';
      //   console.log('Workbook!', wb);
      //
      // });
    };
    input.click();
  }

  // onFileChange(evt: any) {
  // 	/* wire up file reader */
  // 	const target: DataTransfer = <DataTransfer>(evt.target);
  // 	if (target.files.length !== 1) throw new Error('Cannot use multiple files');
  // 	const reader: FileReader = new FileReader();
  // 	reader.onload = (e: any) => {
  // 		/* read workbook */
  // 		const bstr: string = e.target.result;
  // 		const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
  //
  // 		/* grab first sheet */
  // 		const wsname: string = wb.SheetNames[0];
  // 		const ws: XLSX.WorkSheet = wb.Sheets[wsname];
  //
  // 		/* save data */
  // 		this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
  // 	};
  // 	reader.readAsBinaryString(target.files[0]);
  // }

  save() {
    console.log('form', this.form.value, this.form.getRawValue());
    this.form.value.validFrom = this.form.value.validFrom + this.getTimeZone();
    this.form.value.validTo = this.form.value.validTo + this.getTimeZone();

    if (!!this.entity?.href && !!this.entity?.banner && !this.banner.value) {
      this.form.removeControl('banner');
    }

    if (this.type.value === 'promo_bundling') {
      this.form.removeControl('products');
    }

    if (this.type.value !== 'promo_bundling') {
      this.form.removeControl('productBundlingBenefit');
      this.form.removeControl('productBundlingCondition');
    }

    if (!!this.banner && this.imagePreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.banner = this.imagePreviewUrl;
    }

    super.save();
  }

  removeProductCondition(i: number): void {
    this.productBundlingCondition.removeAt(i);
  }

  removeProductBenefit(i: number): void {
    this.productBundlingBenefit.removeAt(i);
  }

  onPromoTypeChange($event: any) {
    this.isPromoBundling = $event === 'promo_bundling';
  }

  enterpriseLicense() {
    return this.configService.isEnterpriseLicense();
  }

  checkPromoDateValid(): boolean {
    // Disable button if its not new form and voucher is ongoing, passed/historical
    const today = new Date();
    return this.entity && today > new Date(this.validFrom.value);
  }

  addCustomerGroup(customerGroup: INamedHrefEntity) {
    if ((this.customerGroups.value as Array<INamedHrefEntity>).filter(p => p.href === customerGroup.href).length > 0) {
      log.info('Customer Group already in list -- skipping');
      return;
    }

    const f = this.fb.group({
      name: [customerGroup.name],
      href: [customerGroup.href]
    });

    this.customerGroups.push(f);
  }

  onCustomerGroupSelectionModalClosed() {
    if (this.customerGroupSelectionModal.result === DialogResult.OK) {
      const selectedCustomerGroup = this.customerGroupSelectionModal.group.value as INamedHrefEntity;

      const f = this.fb.group({
        name: [selectedCustomerGroup.name, []],
        href: [selectedCustomerGroup.href, []],
      });
      this.customerGroups.push(f);

    }
  }

  selectCustomerGroup() {
    this.customerGroupSelectionModal.open();
  }

  selectPromotionGroup(): void {
    this.promotionGroupSelectionModal.open();
  }

  private onPromoGroupModalClosed(): void {
    if (this.promotionGroupSelectionModal.result === DialogResult.OK) {
      this.selectedPromotionGroup = this.promotionGroupSelectionModal.promotionGroup.value as IPromoGroup;
      this.promotionGroup.setValue(this.selectedPromotionGroup.href);
    }
  }
}

