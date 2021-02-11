import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { products } from '@nusantara/models';
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
    <div>
      <button type="button" (click)="remove.emit()" title="Remove"><i class="material-icons">remove_circle_outline</i></button>

      <div *ngIf="entity?.type === 'image'">
        <span class="video-title">Image</span>
      </div>
      <div *ngIf="entity?.type === 'you_tube'">
        <a class="video-title" [href]="clickUrl" target="_blank">
          <span *ngIf="title?.length > 19; then slicedTitle else fullTitle"></span>
          <ng-template #slicedTitle>{{ title|slice:0:16 }}...</ng-template>
          <ng-template #fullTitle>{{ title }}</ng-template>
        </a>
      </div>

      <img [src]="previewImageUrl" alt="Media Preview">
    </div>
  `,
  styles: [
    ':host { position: relative; text-align: center; }',
    'button { position: absolute; right: 0; top: 0; border: 0; background: transparent; opacity: .3; }',
    'button:hover, button:focus { color: var(--error); transition: all .3s; opacity: 1; }',
    'img { height: 120px; width: 120px; object-fit: contain; }',
    '.video-title { font-size: .7em; }',
  ]
})
export class ProductMediaComponent implements AfterViewInit {

  @Output() remove: EventEmitter<void> = new EventEmitter();
  @Input() entity: products.IProductMedia;
  @ViewChild('imageInput') imageInput: ElementRef;

  constructor(protected google: GoogleService) { }

  previewImageUrl: string;
  title: string;
  clickUrl: string;

  ngAfterViewInit() {
    if (this.entity.type === 'you_tube') {
      this.google.fetchYoutubeVideoMeta(this.entity.youtubeVideoId).subscribe(resp => {
        this.previewImageUrl = resp.items[0].snippet.thumbnails.default.url;
        this.title = resp.items[0].snippet.title;
        this.clickUrl = `https://youtube.com/watch?v=${resp.items[0].id}`;
      });
    } else {
      this.previewImageUrl = this.entity.image;
    }
  }
}
