import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';

import { ProductPromotionService, ProductService } from '@nusantara/services';
import { AbstractDetailComponent, DialogResult, ToastService } from '@nusantara/core';
import { INamedHrefEntity } from '@nusantara/models/base';
import { IProductPromotion, ProductPromotionType } from '@nusantara/models';
import { IProduct } from '@nusantara/models/products';
import { ProductSelectionModalComponent } from '@nusantara/shared';

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
        <input type="text" [formControl]="name" maxlength="50">
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
        <input type="number" [formControl]="amount" placeholder="Ex, 10000000">
        <nus-field-errors [control]="amount"></nus-field-errors>
      </label>

      <label>
        <span>Minimum Order Amount</span>
        <input type="number" [formControl]="minimumOrderAmount" placeholder="Ex, 10000000">
        <nus-field-errors [control]="minimumOrderAmount"></nus-field-errors>
      </label>

      <label>
        <span>Max Amount</span>
        <input type="text" [formControl]="maxAmount" placeholder="Ex, 10000000">
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

      <label>
        <span>Priority</span>
        <input type="number" [formControl]="priority">
        <nus-field-errors [control]="priority"></nus-field-errors>
      </label>

      <label>
        <span>Image</span>
        <img *ngIf="imagePreviewUrl" [src]="imagePreviewUrl" alt="Banner Image" class="preview">
        <input type="file" [formControl]="banner" (change)="setImagePreview($event)"
               name="bannerImage" accept="image/*">
        <nus-field-errors [control]="banner"></nus-field-errors>
      </label>


      <h2>
        Promotion Products
        <button type="button" class="control" (click)="uploadProductXLSX()">
          <i class="material-icons">publish</i>
          <span>Upload from XLSX</span>
        </button>
      </h2>

      <table>
        <thead>
        <tr>
          <th>#</th>
          <th>Product</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let control of products.controls; let i=index">
          <th>{{ i }}</th>
          <td>{{ control.get('name').value }}</td>
          <td>
            <button (click)="products.removeAt(i)" type="button" class="remove-button">
              <i class="material-icons">remove_circle_outline</i>
            </button>
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <button type="button" (click)="selectProduct()" class="add-button">
              Add Product
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <a href="{{ service.productListDownloadUrl }}" target="_blank">Download Product List</a>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>

      <!-- Modals -->
      <nus-product-selection-modal></nus-product-selection-modal>

    </form>
  `,
  styles: []
})
export class ProductPromotionComponent extends AbstractDetailComponent<IProductPromotion> implements OnInit, AfterViewInit {
  entity: IProductPromotion;
  types: Array<ProductPromotionType> = ['percentage', 'amount_off', 'override_price'];
  imagePreviewUrl: string;
  @ViewChild(ProductSelectionModalComponent) productSelectionModal: ProductSelectionModalComponent;

  constructor(service: ProductPromotionService,
              route: ActivatedRoute,
              router: Router,
              toast: ToastService,
              private fb: FormBuilder,
              private productService: ProductService) {
    super(route, router, toast, service);
  }

  initializeForm(entity?: IProductPromotion) {
    this.entity = entity;
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, ]],
      href: [entity?.href, []],
      type: [entity?.type, [Validators.required]],
      amount: [entity?.amount, [Validators.required, Validators.min(0)]],
      minimumOrderAmount: [entity?.minimumOrderAmount, [Validators.required, Validators.min(0)]],
      maxAmount: [entity?.maxAmount, [Validators.required, Validators.min(0)]],
      isExclusive: [entity?.isExclusive ?? false, [Validators.required]],
      isActive: [entity?.isActive ?? true, [Validators.required]],
      validFrom: [this.convertDateTime(entity?.validFrom), [Validators.required]],
      validTo: [this.convertDateTime(entity?.validTo), []],
      priority: [entity?.priority ?? 1, [Validators.required]],
      products: this.fb.array([]),
      banner: ['', [] ]
    });

    for (const prod of entity?.products ?? []) {
      this.addProduct(prod);
    }

    this.setImagePreview(entity?.banner);
  }

  setImagePreview(data: Event | string) {
    super.setImagePreview(data, (dataAsUrl => this.imagePreviewUrl = dataAsUrl));
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
  get priority(): FormControl { return this.form.get('priority') as FormControl; }
  get isActive(): FormControl { return this.form.get('isActive') as FormControl; }
  get banner(): FormControl { return this.form.get('banner') as FormControl; }

  addProduct(product: INamedHrefEntity) {

    if ((this.products.value as Array<IProduct>).filter(p => p.href === product.href).length > 0) {
      console.log('Product already in list -- skipping');
      return;
    }

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

  //
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
    this.form.value.validFrom = this.form.value.validFrom + this.getTimeZone();
    this.form.value.validTo = this.form.value.validTo + this.getTimeZone();

    if (!!this.entity?.href && !!this.entity?.banner && !this.banner.value) {
      this.form.removeControl('banner');
    }
    if (!!this.banner && this.imagePreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.banner = this.imagePreviewUrl;
    }

    super.save();
  }
}

