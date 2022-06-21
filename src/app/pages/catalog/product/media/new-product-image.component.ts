import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {AbstractEditingComponent, DialogResult, Logger} from '@nusantara/core';
import {NgxSmartModalComponent} from 'ngx-smart-modal';
import {fileSizeValidator, fileTypeValidator, maxFileValidator} from '@nusantara/core/helpers/validators';

const logger = new Logger('NewProductImage');

/**
 * Dialog component that allows the user to select a single image
 * from their local machine for uploading.
 *
 * @see IProduct
 */
@Component({
  selector: 'nus-new-product-image',
  template: `
    <ngx-smart-modal [identifier]="'newImageModal'" #modal [formGroup]="form" [title]="'Upload Image'" *ngIf="!!form">
      <h1 i18n>Upload Image</h1>
      <p i18n>Maximum of {{(maxNumber - priorityValue) + 1}} file allowed, with {{MAX_FILE_SIZE}} KB file size</p>
      <form #modalForm>
        <ng-container *ngIf="!!imagePreviewUrls && imagePreviewUrls?.length > 0">
          <div class="image-preview">
            <img *ngFor="let imageUrl of imagePreviewUrls" [src]="imageUrl" alt="Image Preview" i18n-alt>
          </div>
        </ng-container>
        <input type="hidden" [formControl]="href" name="href">
        <input type="hidden" [formControl]="type" name="type">
        <input type="hidden" [formControl]="youtubeVideoId" name="youtubeVideoId">

        <input type="file" [formControl]="image"
               (change)="setMediaImage($event)"
               accept="image/jpeg, image/png"
               multiple
               #imageInput name="image">
        <nus-field-errors [control]="image"></nus-field-errors>
        <input type="hidden" [formControl]="sortPriority" name="sortPriority">
        <input type="hidden" [formControl]="identifier" name="identifier">
        <button [disabled]="form.invalid" (click)="close()" type="button" class="control" i18n>Save</button>
        <button (click)="cancel()" type="button" class="control secondary" i18n>Cancel</button>
      </form>
    </ngx-smart-modal>
  `,
  styles: ['img { max-width: 100%; }',
    `.image-preview {
      display: flex;
      max-width: 90%;
      flex-wrap: wrap;
      gap: 8px 8px;
    }

    .image-preview img {
      max-height: 48px;
    }
    `]
})
export class NewProductImageComponent extends AbstractEditingComponent implements OnInit, AfterViewInit {
  readonly MAX_FILE_SIZE = 2048;

  @ViewChild('imageInput') imageInput: ElementRef;
  @ViewChild('modalForm') formView: ElementRef<HTMLFormElement>;
  @ViewChild('modal') modal: NgxSmartModalComponent;

  result: DialogResult;

  imagePreviewUrl: string;
  priorityValue = 1;

  imagePreviewUrls: Array<string> = [];
  imageUploadForm: Array<{
    fd: FormData,
    fg: FormGroup,
  }>;
  public maxNumber: number;

  constructor(protected fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    this.modal.onOpen.subscribe(() => {
      this.initializeForm();
      this.result = DialogResult.Cancelled;
      this.setMediaImage(null);
    });
  }

  /**
   * Sets the modals form to a new empty set of data.
   */
  private initializeForm(): void {
    this.form = this.fb.group({
      href: ['', []],
      image: ['', [Validators.required,]],
      sortPriority: [this.priorityValue, [Validators.required,]],
      identifier: [this.randomString(10), [Validators.required,]],
      type: ['image', [Validators.required,]],
      youtubeVideoId: [null, []],
      imageName: ['', []]
    });
    this.imagePreviewUrls = [];
    this.imageUploadForm = [];
  }

  get type(): FormControl {
    return this.form.get('type') as FormControl;
  }

  get image(): FormControl {
    return this.form.get('image') as FormControl;
  }

  get youtubeVideoId(): FormControl {
    return this.form.get('youtubeVideoId') as FormControl;
  }

  get sortPriority(): FormControl {
    return this.form.get('sortPriority') as FormControl;
  }

  get identifier(): FormControl {
    return this.form.get('identifier') as FormControl;
  }

  setMediaImage(data?: Event | string) {
    if (data instanceof Event) {
      logger.debug('setMediaImage', data);
      this.imagePreviewUrls = [];
      this.imageUploadForm = [];
      this.image.setValidators([
        Validators.required,
        maxFileValidator((this.maxNumber - this.priorityValue) + 1, (data?.target as HTMLInputElement)?.files),
        fileTypeValidator(['image/jpg', 'image/jpeg', 'image/png'],
          (data?.target as HTMLInputElement)?.files),
        fileSizeValidator(this.MAX_FILE_SIZE, (data?.target as HTMLInputElement)?.files),
      ]);
      this.image.updateValueAndValidity();
      this.form.get('imageName').patchValue((data?.target as HTMLInputElement)?.files[0].name);
    }
    this.setImagePreview(data, (url) => this.imagePreviewUrl = url);
  }

  getValue(): FormData {
    if (this.result !== DialogResult.OK) {
      return null;
    }
    return new FormData(this.formView.nativeElement);
  }

  open(priority?: number, maxNumber?: number) {
    this.priorityValue = !!priority ? priority : 1;
    this.maxNumber = !!maxNumber ? maxNumber : 0;
    this.modal.open();
  }

  get onClose(): EventEmitter<any> {
    return this.modal.onClose;
  }

  close() {
    this.result = DialogResult.OK;
    this.modal.close();
  }

  cancel() {
    this.modal.close();
  }

  randomString(length) {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  setImagePreview(data: Event | string, setterFn: (dataAsUrl) => void) {
    if (!data) {
      setterFn(this.emptyImagePreviewURL);
    } else if (data instanceof Event) {
      const target = data.target as HTMLInputElement;
      let xForm = null;
      let xData: any = null;
      for (let x = 0; x < target.files.length; x++) {
        let formData: FormData = null;

        this.readFileURLImage(target.files[x], (url) => {
          this.imagePreviewUrls[x] = url;
          const img = new Image();
          img.src = url;
          img.onload = () => {
            logger.debug('image-size', img.width, img.height);
            if (img.width < 300 || img.height < 300) {

            }
          };
        });
        const ident = this.randomString(10);
        formData = new FormData();
        formData.append('href', '');
        formData.append('sortPriority', (this.priorityValue + x).toString(10));
        formData.append('type', 'image');
        formData.append('youtubeVideoId', null);
        formData.append('identifier', ident);
        formData.append('imageName', target.files[x].name);
        formData.append('image', target.files[x]);

        xForm = this.fb.group({
          href: ['', []],
          image: ['', [Validators.required,]],
          sortPriority: [this.priorityValue + x, [Validators.required,]],
          identifier: [ident, [Validators.required,]],
          type: ['image', [Validators.required,]],
          youtubeVideoId: [null, []],
          imageName: [target.files[x].name, []]
        });
        logger.debug(target.files[x]);
        xForm.get('image').patchValue(target.files[x]);

        xData = {
          fd: formData,
          fg: xForm
        };

        this.imageUploadForm.push(xData);
      }
    } else {
      setterFn(data);
    }
  }

  /**
   * Reads the file set on an HTMLInputElement, and returns that file as a data url
   * that is returned to the callback function.  This is only safe to call on
   * image.
   */
  readFileURLImage(file: File, callback: (dataAsURL: string) => void) {
    if (!!file) {
      const reader = new FileReader();
      reader.onload = (ev) => callback(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      callback(this.emptyImagePreviewURL);
    }
  }
}



