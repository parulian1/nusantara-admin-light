import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Form, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Observable, zip} from 'rxjs';

import {AbstractEditingComponent, DialogResult, IResultResponse, Logger} from '@nusantara/core';
import {drf, products} from '@nusantara/models';
import {GoogleService, ProductMediaService} from '@nusantara/services';

import {NewProductImageComponent} from './new-product-image.component';
import {NewProductYoutubeComponent} from './new-product-youtube.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {IProductMedia} from '@nusantara/models/products';
import {find} from 'rxjs/operators';

const logger = new Logger('ProductMediaHost');

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
    <div class="image-section">
      <h4 i18n>Product Image (Min. {{MINIMUM_IMAGE}})</h4>
      <span>Format .jpg & .png file size min 300x300px</span>

      <div class="product-media-wrapper image-media-wrapper drag-media-wrapper"
           cdkDropList cdkDropListOrientation="horizontal" (cdkDropListDropped)="dropEventImage($event)">
        <div class="media-drag" *ngFor="let media of entitiesImage; let i=index" cdkDrag
             cdkDragBoundary=".image-media-wrapper">
          <div class="example-custom-placeholder" *cdkDragPlaceholder></div>
          <nus-product-media
            [entity]="media"
            [index]="i"
            (remove)="removeImage(i)">
          </nus-product-media>
        </div>


        <ng-container *ngFor="let _ of [].constructor(allowedImage); let i=index">
          <div class="empty-image">
            <span class="video-title" *ngIf="entitiesImage.length + i > 0"
                  i18n>Picture {{entitiesImage.length + i }}{{ entitiesImage.length < 3 ? '**' : ''}}</span>
            <span class="video-title" *ngIf="entitiesImage.length + i === 0" i18n>Main Picture**</span>
            <button class="button-add-image" type="button" (click)="openImageModal()">
              <div class="top-overlay"><span class="material-icons">add</span></div>
              <div class="action-overlay"><span class="video-title" i18n>Add Image</span></div>
            </button>
          </div>
        </ng-container>
      </div>
    </div>

    <div class="video-section">
      <h4 i18n>Product Video</h4>
      <span>Insert youtube video url</span>
      <div class="video-manage">
        <input type="text" name="input_youtube" [formControl]="videoId"
               placeholder="https://www.youtube.com/watch?v=QMUfjGe11gs"/>
        <button (click)="addVideoAction()" type="button" class="new-add-button wide"
                [disabled]="(videoId?.errors?.length > 0) || entitiesVideo.length >= MAXIMUM_VIDEO || !videoForm.valid"
                i18n>
          <i class="material-icons">add</i> Add video
        </button>
        <div *ngIf="videoId?.hasError('apiError')" class="error-detail">
          <div *ngIf="videoId.errors.apiError">{{ videoId.getError('apiError') }}</div>
        </div>
      </div>

      <div class="video-media-wrapper product-media-wrapper drag-media-wrapper" cdkDropListOrientation="horizontal"
           cdkDropList (cdkDropListDropped)="dropEventVideo($event)">
        <div class="media-drag" *ngFor="let media of entitiesVideo; let i=index" cdkDrag
             cdkDragBoundary=".video-media-wrapper">
          <nus-product-media
            [entity]="media"
            (remove)="removeVideo(i)">
          </nus-product-media>
        </div>
      </div>
    </div>

    <!-- Pop-ups for adding new media -->
    <nus-new-product-image></nus-new-product-image>
    <nus-new-product-youtube></nus-new-product-youtube>
  `,
  styles: [
    'h4>button { background: transparent; border: none; opacity: .3; transition: all .3s; }',
    'h4>button:hover, h4>button:focus { opacity: 1; color: var(--success); } ',
    `
      .product-media-wrapper {
        display: flex;
        flex-wrap: wrap;
      }

      nus-product-media {
        /*  height: 120px;*/
        /*  width: 120px;*/
        /*  box-shadow: 0 0 8px -1px var(--shadow-color);*/
        margin: 0 5px 5px 0;
      }
    `,
    `
      .video-manage {
        display: grid;
        grid-template-columns: 6fr 2fr;
        grid-gap: 20px;
        align-items: center;
      }
    `,
    `
      .media-drag, .video-drag {
        margin: 0 5px 5px 0;
      }

      .cdk-drag-preview {
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
        0 8px 10px 1px rgba(0, 0, 0, 0.14),
        0 3px 14px 2px rgba(0, 0, 0, 0.12);
      }

      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }

      .drag-media-wrapper.cdk-drop-list-dragging .example-box:not(.cdk-drag-placeholder) {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }

      .example-custom-placeholder {
        background: #ccc;
        border: dotted 3px #999;
        min-height: 60px;
        width: 120px;
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }

      .video-title {
        font-size: .7em;
      }

      .empty-image {
        position: relative;
        text-align: center;
        margin: 0 5px 5px 0;
      }

      .image-wrapper {
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

      .image-wrapper .action-overlay {
        left: 0;
        position: absolute;
        bottom: 0;
        height: 34px;
        display: flex;
        width: 100%;
        justify-content: center;
      }

      button.button-add-image {
        position: relative;
        display: flex;
        height: 120px;
        width: 120px;
        align-self: center;
        margin: auto;
        background: #F4F4F4;
        border: 1px solid #B4B4B4;
        box-sizing: border-box;
        border-radius: 4px;
      }

      .button-add-image .action-overlay {
        left: 0;
        position: absolute;
        bottom: 0;
        height: 34px;
        display: flex;
        width: 100%;
        justify-content: center;
      }

      .button-add-image .top-overlay {
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
    `
  ]
})
export class ProductMediaHostComponent
  extends AbstractEditingComponent<FormArray>
  implements OnInit, AfterViewInit {
  readonly MAXIMUM_IMAGE = 9;
  readonly MINIMUM_IMAGE = 3;
  readonly MAXIMUM_VIDEO = 3;

  mediaTypes: Array<drf.IChoice>;

  @Input() form: FormArray;
  @ViewChild(NewProductImageComponent) newImageModal: NewProductImageComponent;
  @ViewChild(NewProductYoutubeComponent) newYoutubeModal: NewProductYoutubeComponent;

  entities: Array<products.IProductMedia> = [];
  entitiesImage: Array<products.IProductMedia> = [];
  entitiesVideo: Array<products.IProductMedia> = [];

  newImages: Array<FormData> = [];
  newVideos: Array<products.IProductMedia> = [];
  deletedMedia: Array<products.IProductMedia> = [];
  imageList: Array<FormData> = [];
  videoList: Array<FormData> = [];

  allowedImage = this.MINIMUM_IMAGE;

  videoForm: FormGroup;
  imageSortChange = false;
  videoSortChange = false;
  private imagePreviewUrl: string;

  constructor(protected service: ProductMediaService,
              protected route: ActivatedRoute,
              protected fb: FormBuilder,
              protected google: GoogleService) {
    super();
  }

  ngOnInit() {
    this.route.data.subscribe((data: { mediaTypes: drf.IChoice[] }) => {
      this.mediaTypes = data.mediaTypes;
    });
    this.videoForm = this.fb.group({
      videoId: ['', [Validators.required, ]]
    });
  }

  get videoId(): FormControl {
    return this.videoForm.get('videoId') as FormControl;
  }

  ngAfterViewInit() {
    this.newImageModal.onClose.subscribe(() => this.onImageModalClosed());
    this.newYoutubeModal.onClose.subscribe(() => this.onYoutubeModalClosed());
    this.videoId.valueChanges.subscribe(value => this.verifyVideo(value));
  }

  openImageModal() {
    this.newImageModal.open(this.entitiesImage.length + 1, this.MAXIMUM_IMAGE);
  }

  openVideoModal() {
    this.newYoutubeModal.open(this.entitiesVideo.length + 1);
  }

  add(media?: products.IProductMedia) {

    if (!media) {
      // this.isAddingNewMedia = true;
    } else {
      this.entities.push(media);

      if (media.type === 'image') {
        this.entitiesImage.push(media);
        this.calculateAllowedImage();
        this.recreateImageList();
      } else if (media.type === 'you_tube') {
        this.entitiesVideo.push(media);
        this.recreateVideoList();
      }

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

  removeImage(index: number) {
    const mediaToRemove = this.entitiesImage[index];
    // media was already saved to API:  record it in deleted media
    // so we can call DELETE on the API
    if (!!mediaToRemove.href) {
      this.deletedMedia.push(mediaToRemove);
    }
    // remove from displayed objects
    this.entitiesImage.splice(index, 1);
    this.calculateAllowedImage();
    this.recreateImageList();
  }

  calculateAllowedImage(): void {
    this.allowedImage = this.entitiesImage.length >= this.MINIMUM_IMAGE ? 1 : this.MINIMUM_IMAGE - this.entitiesImage.length;
    if (this.entitiesImage.length >= this.MAXIMUM_IMAGE) {
      this.allowedImage = 0;
    }
    if (this.entitiesImage.length === 0) {
      this.allowedImage = this.MINIMUM_IMAGE;
    }
  }

  removeVideo(index: number) {
    const mediaToRemove = this.entitiesVideo[index];
    // media was already saved to API:  record it in deleted media
    // so we can call DELETE on the API
    if (!!mediaToRemove.href) {
      this.deletedMedia.push(mediaToRemove);
    }
    // remove from displayed objects
    this.entitiesVideo.splice(index, 1);
    this.recreateVideoList();
  }

  recreateVideoList(): void {
    this.videoList = [];
    this.entitiesVideo.forEach((media, idx, entities) => {
      if (!!media.href) {
        if (media.sortPriority !== idx) {
          const formData: any = new FormData();
          formData.append('href', media?.href);
          formData.append('sortPriority', idx);
          formData.append('type', media?.type);
          if (media?.type === 'image') {

          } else if (media?.type === 'you_tube') {
            formData.append('youtubeVideoId', media?.youtubeVideoId);
          }

          this.videoList.push(formData as FormData);
        }
      } else {
        // new image or video
        if (media?.type === 'image') {
          const xMedia = this.newImages.find((val) => {
            if (val.get('identifier') === media?.identifier) {
              val.set('sortPriority', '' + idx);
              this.videoList.push(val);
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

              this.videoList.push(formData as FormData);
            }
          });
        }
      }
    });
  }

  recreateImageList(): void {
    this.imageList = [];
    this.entitiesImage.forEach((media, idx, entities) => {
      if (!!media.href) {
        if (media.sortPriority !== idx || !media.href) {
          const formData: any = new FormData();
          formData.append('href', media?.href);
          formData.append('sortPriority', idx);
          formData.append('type', media?.type);
          if (media?.type === 'image') {

          } else if (media?.type === 'you_tube') {
            formData.append('youtubeVideoId', media?.youtubeVideoId);
          }
          this.imageList.push(formData as FormData);
        }
      } else {
        logger.debug('recreat4eImaageList', media);
        // new image or video
        if (media?.type === 'image') {
          const xMedia = this.newImages.find((val) => {
            logger.debug('finddata', val.get('identifier'), media?.identifier);
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
      let hasDuplicate = false;
      for (let idx = 0; idx < this.newImageModal.imageUploadForm.length; idx++) {
        if (this.entitiesImage.length  < this.MAXIMUM_IMAGE) {
          logger.debug('onImageModalClosed, current image', this.entitiesImage.length, idx);
          const imageValue = this.newImageModal.imageUploadForm[idx].fd;
          if (this.validateImage(imageValue)) {
            logger.debug('image is valid');
            // data that will be saved to API
            this.newImages.push(imageValue);

            // preview data
            const viewModel = Object.assign({}, this.newImageModal.imageUploadForm[idx].fg.value);
            viewModel.image = this.newImageModal.imagePreviewUrls[idx];
            this.add(viewModel);
          } else {
            hasDuplicate = true;
          }
        } else {
          logger.debug('onImageModalClosed', 'maximum image ', this.entitiesImage.length, idx);
        }
      }
      if (hasDuplicate) {
        alert('Duplicate image detected');
      }
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

    this.imageList.forEach((value, idx) => {
      logger.debug('save ImageList6', value.get('image'));
      value.set('product', product.href);
      if (!!value.get('href')) {
        value.delete('image');
      }
    });

    // submit all changes to the API and an observable of all responses
    return zip(
      ...this.imageList.map(vid => {
        return this.service.save(vid);
      }),
      ...this.videoList.map(vid => {
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
      }),
      ...this.deletedMedia.map(m => this.service.delete(m))
    );
  }

  dropEventImage(event: CdkDragDrop<IProductMedia[]>) {
    logger.debug('EntitiesImage1', this.entitiesImage);
    moveItemInArray(this.entitiesImage, event.previousIndex, event.currentIndex);
    logger.debug('EntitiesImage2', this.entitiesImage);
    this.recreateImageList();
    this.imageSortChange = true;
  }

  dropEventVideo(event: CdkDragDrop<IProductMedia[]>) {
    moveItemInArray(this.entitiesVideo, event.previousIndex, event.currentIndex);
    this.recreateVideoList();
    this.videoSortChange = true;
  }

  validateMedia(): boolean {
    logger.debug('validateMedia', this.entitiesImage);
    return (this.entitiesImage.length >= 3 && this.entitiesImage.length <= 9);
  }

  addVideoAction() {
    if (this.videoForm.valid) {
      const videoId = this.parseYoutubeUrl(this.videoId.value);
      const findVideo = this.entitiesVideo.filter((val, idx) => {
        return val.youtubeVideoId === videoId;
      });
      if (this.entitiesVideo.find((val, idx) => {
        return val.href === videoId;
      })) {

      } else {
        logger.debug('AddVideoAction', videoId);
        const form = this.fb.group({
          href: [null, []],
          image: [null, []],
          sortPriority: [this.entitiesVideo.length + 1, [Validators.required, ]],
          identifier: [this.randomString(10), [Validators.required, ]],
          type: ['you_tube', [Validators.required, ]],
          youtubeVideoId: [videoId, [Validators.required, ]]
        });
        logger.debug(form.value);

        this.newVideos.push(form.value);

        const viewModel = Object.assign({}, form.value);
        viewModel.image = this.imagePreviewUrl;
        this.add(viewModel);
        this.videoId.reset();
        this.imagePreviewUrl = '';
      }

    } else {
      logger.debug(this.videoForm.errors);
      logger.debug(this.videoId.errors);
    }
  }

  randomString(length) {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  private verifyVideo(value: string): void {
    if (!!value) {
      logger.debug(value);
      const videoId = this.parseYoutubeUrl(value);
      if (!!videoId) {
        if (this.entitiesVideo.findIndex((val) => {
          return val.youtubeVideoId === videoId;
        }) < 0) {
          this.google.getOembedDataByUrl(value).subscribe(resp => {
            if (resp.status === 200 && resp.body) {
              logger.debug(resp.body);
              this.imagePreviewUrl = resp.body.thumbnail_url;
              // this.title = resp.body.title;
              // this.clickUrl = `https://youtube.com/watch?v=${(changes['entity'].currentValue as products.IProductMedia).youtubeVideoId}`;
            } else {
              this.videoId.setErrors(
                {apiError: `Video '${value}' not found.`}
              );
            }
          });
        } else {
          this.videoId.setErrors(
            {apiError: `Video '${value}' has duplicate.`}
          );
        }

      } else {
        this.videoId.setErrors(
          {apiError: `Video '${value}' not found.`}
        );
      }

    }
  }

  private parseYoutubeUrl(url: string): string | null {
    const rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]+).*/;
    const tryMatch = url.match(rx);
    return tryMatch[1] ?? null;

  }

  private validateImage(imageValue: FormData): boolean {
    return this.entitiesImage.findIndex((val, idx) => {
      if (!!val.href) {
        logger.debug('validateImage-matching', 'no-href', );
        return false;
      }
      logger.debug('validateImage-matching', val.imageName, (imageValue.get('image') as File).name);
      return val.imageName === (imageValue.get('image') as File).name;
    }) < 0;
  }
}
