import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { ToastService, AbstractDetailComponent } from '@nusantara/core';
import { INamedHrefEntity } from '@nusantara/models/base';
import { ITestimonial } from '@nusantara/models/widgets';
import { TestimonialService } from '@nusantara/services';

@Component({
  selector: 'nus-flat-page',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Testimonial">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="saveAsForm()" #f>

      <input type="hidden" [formControl]="href" name="href"> <!-- required for non-JSON form posting -->

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
               name="image"
               accept="image/*">
      </label>

      <label>
        <span>Product</span>
        <select [formControl]="product" name="product">
          <option *ngFor="let p of productChoices" [ngValue]="p.href">{{ p.name }}</option>
        </select>
        <nus-field-errors [control]="product"></nus-field-errors>
      </label>

      <label>
        <span>Vendor</span>
        <select [formControl]="vendor" name="vendor">
          <option *ngFor="let v of vendorChoices" [ngValue]="v.href">{{ v.name }}</option>
        </select>
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

      <label class="without-field-errors">
        <input type="checkbox" [formControl]="isActive" name="isActive"> Is Active
      </label>

      <div>
        <label for="content" class="external"><span>Content</span></label>
        <ckeditor [editor]="Editor"
                  [formControl]="content" id="content"></ckeditor>
        <nus-field-errors [control]="content"></nus-field-errors>
      </div>
      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
  `,
  styles: [
    '.ck-editor__main { min-height: 150px; }',
  ]
})
export class TestimonialComponent extends AbstractDetailComponent<ITestimonial> implements OnInit {

  public Editor = ClassicEditor;

  photoPreviewUrl: string;
  productChoices: Array<INamedHrefEntity> = [];
  vendorChoices: Array<INamedHrefEntity> = [];

  constructor(public service: TestimonialService,
              public fb: FormBuilder,
              public toast: ToastService,
              public route: ActivatedRoute,
              public router: Router) {
    super();
  }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get photo(): FormControl { return this.form.get('photo') as FormControl; }
  get content(): FormControl { return this.form.get('content') as FormControl; }
  get vendor(): FormControl { return this.form.get('vendor') as FormControl; }
  get product(): FormControl { return this.form.get('product') as FormControl; }
  get reviewerName(): FormControl { return this.form.get('reviewerName') as FormControl; }
  get reviewerJobTitle(): FormControl { return this.form.get('reviewerJobTitle') as FormControl; }
  get sortPriority(): FormControl { return this.form.get('sortPriority') as FormControl; }
  get isActive(): FormControl { return this.form.get('isActive') as FormControl; }

  ngOnInit(): void {
    this.route.data.subscribe((data: { products: INamedHrefEntity[], vendors: INamedHrefEntity[]}) => {
      this.vendorChoices = data.vendors;
      this.productChoices = data.products;

      console.log('vendor data was', data.vendors);
    });
    super.ngOnInit();
  }

  initializeForm(entity?: ITestimonial) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required]],
      href: [entity?.href],
      photo: ['', [Validators.required]],
      content: [entity?.content, [Validators.required]],
      vendor: [entity?.vendor, ],
      product: [entity?.product, ],
      reviewerJobTitle: [entity?.reviewerJobTitle, [Validators.required, ]],
      reviewerName: [entity?.reviewerName, [Validators.required, ]],
      sortPriority: [entity?.sortPriority ?? 0, [Validators.required, Validators.min(0)]],
      isActive: [entity?.isActive ?? true, [Validators.required, ]]
    });

    this.setPhotoPreview(entity?.photo);
  }


  setPhotoPreview(data?: Event|string) {
    super.setImagePreview(data,  (dataAsUrl) => this.photoPreviewUrl = dataAsUrl);
  }
}
