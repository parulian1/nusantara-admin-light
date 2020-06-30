import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { IProductMedia } from '@nusantara/models';

/**
 * A single media object (youtube video or image) configured for a
 * product.
 *
 * This in intended for displaying as a row within a table.
 *
 * @see IProductMedia
 * @see ProductMediaHostComponent
 */
@Component({
  selector: 'nus-product-media',
  template: `
    <div *ngIf="entity?.type === 'image'">
      <span>Image</span>
      <img [src]="entity?.image" alt="Product Image">
      <button type="button">Remove</button>
    </div>
    <div *ngIf="entity?.type === 'you_tube'">
      <span>YouTube Embedded Video</span>
      <button type="button">Remove</button>
    </div>
  `,
  styles: [`
    div {
      display: inline-block;
      max-width: 160px;
    }
    img {
      height: 160px;
      width: 160px;
      object-fit: contain;
    }
  `]
})
export class ProductMediaComponent {

  @Output() remove: EventEmitter<void> = new EventEmitter();
  @Input() entity: IProductMedia;
  @ViewChild('imageInput') imageInput: ElementRef;

  // todo: need to validate (if image is selected) that **EITHER**
  // the original URL is set, or image is set

  // ngOnInit() {
    // this.setMediaImage(this.form.get('_originalImageUrl').value);
    // this.onTypeChanged(); // initially make sure this is set.
    // this.type.valueChanges.subscribe(() => this.onTypeChanged());
  // }

}
