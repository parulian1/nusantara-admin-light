import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, zip } from 'rxjs';

import { AbstractEditingComponent, DialogResult, IResultResponse } from '@nusantara/core';
import { drf, themes, products } from '@nusantara/models';
import { ThemeMediaService } from '@nusantara/services';

import { NewThemeImageComponent } from './new-theme-image.component';

/**
 * Container for all the media objects assigned to a single theme.
 * Media can either be a picture (jpg/png)
 *
 * @see ITheme
 */
@Component({
  selector: 'nus-theme-media-host',
  template: `
    <h2 i18n>Banner
      <button (click)="newImageModal.open()" type="button" title="Add new Image">
        <i class="material-icons">image</i>
      </button>
    </h2>

    <nus-theme-media
      *ngFor="let media of entities; let i=index"
      [entity]="media"
      (remove)="remove(i)">
    </nus-theme-media>

    <!-- Pop-ups for adding new media -->
    <nus-new-theme-image></nus-new-theme-image>
  `,
  styles: [
    'h2 {font-size: .7em; font-weight: bold; display: block;}',
    'h2>button { background: transparent; border: none; opacity: .3; transition: all .3s; margin-top:10px; position:relative; top: 6px }',
    'h2>button:hover, h2>button:focus { opacity: 1; color: var(--success); } ',
    `nus-theme-media {
      display: inline-table;
      height: 160px; width: 160px;
      box-shadow: 0 0 8px -1px var(--shadow-color);
      margin: 0 8px 16px 0;
    }`,
  ]
})
export class ThemeMediaHostComponent extends AbstractEditingComponent<FormArray> implements OnInit, AfterViewInit {

  mediaTypes: Array<drf.IChoice>;

  @Input() form: FormArray;
  @ViewChild(NewThemeImageComponent) newImageModal: NewThemeImageComponent;

  entities: Array<products.IProductMedia> = [];

  newImages: Array<FormData> = [];
  deletedMedia: Array<products.IProductMedia> = [];

  constructor(protected service: ThemeMediaService,
              protected route: ActivatedRoute,
              protected fb: FormBuilder) { super(); }


  get imageCount(): number { return this.entities.filter(e => e.type === 'image').length; }

  ngOnInit() {
    this.route.data.subscribe((data: {mediaTypes: drf.IChoice[]}) => {
      this.mediaTypes = data.mediaTypes;
    });
  }

  ngAfterViewInit() {
    this.newImageModal.onClose.subscribe(() => this.onImageModalClosed());
  }

  add(media?: products.IProductMedia) {

    if (!media) {
      // this.isAddingNewMedia = true;
    } else {
      this.entities.push(media);
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
   * If the user completed selecting a new theme image,
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

  /**
   *
   * @param theme The parent theme which should own all the images
   */
  saveAll(theme: themes.ITheme): Observable<IResultResponse[]> {

    // make sure all new images have the theme href set
    this.newImages.forEach((value) => { value.set('theme', theme.href); });

    // submit all changes to the API and an observable of all responses
    return zip(
      ...this.newImages.map(img => this.service.save(img)),
      ...this.deletedMedia.map(m => this.service.delete(m))
    );
  }

}
