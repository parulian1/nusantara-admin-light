import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import {products} from '@nusantara/models';
import {GoogleService} from '@nusantara/services';

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
    <div [class.media-image]="entity?.type === 'image'" [class.media-video]="entity?.type === 'you_tube'">
      <div *ngIf="entity?.type === 'image'">
        <span class="video-title" i18n *ngIf="index===0">Main Picture**</span>
        <span class="video-title" i18n *ngIf="index>0">Picture {{index}}{{ index < 3 ? '**':''}}</span>
      </div>
      <div *ngIf="entity?.type === 'you_tube'">
        <a class="video-title" [href]="clickUrl" target="_blank">
          <span *ngIf="title?.length > 19; then slicedTitle else fullTitle"></span>
          <ng-template #slicedTitle>{{ title|slice:0:16 }}...</ng-template>
          <ng-template #fullTitle>{{ title }}</ng-template>
        </a>
      </div>

      <div class="image-wrapper">
        <img [src]="previewImageUrl" alt="Media Preview">
        <div class="image-overlay">
          <div class="text-overlay"><span i18n>Geser gambar untuk mengurutkan</span></div>
          <div class="action-overlay">
            <button type="button" (click)="remove.emit()" title="Remove" i18n-title><i class="material-icons">delete_outline</i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    ':host { position: relative; text-align: center; }',
    'button { position: absolute; right: 0; top: 0; border: 0; background: transparent; opacity: .5; color: #fff; }',
    `.image-wrapper {
      display: flex;
      height: 120px;
      width: 120px;
      align-self: center;
      margin: auto;
    }
    .image-wrapper {
      position: relative;
      border: 1px solid #B4B4B4;
      box-sizing: border-box;
      border-radius: 4px;
    }

    .image-wrapper img {
      max-height: 100%;
      max-width: 100%;
      margin: auto;
      object-fit: contain;
      height: 100%;
      width: 100%;
    }
    .image-wrapper:hover .text-overlay {
      opacity: 0.5;
    }
    .image-wrapper:hover .action-overlay{
      opacity: 0.7;
    }
    .image-wrapper:hover button, .image-wrapper:hover button:focus { color: #ffffff; transition: all .3s; opacity: 1; }
    .image-wrapper .text-overlay {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100%;
      width: 100%;
      opacity: 0;
      transition: .5s ease;
      background-color: #000000;
    }
    .image-wrapper .text-overlay {
      width: 100%;
      height: 100%;
      display: flex;
      align-content: center;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      line-height: 20px;
      font-weight: 400;
    }
    .text-overlay span {
      padding: 5px;
      color: #ffffff;
      padding-bottom: 20px;
    }
    .image-wrapper .action-overlay {
       background-color: #000000;
      opacity: 0;
      left: 0;
      position: absolute;
      bottom: 0;
      height: 34px;
      display: flex;
      width: 100%;
      justify-content: center;
    }
    .image-wrapper .action-overlay button {
      background-color: #000000;
      opacity: 0.5;
      position: relative;
    }
    `,
    '.video-title { font-size: .7em; }',
  ]
})
export class ProductMediaComponent implements OnChanges {

  @Output() remove: EventEmitter<void> = new EventEmitter();
  @Input() entity: products.IProductMedia;
  @ViewChild('imageInput') imageInput: ElementRef;
  @Input() index = 0;

  constructor(protected google: GoogleService) {
  }

  previewImageUrl?: string;
  title: string;
  clickUrl: string;

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'entity': {
            if ((changes.entity.currentValue as products.IProductMedia).type === 'you_tube') {
              this.google.getOembedDataById(this.entity.youtubeVideoId).subscribe(resp => {
                if (resp.status === 200) {
                  if (resp.body) {
                    this.previewImageUrl = resp.body.thumbnail_url;
                    this.title = resp.body.title;
                    this.clickUrl = `https://youtube.com/watch?v=${(changes['entity'].currentValue as products.IProductMedia).youtubeVideoId}`;
                  }
                }
              });
            } else {
              this.previewImageUrl = this.entity.image;
            }
            break;
          }
        }
      }
    }
  }
}
