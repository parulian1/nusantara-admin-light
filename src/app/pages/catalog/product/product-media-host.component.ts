import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AbstractEditingComponent, DialogResult, IChoiceFieldChoice } from '@nusantara/core';
import { ProductMediaService } from '@nusantara/services';
import { IProductMedia } from '@nusantara/models';
import { ActivatedRoute } from '@angular/router';
import { NewProductImageComponent } from '@nusantara/pages/catalog/product/media';

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
      <button (click)="addNewImage()" type="button">Add Image</button>
      <button (click)="add()" type="button">Add Video</button>
    </h2>

    <nus-product-media
      *ngFor="let media of entities; let i=index"
      [entity]="media"
      (remove)="remove(i)">
    </nus-product-media>

    <nus-new-product-image></nus-new-product-image>
  `,
  styles: [':host { display: contents; }' ]
})
export class ProductMediaHostComponent extends AbstractEditingComponent<FormArray> implements OnInit, AfterViewInit {

  mediaTypes: Array<IChoiceFieldChoice>;
  @Input() form: FormArray;
  @ViewChild(NewProductImageComponent) newImageModal: NewProductImageComponent;

  entities: Array<IProductMedia> = [];

  newImages: Array<FormData> = [];
  newVideos: Array<IProductMedia> = [];

  deletedMedia: Array<IProductMedia> = [];

  constructor(protected service: ProductMediaService,
              protected route: ActivatedRoute,
              protected fb: FormBuilder) { super(); }

  ngOnInit() {
    this.route.data.subscribe((data: {mediaTypes: IChoiceFieldChoice[]}) => {
      this.mediaTypes = data.mediaTypes;
    });
  }

  ngAfterViewInit() {
    this.newImageModal.onClose.subscribe(() => this.onImageModalClosed());
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
    this.form.removeAt(index);
  }

  addNewImage() {
    this.newImageModal.open();
  }

  onImageModalClosed() {
    if (this.newImageModal.result === DialogResult.OK) {
      this.newImages.push(this.newImageModal.getValue());
      const viewModel = Object.assign({}, this.newImageModal.form.value);
      viewModel.image = this.newImageModal.imagePreviewUrl;
      console.log('viewmodel', viewModel);
      this.add(viewModel);
    }
  }


}
