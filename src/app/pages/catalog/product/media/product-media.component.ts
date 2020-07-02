import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { IProductMedia } from '@nusantara/models';
import { GoogleService } from '@nusantara/services';

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
      <img [src]="previewImageUrl" alt="Product Image">
    </div>
    <div *ngIf="entity?.type === 'you_tube'">
      <span>YouTube Embedded Video</span>
      <img [src]="previewImageUrl" alt="Youtube Video Preview">
    </div>
    <button type="button" (click)="remove.emit()">Remove</button>
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
export class ProductMediaComponent implements AfterViewInit {

  @Output() remove: EventEmitter<void> = new EventEmitter();
  @Input() entity: IProductMedia;
  @ViewChild('imageInput') imageInput: ElementRef;

  constructor(protected google: GoogleService) { }

  previewImageUrl: string;

  ngAfterViewInit() {
    if (this.entity.type === 'you_tube') {
      this.google.fetchYoutubeVideoMeta(this.entity.youtubeVideoId).subscribe(resp => {
        this.previewImageUrl = resp.items[0].snippet.thumbnails.default.url;
      });
    } else {
      this.previewImageUrl = this.entity.image;
    }
  }
}
