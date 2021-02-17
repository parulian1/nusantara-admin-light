import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { IVideoIntegrationItem, VideoIntegrationItemChoices } from '@nusantara/models';
import { AbstractDetailComponent, ToastService } from '@nusantara/core';
import { VideoIntegrationService } from '@nusantara/services';

import { getYoutubeIdFromUrl, youtubeUrl, youtubeUrlValidator } from './utils';

@Component({
  selector: 'nus-video-integration',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Video Integration">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()" #f>

      <label>
        <span>Title</span>
        <input type="text" [formControl]="name" name="name">

        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>

      <label>
        <span>Description</span>
        <textarea name="description" cols="30" rows="10" [formControl]="description">
        </textarea>

        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>


      <label>
        <span>Type</span>

        <select formControlName="type">
          <option value="" disabled>-- Choose Type --</option>
          <option *ngFor="let choice of typeChoices" [ngValue]="choice.value">
            {{ choice.displayName }}
          </option>
        </select>

        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>

      <label>
        <span>Embeded Url</span>
        <input type="text" [formControl]="embededUrl" name="youtube-video-id">

        <div style="margin: 0.1rem 0 0.5rem; font-size: 0.7rem;">
          example: <span style="font-weight: bold;">https://www.youtube.com/watch?v=bWXazVhlyxQ</span>
        </div>

        <nus-field-errors [control]="embededUrl"></nus-field-errors>

        <!-- extra error messages -->
        <div *ngIf="embededUrl.errors && (embededUrl.touched || embededUrl.dirty)" class="error-detail">
          <div *ngIf="embededUrl.hasError('invalidYoutubeUrl')">
            Your url is invalid, please follow example properly
          </div>
        </div>
      </label>


      <label>
        <span>Sort Priority</span>
        <input type="number" [formControl]="sortPriority" name="sortPriority">

        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>

      <label>
        <input type="checkbox" [formControl]="isActive" name="isActive"> Is Active
        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
  `,
  styles: [``]
})
export class VideoIntegrationComponent extends AbstractDetailComponent<IVideoIntegrationItem> implements OnInit {
  typeChoices: { value: string, displayName: string }[] = [
    { value: VideoIntegrationItemChoices.youtube, displayName: 'Youtube' }
  ];
  contentGroup: string;

  constructor(service: VideoIntegrationService,
              private service1: VideoIntegrationService,
              public fb: FormBuilder,
              toast: ToastService,
              route: ActivatedRoute,
              router: Router) {
    super(route, router, toast, service);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.service.fetchFirstGroup().subscribe((contentGroup) => {
      this.contentGroup = contentGroup;
    });
  }

  initializeForm(entity?: IVideoIntegrationItem) {
    this.form = this.fb.group({
      name: [entity?.name ?? '', [Validators.required]],
      href: [entity?.href ?? '', []],
      description: [entity?.description ?? '', [Validators.required]],
      type: [entity?.type ?? VideoIntegrationItemChoices.youtube, [Validators.required]],
      embededUrl: [entity?.embededUrl ?? '', [Validators.required, youtubeUrlValidator]],
      sortPriority: [entity?.sortPriority ?? 0, []],
      isActive: [entity?.isActive ?? true, []],
    });
  }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get description(): FormControl { return this.form.get('description') as FormControl; }
  get type(): FormControl { return this.form.get('type') as FormControl; }
  get embededUrl(): FormControl { return this.form.get('embededUrl') as FormControl; }
  get sortPriority(): FormControl { return this.form.get('sortPriority') as FormControl; }
  get isActive(): FormControl { return this.form.get('isActive') as FormControl; }

  getFormValue() {
    return {
      ...this.form.value,
      contentGroup: this.contentGroup,
      youtubeVideoId: getYoutubeIdFromUrl(this.embededUrl.value ?? '')
    };
  }

  /**
   * get youtube url include id
   * youtubeId: simpl3b3tt3r
   * ex: https://www.youtube.com/watch?v=simpl3b3tt3r
   */
  youtube(youtubeId: string): string | null {
    return youtubeUrl(youtubeId, false);
  }
}
