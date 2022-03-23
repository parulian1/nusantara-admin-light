import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractDetailComponent, Logger, ToastService} from '@nusantara/core';
import {ICatalogue} from '@nusantara/models/catalogue/catalogue';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CatalogueService} from '@nusantara/services/catalogue.service';
import {HttpClient} from '@angular/common/http';
import {fileTypeValidator} from '@nusantara/core/helpers/validators';

const logger = new Logger('CatalogueComponent');


@Component({
  selector: 'nus-catalogue',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Catalogue">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()" #theForm>
      <input type="hidden" [formControl]="href" name="href"> <!-- required for non-JSON form posting -->
      <div class="wrapper-border">
        <label class="toggle">
          <input id="s2" type="checkbox"
                 class="toggle"
                 [formControl]="isActive"
                 name="is_active"
                 data-qa="is-active"/>
          <span i18n>Is Active</span>

          <nus-field-errors [control]="isActive"></nus-field-errors>
        </label>

        <label>
          <span i18n>Catalogue Title</span>
          <input type="text" [formControl]="name" name="name">
          <span class="input-error-info">
          <nus-field-errors [control]="name"></nus-field-errors>
          </span>
        </label>

        <label>
          <span i18n>Catalogue Description</span>
          <textarea type="text" [formControl]="description" name="description"></textarea>
          <span class="input-error-info">
             <nus-field-errors [control]="description"></nus-field-errors>
             <nus-field-length-counter [control]="description"
                                       [maxLength]="DESCRIPTION_MAX_LENGTH"></nus-field-length-counter>
          </span>

        </label>
        <label>
          <span i18n>Catalogue Image</span>
          <small i18n>Recommended: Format .jpg, file size max. 500kb</small>
          <img [src]="bannerImagePreviewUrl" id="banner-image-preview" alt="Image" class="preview">
          <input type="file"
                 class="image-input"
                 [formControl]="image"
                 (change)="setImageFromEvent($event)"
                 name="image"
                 accept="image/jpeg, image/png">
          <nus-field-errors [control]="image"></nus-field-errors>
        </label>

        <label>
          <span i18n>Catalog File Upload</span>
          <span>Uploaded file: <a (click)="download(entity)"
                                  title="Download {{entity?.fileName}}">{{entity?.fileName}}</a></span>
          <!--        <small i18n>Recommended: Format .jpg, Size min 540px x 402px, file size max. 500kb</small>-->
        </label>
        <label>
          <input type="hidden" [formControl]="fileName" name="fileName">

          <input type="file"
                 (change)="setFileNameFromEvent($event)"
                 name="file"
                 accept="application/pdf">
          <nus-field-errors [control]="file"></nus-field-errors>
        </label>
      </div>
      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()"
        [hideDelete]="true"
      >
      </nus-detail-actions>
    </form>
  `,
  styles: [
    `
      input[type=file].image-input {
        display: none;
      }

      img.preview {
        max-width: 50%;
        max-height: 250px;
      }
      .input-error-info {
        display: flex;
        justify-content: space-between;
      }
    `]
})
export class CatalogueComponent extends AbstractDetailComponent<ICatalogue> {
  readonly DESCRIPTION_MAX_LENGTH = 120;
  readonly NAME_MAX_LENGTH = 50;

  @ViewChild('theForm') formView: ElementRef<HTMLFormElement>;
  bannerImagePreviewUrl: string;


  constructor(service: CatalogueService,
              private http: HttpClient,
              public fb: FormBuilder,
              toast: ToastService,
              route: ActivatedRoute,
              router: Router) {
    super(route, router, toast, service);
  }

  entity: ICatalogue;

  get href(): FormControl {
    return this.form.get('href') as FormControl;
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get image(): FormControl {
    return this.form.get('image') as FormControl;
  }

  get isActive(): FormControl {
    return this.form.get('isActive') as FormControl;
  }

  get file(): FormControl {
    return this.form.get('file') as FormControl;
  }

  get fileName(): FormControl {
    return this.form.get('fileName') as FormControl;
  }

  get sortPriority(): FormControl {
    return this.form.get('sortPriority') as FormControl;
  }

  initializeForm(entity?: ICatalogue): void {
    this.entity = entity;

    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, Validators.maxLength(this.NAME_MAX_LENGTH), ]],
      href: [entity?.href],
      description: [entity?.description, [Validators.maxLength(this.DESCRIPTION_MAX_LENGTH)]],
      image: [null, !!entity?.image ? [] : [Validators.required,]],
      isActive: [!!entity?.href ? entity?.isActive : true, , []],
      file: [null, !!entity?.download ? [] : [Validators.required,]],
      fileName: ['', []],
      sortPriority: [entity?.sortPriority ?? 0, []]
    });
    this.setImageFromEvent(entity?.image);

    this.form.markAllAsTouched();
  }

  setImageFromEvent(data?: Event | string): void {
    if (data instanceof Event) {
      const file = (data.target as HTMLInputElement).files[0];
      this.image.setValidators([
        Validators.required,
        fileTypeValidator(['image/jpg', 'image/jpeg', 'image/png'], (data?.target as HTMLInputElement)?.files)
      ]);
      this.form.get('image').updateValueAndValidity();
    }
    super.setImagePreview(data, (dataAsUrl) => {
      this.bannerImagePreviewUrl = dataAsUrl;
    });
  }

  setFileNameFromEvent($event: Event): void {
    if ($event instanceof Event) {
      const file = ($event.target as HTMLInputElement).files[0];
      this.file.setValidators([
        Validators.required,
        fileTypeValidator(['application/pdf'], (event?.target as HTMLInputElement)?.files)
      ]);
      this.form.patchValue({
        file,
        fileName: file.name,
      });
      this.form.get('file').updateValueAndValidity();
    }
  }

  getFormValue(): any {
    const form = super.getFormValue();

    if (this.entity) {
      delete form.image;
    }
    return form;
  }

  /**
   * Similar to the save method, but posts form/multi-part data instead of json
   * to this API.
   */
  saveAsForm() {
    if (!this.formView) {
      throw Error('formView is null');
    }
    if (!!this.entity?.href && !!this.entity?.image && !this.image?.value) {
      this.form.removeControl('image');
    }
    if (!this.entity?.href && !!this.entity?.file && !this.file?.value) {
      this.form.removeControl('file');
      this.form.removeControl('fileName');
    }
    const formData = new FormData(this.formView.nativeElement);
    if (this.isActive.value === false) {
      formData.append('isActive', 'false');
    }
    this.form.disable();
    this.service.save(formData).subscribe(
      resp => {
        if (resp.success) {
          this.onSaveSuccess(resp);
        } else {
          this.onSaveError(resp);
        }
      });

  }

  save() {
    this.beforeSave();
    this.saveAsForm();
  }

  download(catalogue: ICatalogue) {
    this.service.getDownloadLink(catalogue)
      .subscribe(data => {
        const a = document.createElement('a');
        a.href = data.url;
        a.download = data.url.split('/').pop();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });

  }
}
