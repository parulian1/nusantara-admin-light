import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { AbstractEditingComponent, DialogResult } from '@nusantara/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
import {fileTypeValidator} from '@nusantara/core/helpers/validators';

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
      <form #modalForm>
        <img [src]="imagePreviewUrl" alt="Image Preview">
        <input type="hidden" [formControl]="href" name="href">
        <input type="hidden" [formControl]="type" name="type">
        <input type="hidden" [formControl]="youtubeVideoId" name="youtubeVideoId">

        <input type="file" [formControl]="image"
               (change)="setMediaImage($event)"
               accept="image/jpeg, image/png"
               #imageInput name="image">
        <input type="hidden" [formControl]="sortPriority" name="sortPriority">
        <input type="hidden" [formControl]="identifier" name="identifier">
        <button [disabled]="form.invalid" (click)="close()" type="button" class="control" i18n>Save</button>
        <button (click)="cancel()" type="button" class="control secondary" i18n>Cancel</button>
      </form>
    </ngx-smart-modal>
  `,
  styles: [ 'img { max-width: 100%; }' ]
})
export class NewProductImageComponent extends AbstractEditingComponent implements OnInit, AfterViewInit {

  @ViewChild('imageInput') imageInput: ElementRef;
  @ViewChild('modalForm') formView: ElementRef<HTMLFormElement>;
  @ViewChild('modal') modal: NgxSmartModalComponent;

  result: DialogResult;

  imagePreviewUrl: string;
  priorityValue = 1;

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
      image: ['', [Validators.required, ]],
      sortPriority: [this.priorityValue, [Validators.required, ]],
      identifier: [  this.randomString(10), [Validators.required, ]],
      type: ['image', [Validators.required, ]],
      youtubeVideoId: [null, []],
      imageName: ['', []]
    });
  }

  get type(): FormControl { return this.form.get('type') as FormControl; }
  get image(): FormControl { return this.form.get('image') as FormControl; }
  get youtubeVideoId(): FormControl { return this.form.get('youtubeVideoId') as FormControl; }
  get sortPriority(): FormControl { return this.form.get('sortPriority') as FormControl; }
  get identifier(): FormControl { return this.form.get('identifier') as FormControl; }

  setMediaImage(data?: Event|string) {
    if (data instanceof Event) {
      this.image.setValidators([
        Validators.required,
        fileTypeValidator(['image/jpg', 'image/jpeg', 'image/png'],
          (data?.target as HTMLInputElement)?.files )
      ]);
      this.image.updateValueAndValidity();
      this.form.get('imageName').patchValue((data?.target as HTMLInputElement)?.files[0].name);
    }
    this.setImagePreview(data,  (url) => this.imagePreviewUrl = url);
  }

  getValue(): FormData {
    if (this.result !== DialogResult.OK) {
      return null;
    }
    return new FormData(this.formView.nativeElement);
  }

  open(priority?: number) {
    this.priorityValue = !!priority ? priority : 1;
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
    for ( let i = 0; i < length; i++ ) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }
}



