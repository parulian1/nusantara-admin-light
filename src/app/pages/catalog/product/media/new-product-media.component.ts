import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { AbstractEditingComponent, IChoiceFieldChoice } from '@nusantara/core';
import { ProductMediaService } from '@nusantara/services';
import { MediaType } from '@nusantara/models';
import { IResultResponse } from '@nusantara/core/responses';


/**
 * Shown when the user is adding a new youtube or image
 * to a product.
 */
@Component({
  selector: 'nus-new-product-media',
  template: `
    <div [formGroup]="form">
      <label>
        <span>Type</span>
        <select formControlName="type">
          <option *ngFor="let mt of this.mediaTypes"
                  [ngValue]="mt.value">
            {{ mt.displayName }}
          </option>
        </select>
      </label>


      <div *ngIf="type.value === 'image'">
        <img [src]="imagePreviewUrl">
        <input type="file" [formControl]="image" (change)="setMediaImage($event)" #imageInput>
      </div>
      <div *ngIf="type.value === 'you_tube'">
        <input type="text" [formControl]="youtubeVideoId">
      </div>

      <td><button (click)="remove.emit()" type="button">Delete</button></td>
    </div>
  `,
  styles: [ ]
})
export class NewProductMediaComponent extends AbstractEditingComponent implements OnInit {

  @Input() mediaTypes: Array<IChoiceFieldChoice>;
  @Input() form: FormGroup;
  @Output() remove: EventEmitter<void> = new EventEmitter();

  @ViewChild('imageInput') imageInput: ElementRef;

  imagePreviewUrl: string;

  constructor(protected service: ProductMediaService) { super(); }

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

  /**
   * Changes the image that is currently being displayed.
   * @param data
   */
  setMediaImage(data?: Event|string) {
    this.setImagePreview(data,  (dataAsUrl) => this.imagePreviewUrl = dataAsUrl);
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
