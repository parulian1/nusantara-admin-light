import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Observable, zip} from 'rxjs';

import {AbstractEditingComponent, DialogResult, IResultResponse} from '@nusantara/core';
import {drf, products} from '@nusantara/models';
import {ProductMediaService} from '@nusantara/services';

import {NewProductImageComponent} from './new-product-image.component';
import {NewProductYoutubeComponent} from './new-product-youtube.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {IProductMedia} from '@nusantara/models/products';

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
    <h2 i18n>Media
      <button (click)="openImageModal()" type="button" title="Add new Image">
        <i class="material-icons">image</i>
      </button>
      <button (click)="openVideoModal()" type="button" title="Add new YouTube video">
        <i class="material-icons">ondemand_video</i>
      </button>
    </h2>

    <div class="product-media-wrapper" cdkDropList (cdkDropListDropped)="dropEvent($event)">
      <nus-product-media
        *ngFor="let media of entities; let i=index"
        [entity]="media"
        (remove)="remove(i)" cdkDrag>
      </nus-product-media>
    </div>

    <!-- Pop-ups for adding new media -->
    <nus-new-product-image></nus-new-product-image>
    <nus-new-product-youtube></nus-new-product-youtube>
  `,
  styles: [
    'h2>button { background: transparent; border: none; opacity: .3; transition: all .3s; }',
    'h2>button:hover, h2>button:focus { opacity: 1; color: var(--success); } ',
    `
      .product-media-wrapper {
        display: flex;
        flex-wrap: wrap;
      }

      nus-product-media {
        height: 160px;
        width: 160px;
        box-shadow: 0 0 8px -1px var(--shadow-color);
        margin: 0 5px 5px 0;
      }
    `,
  ]
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
  imageList: Array<FormData> = [];

  constructor(protected service: ProductMediaService,
              protected route: ActivatedRoute,
              protected fb: FormBuilder) {
    super();
  }


  get imageCount(): number {
    return this.entities.filter(e => e.type === 'image').length;
  }

  get youtubeCount(): number {
    return this.entities.filter(e => e.type === 'you_tube').length;
  }

  ngOnInit() {
    this.route.data.subscribe((data: { mediaTypes: drf.IChoice[] }) => {
      this.mediaTypes = data.mediaTypes;
    });
  }

  ngAfterViewInit() {
    this.newImageModal.onClose.subscribe(() => this.onImageModalClosed());
    this.newYoutubeModal.onClose.subscribe(() => this.onYoutubeModalClosed());
  }

  openImageModal() {
    console.log('entities length', this.entities.length);
    this.newImageModal.open(this.entities.length + 1);
  }

  openVideoModal() {
    this.newYoutubeModal.open(this.entities.length + 1);
  }

  add(media?: products.IProductMedia) {

    if (!media) {
      // this.isAddingNewMedia = true;
    } else {
      this.entities.push(media);
      this.recreateImageList();
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
    this.recreateImageList();
  }

  recreateImageList(): void {
    this.imageList = [];
    this.entities.forEach((media, idx, entities) => {
      if (!!media.href) {
        const formData: any = new FormData();
        formData.append('href', media?.href);
        formData.append('sortPriority', idx);
        formData.append('type', media?.type);
        if (media?.type === 'image') {

        } else if (media?.type === 'you_tube') {
          formData.append('youtubeVideoId', media?.youtubeVideoId);
        }

        this.imageList.push(formData as FormData);
      } else {
        // new image or video
        if (media?.type === 'image') {
          const xMedia = this.newImages.find((val) => {
            if (val.get('identifier') === media?.identifier) {
              val.set('sortPriority', '' + idx);
              this.imageList.push(val);
            }
          });
        } else if (media?.type === 'you_tube') {
          const xMedia = this.newVideos.find((val) => {
            if (val.identifier === media?.identifier) {
              const formData: any = new FormData();
              formData.append('href', media?.href);
              formData.append('sortPriority', idx);
              formData.append('type', media?.type);
              formData.append('youtubeVideoId', media?.youtubeVideoId);

              this.imageList.push(formData as FormData);
            }
          });
        }
      }
    });
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
    this.newImages.forEach((value) => {
      value.set('product', product.href);
    });
    this.newVideos.forEach((value) => {
      value.product = product.href;
    });

    this.imageList.forEach((value) => {
      value.set('product', product.href);
      if (!!value.get('href')) {
        value.delete('image');
      }
    });

    // submit all changes to the API and an observable of all responses
    return zip(
      // ...this.newImages.map((img) => {
      //   console.log('save image', img.get('sortPriority'));
      //   return this.service.save(img);
      // }),
      ...this.imageList.map(vid => {
        if (vid.get('type') === 'you_tube') {
          let href = null;
          if (vid.get('href') !== 'null') {
            href = vid.get('href').toString();
          }
          const dataVideo: IProductMedia = {
            href,
            youtubeVideoId: vid.get('youtubeVideoId').toString(),
            image: null,
            sortPriority: parseInt(vid.get('sortPriority').toString(), 10),
            type: 'you_tube',
            product: product.href
          };
          return this.service.save(dataVideo);
        }
        return this.service.save(vid);
      }),
      // ...this.newVideos.map(vid => {
      //
      //   return this.service.save(vid);
      // }),
      ...this.deletedMedia.map(m => this.service.delete(m))
    );
  }

  dropEvent(event: CdkDragDrop<IProductMedia[]>) {
    moveItemInArray(this.entities, event.previousIndex, event.currentIndex);
    this.recreateImageList();

  }

}
