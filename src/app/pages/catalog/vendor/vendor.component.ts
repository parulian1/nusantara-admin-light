import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {AbstractDetailComponent, DialogResult, Logger, ToastService} from '@nusantara/core';
import {IVendor} from '@nusantara/models';
import {VendorService} from '@nusantara/services';
import {ConfirmModalComponent} from '@nusantara/shared/confirm-modal.component';
import {fileTypeValidator} from '@nusantara/core/helpers/validators';

const logger = new Logger('VendorComponent');

@Component({
  selector: 'nus-vendor',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Vendor">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()" #f>
      <div class="wrapper-border">
        <h1 class="heading-1" i18n>General Information</h1>
        <input type="hidden" [formControl]="href" name="href"> <!-- required for non-JSON form posting -->

        <label class="toggle">
          <input id="s2"
                 type="checkbox"
                 class="toggle"
                 [formControl]="isActive"
                 name="is-active"
                 data-qa="is-active"/>
          <span i18n>Is Active</span>
          <nus-field-errors [control]="isActive"></nus-field-errors>
        </label>
        <label>
          <span i18n>Vendor Name</span>
          <input type="text" [formControl]="name" name="name"
                 placeholder="Input vendor name" i18n-placeholder>
          <span class="input-error-info">
          <nus-field-errors [control]="name"></nus-field-errors>
          </span>
        </label>

        <label>
          <span i18n>Description Vendor</span>
          <textarea [formControl]="description" name="description" rows="10" class="input-description"
                    placeholder="Input vendor description"></textarea>

          <span class="input-error-info">
          <nus-field-errors [control]="description"></nus-field-errors>
             <nus-field-length-counter [control]="description"
                                       [maxLength]="VENDOR_DESCRIPTION_MAX_LENGTH"></nus-field-length-counter>
          </span>
        </label>

        <label>
          <span i18n>Icon Image</span>
          <small i18n>Recommended 120px x 120px (1:1)</small>
          <img [src]="iconImagePreviewUrl" id="icon-image-preview" alt="Icon Image" class="preview">
          <input type="file"
                 [formControl]="iconImage"
                 (change)="setIconImagePreview($event)"
                 name="iconImage"
                 accept="image/jpeg, image/png">
          <nus-field-errors [control]="iconImage"></nus-field-errors>
        </label>

        <label>
          <span i18n>Banner Image</span>
          <small i18n>Recommended: 1152px x 350px (16:5)</small>
          <img [src]="bannerImagePreviewUrl" id="banner-image-preview" alt="Banner Image" class="preview">
          <input type="file"
                 [formControl]="bannerImage"
                 (change)="setBannerImagePreview($event)"
                 name="bannerImage"
                 accept="image/jpeg, image/png">

          <nus-field-errors [control]="bannerImage"></nus-field-errors>
        </label>

        <label>
          <span i18n>SEO Description</span>

          <textarea [formControl]="seoDescription" name="seoDescription"
                    placeholder="Input SEO Description" i18n-placeholder></textarea>
          <span class="input-error-info">
            <nus-field-errors [control]="seoDescription"></nus-field-errors>
            <nus-field-length-counter [control]="seoDescription"
                                      [maxLength]="SEO_MAX_LENGTH"></nus-field-length-counter>
          </span>


        </label>

        <label>
          <span i18n>SEO Keywords</span>

          <textarea type="text" [formControl]="seoKeywords" name="seoKeywords" placeholder="Input SEO Keyword"
                    i18n-placeholder></textarea>
          <span class="input-error-info">
            <nus-field-errors [control]="seoKeywords"></nus-field-errors>
             <nus-field-length-counter [control]="seoKeywords" [maxLength]="SEO_MAX_LENGTH"></nus-field-length-counter>
          </span>


        </label>

      </div>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
    <nus-confirm-modal
      [title]="confirmCategoryTitle + name?.value + '?'"
      [content]="confirmCategoryContent">
    </nus-confirm-modal>
  `,
  styles: [
    '#icon-image-preview { height:120px; width: 120px; }',
    '#banner-image-preview { height:125px; width: 400px; }',
    'input[type=file] { display: none }',
    `.input-error-info {
      display: flex;
      justify-content: space-between;
    }
    `
  ]
})
export class VendorComponent extends AbstractDetailComponent<IVendor> implements AfterViewInit {
  VENDOR_NAME_MAX_LENGTH = 50;
  VENDOR_DESCRIPTION_MAX_LENGTH = 3000;
  SEO_MAX_LENGTH = 160;

  confirmCategoryTitle = 'Delete this vendor ';
  confirmCategoryContent = 'Are you sure you want to delete this vendor';
  @ViewChild('f') formView: ElementRef<HTMLFormElement>;
  @ViewChild(ConfirmModalComponent) confirmModal: ConfirmModalComponent;

  iconImagePreviewUrl: string;
  bannerImagePreviewUrl: string;

  entity?: IVendor;


  constructor(service: VendorService,
              route: ActivatedRoute,
              router: Router,
              private fb: FormBuilder,
              toast: ToastService) {
    super(route, router, toast, service);
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.confirmModal.onClose.subscribe(() => this.onConfirmModalClosed());
  }

  private onConfirmModalClosed(): void {
    if (this.confirmModal.result === DialogResult.OK) {
      this.service.delete(this.form.value).subscribe(
        resp => {
          if (resp.success) {
            this.onDeleteSuccess();
          } else {
            this.onDeleteError(resp);
          }
        },
        (err) => this.onDeleteError(err)
      );
      this.form.disable();
    }
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get href(): FormControl {
    return this.form.get('href') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get internalNotes(): FormControl {
    return this.form.get('internalNotes') as FormControl;
  }

  get iconImage(): FormControl {
    return this.form.get('iconImage') as FormControl;
  }

  get bannerImage(): FormControl {
    return this.form.get('bannerImage') as FormControl;
  }

  get isActive(): FormControl {
    return this.form.get('isActive') as FormControl;
  }

  get extra(): FormGroup {
    return this.form.get('extra') as FormGroup;
  }

  get seoDescription(): FormControl {
    return this.extra.get('seoDescription') as FormControl;
  }

  get seoKeywords(): FormControl {
    return this.extra.get('seoKeywords') as FormControl;
  }

  initializeForm(entity?: IVendor) {
    this.entity = entity;
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, Validators.maxLength(this.VENDOR_NAME_MAX_LENGTH)]],
      href: [entity?.href, []],
      description: [entity?.description ?? '', [Validators.maxLength(this.VENDOR_DESCRIPTION_MAX_LENGTH), ]],
      internalNotes: [entity?.internalNotes ?? '', []],
      iconImage: ['', entity?.iconImage ? [] : [Validators.required,]],
      bannerImage: ['', []],
      extra: this.fb.group({
        seoDescription: [entity?.extra?.seoDescription ?? '', [Validators.maxLength(this.SEO_MAX_LENGTH)]],
        seoKeywords: [entity?.extra?.seoKeywords ?? '', [Validators.maxLength(this.SEO_MAX_LENGTH)]]
      }),
      isActive: [!!entity?.href ? entity?.isActive : true,]
    });

    this.setBannerImagePreview(entity?.bannerImage);
    this.setIconImagePreview(entity?.iconImage);
    this.isActive.markAsTouched();
  }

  setIconImagePreview(data?: Event | string) {
    if (data instanceof Event) {
      this.iconImage.setValidators([
        Validators.required,
        fileTypeValidator(['image/jpg', 'image/jpeg', 'image/png'], (data?.target as HTMLInputElement)?.files )
      ]);
      this.iconImage.updateValueAndValidity();
    }
    this.setImagePreview(data, (dataAsUrl) => this.iconImagePreviewUrl = dataAsUrl);
  }

  setBannerImagePreview(data?: Event | string) {
    if (data instanceof Event) {
      this.bannerImage.setValidators([
        fileTypeValidator(['image/jpg', 'image/jpeg', 'image/png'], (data?.target as HTMLInputElement)?.files )
      ]);
      this.bannerImage.updateValueAndValidity();
    }
    this.setImagePreview(data, (dataAsUrl) => this.bannerImagePreviewUrl = dataAsUrl);
  }

  save() {
    if (!!this.entity?.href && !!this.entity?.iconImage && !this.iconImage.value) {
      this.form.removeControl('iconImage');
    }
    if (!!this.entity?.href && !!this.entity?.iconImage && !this.bannerImage.value) {
      this.form.removeControl('bannerImage');
    }
    if (!!this.iconImage && this.iconImagePreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.iconImage = this.iconImagePreviewUrl;
    }
    if (!!this.bannerImage && this.bannerImagePreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.bannerImage = this.bannerImagePreviewUrl;
    }
    super.save();
  }

  delete() {
    this.confirmModal.open();
  }
}
