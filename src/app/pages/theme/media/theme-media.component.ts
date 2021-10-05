import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { products } from '@nusantara/models';
import { GoogleService } from '@nusantara/services';

/**
 * A single media object (image) configured for a
 * theme.
 *
 * This in intended for displaying as a row within a table.
 *
 * @see IProductMedia
 * @see ThemeMediaHostComponent
 */
@Component({
  selector: 'nus-theme-media',
  template: `
    <button type="button" (click)="remove.emit()" title="Remove"><i class="material-icons">remove_circle_outline</i></button>

    <div *ngIf="entity?.type === 'image'">
      <span class="video-title" i18n>Image</span>
    </div>
    <img [src]="previewImageUrl" alt="Media Preview">
  `,
  styles: [
    ':host { position: relative; text-align: center; }',
    'button { position: absolute; right: 0; top: 0; border: 0; background: transparent; opacity: .3; }',
    'button:hover, button:focus { color: var(--error); transition: all .3s; opacity: 1; }',
    'img { height: 120px; width: 120px; object-fit: contain; }',
    '.video-title { font-size: .7em; }',
  ]
})
export class ThemeMediaComponent implements AfterViewInit {

  @Output() remove: EventEmitter<void> = new EventEmitter();
  @Input() entity: products.IProductMedia;
  @ViewChild('imageInput') imageInput: ElementRef;

  constructor(protected google: GoogleService) { }

  previewImageUrl: string;
  title: string;
  clickUrl: string;

  ngAfterViewInit() {
    this.previewImageUrl = this.entity.image;
  }
}
