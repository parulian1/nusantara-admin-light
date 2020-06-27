import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormArray } from '@angular/forms';

import { AbstractEditingComponent, IChoiceFieldChoice } from '@nusantara/core';
import { ProductMediaService } from '@nusantara/services';
import { IProductMedia } from '@nusantara/models';
import { ActivatedRoute } from '@angular/router';

/**
 * A single media object (youtube video or image) configured for a
 * product.
 *
 * This in intended for displaying as a row within a table.
 *
 * @see IProduct
 */
@Component({
  selector: 'nus-product-media-list',
  template: `
    <h2>Media
      <button (click)="addMedia()" type="button">Add</button>
    </h2>
    <table>
      <thead>
      <tr>
        <th>Type</th>
        <th>Value</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <nus-product-media
        *ngFor="let m of media.controls; let i=index"
        [form]="m"
        [mediaTypes]="mediaTypes"
        (remove)="removeMedia(i)">
      </nus-product-media>
      </tbody>
    </table>
  `,
  styles: [':host { display: contents; }' ]
})
export class ProductMediaListComponent extends AbstractEditingComponent<FormArray> implements OnInit {

  mediaTypes: Array<IChoiceFieldChoice>;
  @Input() form: FormArray;

  imagePreviewUrl: string;

  constructor(protected service: ProductMediaService,
              protected route: ActivatedRoute,
              protected fb: FormBuilder) { super(); }

  // todo: need to validate (if image is selected) that **EITHER**
  // the original URL is set, or image is set

  ngOnInit() {
    this.route.data.subscribe((data: {mediaTypes: IChoiceFieldChoice[]}) => {
      this.mediaTypes = data.mediaTypes;
    });
  }

  addMedia(media?: IProductMedia) {
    const f = this.fb.group({
      type: [media?.type || this.mediaTypes[0].value, []],
      href: [media?.href, []],
      image: [],
      _originalImageUrl: [media?.image, []],
      youtubeVideoId: [media?.youtubeVideoId, [Validators.required, ]]
    });

    this.media.push(f);
  }
  removeMedia(index: number) {
    this.media.removeAt(index);
  }
}
