import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgxSmartModalComponent } from 'ngx-smart-modal';

import { AbstractEditingComponent, DialogResult } from '@nusantara/core';
import { GoogleService } from '@nusantara/services';

/**
 * Allows the user to enter the ID of a youtube video.
 */
@Component({
  selector: 'nus-new-product-youtube',
  template: `
    <ngx-smart-modal [identifier]="'newYoutubeModal'" #modal [formGroup]="form" *ngIf="!!form">
      <h1>Select YouTube Video</h1>
      <form #modalForm>
        <img [src]="imagePreviewUrl" alt="Image Preview">

        <input type="hidden" [formControl]="href" name="href">
        <input type="hidden" [formControl]="type" name="type">
        <input type="hidden" [formControl]="image" name="image">

        <label>
          <span>Video ID</span>
          <input type="text" [formControl]="youtubeVideoId" name="youtubeVideoId" placeholder="Enter Video ID">
          <nus-field-errors [control]="youtubeVideoId"></nus-field-errors>
        </label>

        <button [disabled]="form.invalid" (click)="close()" type="button">Save</button>
        <button (click)="cancel()" type="button">Cancel</button>
      </form>
    </ngx-smart-modal>
  `,
  styles: [ ]
})
export class NewProductYoutubeComponent extends AbstractEditingComponent implements OnInit, AfterViewInit {

  @ViewChild('modalForm') formView: ElementRef<HTMLFormElement>;
  @ViewChild('modal') modal: NgxSmartModalComponent;

  result: DialogResult;
  imagePreviewUrl: string;

  timeoutId: any;
  reloadTimeout = 650;

  constructor(protected fb: FormBuilder,
              protected google: GoogleService) { super(); }

  ngOnInit() {
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    this.modal.onOpen.subscribe(() => {
      this.initializeForm();
      this.youtubeVideoId.valueChanges.subscribe(value => { this.onVideoIdChanged(value); });
      this.result = DialogResult.Cancelled;
      this.setYoutubeThumbnail(null);
    });
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      href: [null, []],
      image: [null, []],
      type: ['you_tube', [Validators.required, ]],
      youtubeVideoId: ['', [Validators.required, ]]
    });
  }

  get type(): FormControl { return this.form.get('type') as FormControl; }
  get youtubeVideoId(): FormControl { return this.form.get('youtubeVideoId') as FormControl; }
  get image(): FormControl { return this.form.get('image') as FormControl; }

  setYoutubeThumbnail(data?: string) {
    this.setImagePreview(data,  (dataAsUrl) => this.imagePreviewUrl = dataAsUrl);
  }

  onVideoIdChanged(newValue: string) {
    if (!!this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    if (!newValue) {
      clearTimeout(this.timeoutId);
      this.setYoutubeThumbnail(null);
    } else {
      this.timeoutId = setTimeout(() => {
        // wait to see if the user is still typing more before navigating

        this.google.fetchYoutubeVideoMeta(this.youtubeVideoId.value).subscribe(
          result => {
            if (result.pageInfo.totalResults === 0) {
              this.youtubeVideoId.setErrors(
                {apiError: `No Video with id '${newValue}' found.`}
              );
            } else {
              this.imagePreviewUrl = result.items[0].snippet.thumbnails.default.url;
            }
          }
        );
      }, this.reloadTimeout);
    }
  }

  getValue(): FormData {
    throw new Error('Not Implemented');
    // if (this.result !== DialogResult.OK) {
    //   return null;
    // }
    // return new FormData(this.formView.nativeElement);
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
