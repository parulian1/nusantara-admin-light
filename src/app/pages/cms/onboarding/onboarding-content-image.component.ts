import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { AbstractEditingComponent, DialogResult } from '@nusantara/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';

/**
 * Dialog component that allows the user to select a single image
 * from their local machine for uploading.
 *
 *
 */
@Component({
  selector: 'nus-onboarding-content-image',
  template: `
    <ngx-smart-modal [identifier]="'onboardingContentImageModal'" #modal [formGroup]="form" [title]="'Upload Image'"
                     *ngIf="!!form">
      <h1>Upload Image</h1>
      <form #modalForm>
        <img [src]="imagePreviewUrl" alt="Image Preview">
        <input type="file" [formControl]="image" (change)="setMediaImage($event)" #imageInput name="image">

        <button [disabled]="form.invalid" (click)="close()" type="button" class="control">Save</button>
        <button (click)="cancel()" type="button" class="control secondary">Cancel</button>
      </form>
    </ngx-smart-modal>
  `,
  styles: [ 'img { max-width: 100%; }' ]
})
export class OnboardingContentImageComponent extends AbstractEditingComponent implements OnInit, AfterViewInit {

  @ViewChild('imageInput') imageInput: ElementRef;
  @ViewChild('modalForm') formView: ElementRef<HTMLFormElement>;
  @ViewChild('modal') modal: NgxSmartModalComponent;

  result: DialogResult;

  imagePreviewUrl: string;

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
      image: ['', [Validators.required, ]],
    });
  }

  get image(): FormControl { return this.form.get('image') as FormControl; }

  setMediaImage(data?: Event|string) {
    this.setImagePreview(data,  (url) => this.imagePreviewUrl = url);
  }

  getValue(): FormData {
    if (this.result !== DialogResult.OK) {
      return null;
    }
    return new FormData(this.formView.nativeElement);
  }

  open() {
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
}



