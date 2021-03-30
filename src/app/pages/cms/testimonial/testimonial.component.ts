import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@gdnnusantara/ckeditor5-build/build/ckeditor';

import {ToastService, AbstractDetailComponent, DialogResult} from '@nusantara/core';
import { INamedHrefEntity } from '@nusantara/models/base';
import { ITestimonial } from '@nusantara/models/widgets';
import { TestimonialService } from '@nusantara/services';
import {ProductSelectionModalComponent} from '@nusantara/shared';
import {IProduct} from '@nusantara/models/products';
import {VendorSelectionModalComponent} from '@nusantara/shared/vendor-selection-modal/vendor-selection-modal.component';
import {IVendor} from '@nusantara/models';

@Component({
  selector: 'nus-testimonial-detail',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Testimonial">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()" #f validate-non-visible-controls>

      <label>
        <span>Name</span>
        <input type="text" [formControl]="name" name="name">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span>Icon</span>
        <img [src]="photoPreviewUrl" alt="Testimonial Picture" class="preview">
        <small>Recommended: A size</small>
        <input type="file"
               [formControl]="photo"
               (change)="setPhotoPreview($event)"
               name="photo"
               accept="image/*">
      </label>

      <label>
        <span>Product</span>
        <input type="hidden" [formControl]="product">
        <input type="text" (click)="selectProduct()" readonly [value]="selectedProduct?.name">
        <nus-field-errors [control]="product"></nus-field-errors>
      </label>

      <label>
        <span>Vendor</span>
        <input type="hidden" [formControl]="vendor">
        <input type="text" (click)="selectVendor()" readonly [value]="selectedVendor?.name">
        <nus-field-errors [control]="vendor"></nus-field-errors>
      </label>

      <label>
        <span>Reviewer Name</span>
        <input type="text" [formControl]="reviewerName" name="reviewerName">
        <nus-field-errors [control]="reviewerName"></nus-field-errors>
      </label>

      <label>
        <span>Reviewer Job Title</span>
        <input type="text" [formControl]="reviewerJobTitle" name="reviewerJobTitle">
        <nus-field-errors [control]="reviewerJobTitle"></nus-field-errors>
      </label>

      <label>
        <span>Sort Priority</span>
        <input type="number" [formControl]="sortPriority" name="sortPriority">
        <nus-field-errors [control]="sortPriority"></nus-field-errors>
      </label>

      <label class="without-field-errors checkbox">
        <input type="checkbox" [formControl]="isActive" name="isActive"> Is Active
      </label>

      <div>
        <label for="content" class="external"><span>Content</span></label>
        <ckeditor [editor]="Editor" [config]="editorConfig"
                  [formControl]="content" id="content" name="content"></ckeditor>
        <nus-field-errors [control]="content"></nus-field-errors>
      </div>
      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
    <nus-product-selection-modal #productModal></nus-product-selection-modal>
    <nus-vendor-selection-modal #vendorModal></nus-vendor-selection-modal>
  `,
  styles: [
    '.ck-editor__main { min-height: 150px; }',
    'img { max-height: 240px; max-width: 240px; }'
  ]
})
export class TestimonialComponent extends AbstractDetailComponent<ITestimonial> implements OnInit, AfterViewInit {

  @ViewChild('f') formView: ElementRef<HTMLFormElement>;

  @ViewChild('productModal') productSelectionModal: ProductSelectionModalComponent;
  @ViewChild('vendorModal') vendorSelectionModal: VendorSelectionModalComponent;

  public Editor = ClassicEditor;
  editorConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'alignment',
        'indent',
        'outdent',
        '|',
        'undo',
        'redo'
      ]
    },
    language: 'en',
    licenseKey: ''
  };

  entity?: ITestimonial;
  photoPreviewUrl: string;
  selectedProduct: INamedHrefEntity = null;
  selectedVendor: INamedHrefEntity = null;
  productChoices: Array<INamedHrefEntity> = [];
  vendorChoices: Array<INamedHrefEntity> = [];

  constructor(service: TestimonialService,
              public fb: FormBuilder,
              toast: ToastService,
              route: ActivatedRoute,
              router: Router) {
    super(route, router, toast, service);
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get photo(): FormControl {
    return this.form.get('photo') as FormControl;
  }

  get content(): FormControl {
    return this.form.get('content') as FormControl;
  }

  get vendor(): FormControl {
    return this.form.get('vendor') as FormControl;
  }

  get product(): FormControl {
    return this.form.get('product') as FormControl;
  }

  get reviewerName(): FormControl {
    return this.form.get('reviewerName') as FormControl;
  }

  get reviewerJobTitle(): FormControl {
    return this.form.get('reviewerJobTitle') as FormControl;
  }

  get sortPriority(): FormControl {
    return this.form.get('sortPriority') as FormControl;
  }

  get isActive(): FormControl {
    return this.form.get('isActive') as FormControl;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
  ngAfterViewInit() {
    this.productSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed());
    this.vendorSelectionModal.onClose.subscribe(() => this.onVendorSelectionModalClosed());

  }

  initializeForm(entity?: ITestimonial) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required]],
      href: [entity?.href],
      photo: ['', entity?.photo ? [] : [Validators.required]],
      content: [entity?.content, [Validators.required]],
      vendor: [entity?.vendor?.href, [Validators.required] ],
      product: [entity?.product?.href, [Validators.required]],
      reviewerJobTitle: [entity?.reviewerJobTitle, [Validators.required, ]],
      reviewerName: [entity?.reviewerName, [Validators.required, ]],
      sortPriority: [entity?.sortPriority ?? 0, [Validators.required, Validators.min(0)]],
      isActive: [entity?.isActive ?? true, [Validators.required, ]]
    });

    this.entity = entity;
    this.selectedProduct = entity?.product;
    this.selectedVendor = entity?.vendor;

    // need to mark as touched to make custom styling works
    this.form.controls.isActive.markAsTouched();

    this.setPhotoPreview(entity?.photo);
  }

  setPhotoPreview(data?: Event | string) {
    super.setImagePreview(data, (dataAsUrl) => this.photoPreviewUrl = dataAsUrl);
  }

  save() {
    if (!!this.entity?.href && !!this.entity?.photo && !this.form.get('photo').value) {
      this.form.removeControl('photo');
    }
    if (!!this.photo && this.photoPreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.photo = this.photoPreviewUrl;
    }
    super.save();
  }

  selectProduct() {
    this.productSelectionModal.open();
  }

  onProductSelectionModalClosed() {
    if (this.productSelectionModal.result === DialogResult.OK) {
      this.selectedProduct = this.productSelectionModal.product.value as IProduct;
      this.product.setValue(this.selectedProduct.href);

    }
  }

  selectVendor() {
    this.vendorSelectionModal.open();
  }

  onVendorSelectionModalClosed() {
    if (this.vendorSelectionModal.result === DialogResult.OK) {
      this.selectedVendor = this.vendorSelectionModal.vendor.value as IVendor;
      this.vendor.setValue(this.selectedVendor.href);
    }
  }
}
