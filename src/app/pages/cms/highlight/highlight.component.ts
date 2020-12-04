import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastService, AbstractDetailComponent, DialogResult } from '@nusantara/core';
import { INamedHrefEntity } from '@nusantara/models/base';
import { HighlightService } from '@nusantara/services';
import { IHighlight } from '@nusantara/models';
import { ProductSelectionModalComponent } from '@nusantara/shared';
import { IProduct } from '@nusantara/models/products';


@Component({
  selector: 'nus-highlight-detail',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Highlight">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span>Name</span>
        <input type="text" [formControl]="name" name="name">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span>Description</span>
        <textarea [formControl]="description" id="description" name="description"></textarea>
        <nus-field-errors [control]="description"></nus-field-errors>
      </label>

      <label>
        <span>Vendor</span>
        <select [formControl]="forVendor" name="forVendor">
          <option [value]=''> </option>
          <option *ngFor="let v of vendorChoices" [ngValue]="v.href">{{ v.name }}</option>
        </select>
        <small> if choosen it will show in brand detail page </small>
        <nus-field-errors [control]="forVendor"></nus-field-errors>
      </label>

      <table>
        <thead>
        <tr>
          <th>Product</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let control of productHighlights.controls; let i=index">
          <td>{{ control.get('name').value }}</td>
          <td>
            <button (click)="productHighlights.removeAt(i)" type="button" class="remove-button">
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

      <label>
        <span>Sort Priority</span>
        <input type="number" [formControl]="sortPriority" name="sortPriority">
        <nus-field-errors [control]="sortPriority"></nus-field-errors>
      </label>

      <label class="without-field-errors">
        <input type="checkbox" [formControl]="isActive" name="isActive"> Is Active
      </label>

      <label class="without-field-errors">
        <input type="checkbox" [formControl]="isShowHomepage" name="isShowHomepage"> Is Show Homepage
      </label>

      <label>
        <span>Mini Banner</span>
        <img [src]="bannerPreviewUrl" alt="Mini Banner" class="preview">
        <small>Recommended: 234 x 324 pixels</small>
        <input type="file"
               [formControl]="banner"
               (change)="setPhotoPreview($event, 'banner')"
               name="banner"
               accept="image/*">
      </label>

      <label>
        <span>Background</span>
        <img [src]="backgroundPreviewUrl" alt="Background" class="preview">
        <small>Recommended: 1152 x 120 pixels</small>
        <input type="file"
               [formControl]="background"
               (change)="setPhotoPreview($event, 'background')"
               name="background"
               accept="image/*">
      </label>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>

      <!-- Modals -->
      <nus-product-selection-modal></nus-product-selection-modal>
    </form>
  `,
  styles: [
    '.ck-editor__main { min-height: 150px; }',
    'img { max-height: 240px; max-width: 240px; }',
    'form label {margin-bottom: 10px;}',
    'table {margin-bottom: 20px}'
  ]
})
export class HighlightComponent extends AbstractDetailComponent<IHighlight> implements OnInit, AfterViewInit {

  @ViewChild(ProductSelectionModalComponent) productSelectionModal: ProductSelectionModalComponent;

  bannerPreviewUrl: string;
  backgroundPreviewUrl: string;
  vendorChoices: Array<INamedHrefEntity> = [];

  entity?: IHighlight;

  constructor(service: HighlightService,
              public fb: FormBuilder,
              toast: ToastService,
              route: ActivatedRoute,
              router: Router) {
    super(route, router, toast, service);
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { vendors: INamedHrefEntity[] }) => {
      this.vendorChoices = data.vendors;
    });
    super.ngOnInit();
  }

  initializeForm(entity?: IHighlight) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, Validators.maxLength(50)]],
      href: [entity?.href],
      banner: ['', []],
      background: ['', []],
      description: [entity?.description],
      forVendor: [entity?.forVendor?.href],
      productHighlights: this.fb.array([]),
      sortPriority: [entity?.sortPriority ?? 0, [Validators.required, Validators.min(0)]],
      isActive: [entity?.isActive ?? true, [Validators.required]],
      isShowHomepage: [entity?.isShowHomepage ?? false, [Validators.required]]
    });

    this.entity = entity;

    this.setPhotoPreview(entity?.banner, 'banner');
    this.setPhotoPreview(entity?.background, 'background');

    for (const prod of entity?.productHighlights ?? []) {
      this.addProduct(prod);
    }
  }

  ngAfterViewInit() {
    this.productSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed());
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get banner(): FormControl {
    return this.form.get('banner') as FormControl;
  }

  get background(): FormControl {
    return this.form.get('background') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get forVendor(): FormControl {
    return this.form.get('forVendor') as FormControl;
  }

  get productHighlights(): FormArray {
    return this.form.get('productHighlights') as FormArray;
  }

  get sortPriority(): FormControl {
    return this.form.get('sortPriority') as FormControl;
  }

  get isActive(): FormControl {
    return this.form.get('isActive') as FormControl;
  }

  get isShowHomepage(): FormControl {
    return this.form.get('isShowHomepage') as FormControl;
  }

  addProduct(product: INamedHrefEntity) {
    this.productHighlights.push(
      this.fb.group({
        href: [product.href],
        name: [product.name]
      }));
  }

  selectProduct() {
    this.productSelectionModal.open();
  }

  onProductSelectionModalClosed() {
    if (this.productSelectionModal.result === DialogResult.OK) {

      const selectedProduct = this.productSelectionModal.product.value as IProduct;

      const f = this.fb.group({
        href: [selectedProduct.href, []],
        name: [selectedProduct.name, []]
      });
      this.productHighlights.push(f);
    }
  }

  setPhotoPreview(data?: Event | string, code?: string) {
    super.setImagePreview(data, (dataAsUrl) => {
      if (code === 'banner') {
        this.bannerPreviewUrl = dataAsUrl;
      } else {
        this.backgroundPreviewUrl = dataAsUrl;
      }
    });
  }

  save() {
    if (!!this.entity?.href && !!this.entity?.banner && !this.form.get('banner').value) {
      this.form.removeControl('banner');
    }
    if (!!this.banner && this.bannerPreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.banner = this.bannerPreviewUrl;
    }
    if (this.backgroundPreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.background = this.backgroundPreviewUrl;
    }
    super.save();
  }
}
