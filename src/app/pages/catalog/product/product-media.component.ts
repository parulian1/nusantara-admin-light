import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { AbstractEditingComponent, IChoiceFieldChoice } from '@nusantara/core';
import { ProductMediaService } from '@nusantara/services';
import { MediaType } from '@nusantara/models/media.type';
import { IResultResponse } from '@nusantara/core/responses';
import { Observable, of } from 'rxjs';

/**
 * A single media object (youtube video or image) configured for a
 * product.
 *
 * This in intended for displaying as a row within a table.
 *
 * @see IProduct
 */
@Component({
  selector: 'nus-product-media',
  template: `
    <tr [formGroup]="form">
      <td>
        <select formControlName="type">
          <option *ngFor="let mt of this.mediaTypes" [ngValue]="mt.value">
            {{ mt.displayName }}
          </option>
        </select>
      </td>
      <td *ngIf="type.value === 'image'">
        <img [src]="imagePreviewUrl">
        <input type="file" [formControl]="image" (change)="setMediaImage($event)" #imageInput>
      </td>
      <td *ngIf="type.value === 'you_tube'">
        <input type="text" [formControl]="youtubeVideoId">
      </td>
      <td><button (click)="remove.emit()" type="button">Delete</button></td>
    </tr>
  `,
  styles: [':host { display: contents; }' ]
})
export class ProductMediaComponent extends AbstractEditingComponent implements OnInit {

  @Input() mediaTypes: Array<IChoiceFieldChoice>;
  @Input() form: FormGroup;
  @Output() remove: EventEmitter<void> = new EventEmitter();

  @ViewChild('imageInput') imageInput: ElementRef;

  imagePreviewUrl: string;

  constructor(protected service: ProductMediaService) { super(); }

  // todo: need to validate (if image is selected) that **EITHER**
  // the original URL is set, or image is set

  ngOnInit() {
    this.setMediaImage(this.form.get('_originalImageUrl').value);

    this.onTypeChanged(); // initially make sure this is set.
    this.type.valueChanges.subscribe(() => this.onTypeChanged());
  }

  onTypeChanged() {
    if (this.currentMediaType === 'image') {
      this.youtubeVideoId.disable();
      this.image.enable();
    } else {
      this.youtubeVideoId.enable();
      this.image.disable();
    }
  }

  get type(): FormControl { return this.form.get('type') as FormControl; }
  get youtubeVideoId(): FormControl { return this.form.get('youtubeVideoId') as FormControl; }
  get image(): FormControl { return this.form.get('image') as FormControl; }


  private get currentMediaType(): MediaType {
    return this.type.value as MediaType;
  }

  setMediaImage(data?: Event|string) {
    this.setImagePreview(data,  (dataAsUrl) => this.imagePreviewUrl = dataAsUrl);
  }

  save(parentProductHref: string): Observable<IResultResponse> {
    const formData = new FormData();
    formData.append('product', parentProductHref);
    formData.append('type', this.type.value);

    if (!!this.href.value) {
      formData.append('href', this.href.value);
    }

    if (this.currentMediaType === 'image') {
      formData.append('image', this.getFirstFileOrDefault(this.imageInput.nativeElement));
    } else {
      formData.append('youtubeVideoId', this.youtubeVideoId.value);
    }
    return this.service.save(formData);
  }

  delete(): Observable<IResultResponse> {
    if (this.isNew) {
      // if this object is new, then we don't need to perform a delete -- just report success.
      return of({success: true, messages: []});
    } else {
      return this.service.delete({href: this.href.value});
    }
  }
}
