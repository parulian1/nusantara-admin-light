import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AbstractEditingComponent, DialogResult, IChoiceFieldChoice } from '@nusantara/core';
import { ProductMediaService } from '@nusantara/services';
import { IProductMedia } from '@nusantara/models';
import { ActivatedRoute } from '@angular/router';
import { NewProductImageComponent, NewProductYoutubeComponent } from '@nusantara/pages/catalog/product/media';
import { Observable, zip } from 'rxjs';
import { IResultResponse } from '@nusantara/core/responses';

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
  styles: [':host { display: contents; }' ]
})
export class ProductMediaHostComponent extends AbstractEditingComponent<FormArray> implements OnInit, AfterViewInit {

  mediaTypes: Array<IChoiceFieldChoice>;

  @Input() form: FormArray;
  @ViewChild(NewProductImageComponent) newImageModal: NewProductImageComponent;
  @ViewChild(NewProductYoutubeComponent) newYoutubeModal: NewProductYoutubeComponent;

  entities: Array<IProductMedia> = [];

  newImages: Array<FormData> = [];
  newVideos: Array<IProductMedia> = [];
  deletedMedia: Array<IProductMedia> = [];

  constructor(protected service: ProductMediaService,
              protected route: ActivatedRoute,
              protected fb: FormBuilder) { super(); }


  get imageCount(): number { return this.entities.filter(e => e.type === 'image').length; }
  get youtubeCount(): number { return this.entities.filter(e => e.type === 'you_tube').length; }

  ngOnInit() {
    this.route.data.subscribe((data: {mediaTypes: IChoiceFieldChoice[]}) => {
      this.mediaTypes = data.mediaTypes;
    });
  }

  ngAfterViewInit() {
    this.newImageModal.onClose.subscribe(() => this.onImageModalClosed());
    this.newYoutubeModal.onClose.subscribe(() => this.onYoutubeModalClosed());
  }

  add(media?: IProductMedia) {

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


  saveAll(): Observable<IResultResponse[]> {
    return zip(
      ...this.newImages.map(img => this.service.save(img)),
      ...this.newVideos.map(vid => this.service.save(vid)),
      ...this.deletedMedia.map(m => this.service.delete(m))
    );
  }

}
