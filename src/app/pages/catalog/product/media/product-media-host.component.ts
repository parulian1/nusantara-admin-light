import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, zip } from 'rxjs';

import { AbstractEditingComponent, DialogResult, IResultResponse } from '@nusantara/core';
import { drf, products } from '@nusantara/models';
import { ProductMediaService } from '@nusantara/services';

import { NewProductImageComponent } from './new-product-image.component';
import { NewProductYoutubeComponent } from './new-product-youtube.component';

/**
 * Container for all the media objects assigned to a single product.
 * Media can either be a picture (jpg/png) or the video id for
 * a youtube video.
 *
 * @see IProduct
 */
@Component({
  selector: 'nus-product-media-host',
  template: `
    <h2>Media
      <button (click)="newImageModal.open()" type="button">
        <i class="material-icons">image</i>
        ({{ imageCount }})</button>
      <button (click)="newYoutubeModal.open()" type="button">
        <i class="material-icons">ondemand_video</i>
        ({{ youtubeCount }})</button>
    </h2>

    <nus-product-media
      *ngFor="let media of entities; let i=index"
      [entity]="media"
      (remove)="remove(i)">
    </nus-product-media>

    <!-- Pop-ups for adding new media -->
    <nus-new-product-image></nus-new-product-image>
    <nus-new-product-youtube></nus-new-product-youtube>
  `,
  styles: [ ]
})
export class ProductMediaHostComponent extends AbstractEditingComponent<FormArray> implements OnInit, AfterViewInit {

  mediaTypes: Array<drf.IChoice>;

  @Input() form: FormArray;
  @ViewChild(NewProductImageComponent) newImageModal: NewProductImageComponent;
  @ViewChild(NewProductYoutubeComponent) newYoutubeModal: NewProductYoutubeComponent;

  entities: Array<products.IProductMedia> = [];

  newImages: Array<FormData> = [];
  newVideos: Array<products.IProductMedia> = [];
  deletedMedia: Array<products.IProductMedia> = [];

  constructor(protected service: ProductMediaService,
              protected route: ActivatedRoute,
              protected fb: FormBuilder) { super(); }


  get imageCount(): number { return this.entities.filter(e => e.type === 'image').length; }
  get youtubeCount(): number { return this.entities.filter(e => e.type === 'you_tube').length; }

  ngOnInit() {
    this.route.data.subscribe((data: {mediaTypes: drf.IChoice[]}) => {
      this.mediaTypes = data.mediaTypes;
    });
  }

  ngAfterViewInit() {
    this.newImageModal.onClose.subscribe(() => this.onImageModalClosed());
    this.newYoutubeModal.onClose.subscribe(() => this.onYoutubeModalClosed());
  }

  add(media?: products.IProductMedia) {

    if (!media) {
      // this.isAddingNewMedia = true;
    } else {
      this.entities.push(media);
      // const f = this.fb.group({
      //   type: [media?.type || this.mediaTypes[0].value, []],
      //   href: [media?.href, []],
      //   image: [],
      //   _originalImageUrl: [media?.image, []],
      //   youtubeVideoId: [media?.youtubeVideoId, [Validators.required, ]]
      // });
      // this.form.push(f);
    }
  }
  remove(index: number) {
    const mediaToRemove = this.entities[index];
    // media was already saved to API:  record it in deleted media
    // so we can call DELETE on the API
    if (!!mediaToRemove.href) {
      this.deletedMedia.push(mediaToRemove);
    }
    // remove from displayed objects
    this.entities.splice(index, 1);
  }

  /**
   * If the user completed selecting a new product image,
   * add it's form data to a list of forms to save, and then save it's
   * image data in the preview list
   */
  onImageModalClosed() {
    if (this.newImageModal.result === DialogResult.OK) {
      // data that will be saved to API
      this.newImages.push(this.newImageModal.getValue());

      // preview data
      const viewModel = Object.assign({}, this.newImageModal.form.value);
      viewModel.image = this.newImageModal.imagePreviewUrl;
      this.add(viewModel);
    }
  }

  onYoutubeModalClosed() {
    if (this.newYoutubeModal.result === DialogResult.OK) {
      this.newVideos.push(this.newYoutubeModal.form.value);

      const viewModel = Object.assign({}, this.newYoutubeModal.form.value);
      viewModel.image = this.newYoutubeModal.imagePreviewUrl;
      this.add(viewModel);
    }
  }


  /**
   *
   * @param product The parent product which should own all the images and videos.
   */
  saveAll(product: products.IProduct): Observable<IResultResponse[]> {

    // make sure all new images and videos have the product href set
    this.newImages.forEach((value) => { value.set('product', product.href); });
    this.newVideos.forEach((value) => { value.product = product.href; });

    // submit all changes to the API and an observable of all responses
    return zip(
      ...this.newImages.map(img => this.service.save(img)),
      ...this.newVideos.map(vid => this.service.save(vid)),
      ...this.deletedMedia.map(m => this.service.delete(m))
    );
  }

}
