import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { IVideoIntegrationItem } from '@nusantara/models';
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
        <span>Name</span>
        <input type="text" [formControl]="name" name="name">

        <div *ngIf="name.errors && (name.touched || name.dirty)" class="error-detail">
          <div *ngIf="name.errors.required">Required</div>
          <div *ngIf="name.errors.apiError"></div>
        </div>
      </label>

      <label>
        <span>Youtube Video</span>
        <input type="text" [formControl]="youtubeVideoId" name="youtube-video-id">

        <div style="margin: 0.1rem 0 0.5rem; font-size: 0.7rem;">
          example: <span style="font-weight: bold;">https://www.youtube.com/watch?v=bWXazVhlyxQ</span>
        </div>

        <div *ngIf="youtubeVideoId.errors && (youtubeVideoId.touched || youtubeVideoId.dirty)" class="error-detail">
          <div *ngIf="youtubeVideoId.hasError('required')">Required</div>
          <div *ngIf="youtubeVideoId.hasError('invalidYoutubeUrl')">
            Your url is invalid, please follow example properly
          </div>
        </div>
      </label>


      <label>
        <span>Sort Priority</span>
        <input type="number" [formControl]="sortPriority" name="sortPriority">
        <div *ngIf="sortPriority.errors && (sortPriority.touched || sortPriority.dirty)" class="error-detail">
          <div *ngIf="sortPriority.errors.required">Required</div>
          <div *ngIf="sortPriority.errors.min">Minimal value is 0</div>
        </div>
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
export class VideoIntegrationComponent implements OnInit {
  isNew = true;
  nonFieldErrors: string[] = [];
  originalEntityName: string;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private service: VideoIntegrationService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((data: { entity?: IVideoIntegrationItem }) => {
      this.initializeForm(data.entity);
      this.isNew = !data?.entity;
      this.originalEntityName = data.entity?.name || 'Create Video Integration';
    });
  }

  initializeForm(entity?: IVideoIntegrationItem): void {
    this.form = this.fb.group({
      href: [entity?.href ?? '', []],
      name: [entity?.name ?? '', [Validators.required]],
      youtubeVideoId: [this.youtube(entity?.youtubeVideoId) ?? '', [youtubeUrlValidator, Validators.required]],
      sortPriority: [entity?.sortPriority ?? 0, [Validators.required, Validators.min(0)]],
    });
  }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get youtubeVideoId(): FormControl { return this.form.get('youtubeVideoId') as FormControl; }
  get sortPriority(): FormControl { return this.form.get('sortPriority') as FormControl; }

  getValue(): any {
    return {
      ...this.form.value,
      youtubeVideoId: getYoutubeIdFromUrl(this.youtubeVideoId.value ?? '')
    };
  }

  save(): void {
    if (this.form.valid) {
      if (this.isNew) {
        this.service.create2(this.getValue()).subscribe(() => {
          this.navigateToParent(true);
        });
      } else {
        this.service.update2(this.getValue()).subscribe(() => {
          this.navigateToParent(true);
        });
      }
    }
  }

  delete(): void {
    this.service.delete(this.getValue()).subscribe(() => {
      this.navigateToParent(true);
    });
  }

  /**
   * redirect to video integration list
   */
  navigateToParent(isTrue?: boolean): void {
    this.router.navigate(['/cms/video-integration']);
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
