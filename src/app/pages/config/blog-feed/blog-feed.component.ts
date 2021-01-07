import {Component, OnInit} from '@angular/core';
import {BlogFeedConfigService} from '@nusantara/services/blog-feed-config.service';
import {AbstractDetailComponent, IResultResponse, ToastLevelEnum, ToastService} from '@nusantara/core';
import {IBlogFeedSetting} from '@nusantara/models/blog-feed-setting';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl} from '@angular/forms';
import {device} from '@nusantara/models';

@Component({
  selector: 'nus-blog-feed',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      [typeName]="entityTypeName">
    </nus-detail-title>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span>Wordpress Blog URL (only domain name)</span>
        <input type="url" [formControl]="blogUrl" name="blogUrl">
        <nus-field-errors [control]="blogUrl"></nus-field-errors>
      </label>

      <label>
        <span>RSS Blog feed URL</span>
        <input type="text" [formControl]="blogFeedUrl" name="blogFeedUrl">
        <nus-field-errors [control]="blogFeedUrl"></nus-field-errors>
      </label>

      <label>
        <span>
          Cache result for how many hour(s)
        </span>
        <input type="number" [formControl]="blogFeedCacheTime"
               pattern="[0-9]+">
        <nus-field-errors [control]="blogFeedCacheTime"></nus-field-errors>
      </label>


      <nus-detail-actions
        [component]="this"
        [hideDelete]="true"
        (cancel)="navigateToParent(true)">
      </nus-detail-actions>
    </form>
  `,
  styles: [``]
})
export class BlogFeedComponent extends AbstractDetailComponent<IBlogFeedSetting> implements OnInit {

  entity: IBlogFeedSetting;

  constructor(service: BlogFeedConfigService,
              router: Router,
              route: ActivatedRoute,
              public fb: FormBuilder,
              toast: ToastService) {
    super(route, router, toast, service);
  }

  get blogUrl(): FormControl {
    return this.form.get('blogUrl') as FormControl;
  }

  get blogFeedUrl(): FormControl {
    return this.form.get('blogFeedUrl') as FormControl;
  }

  get blogFeedCacheTime(): FormControl {
    return this.form.get('blogFeedCacheTime') as FormControl;
  }


  ngOnInit() {
    super.ngOnInit();
  }

  initializeForm(entity?: IBlogFeedSetting) {
    this.entity = entity;
    this.form = this.fb.group({
      href: [entity?.href],
      blogUrl: [entity?.blogUrl],
      blogFeedUrl: [entity?.blogFeedUrl],
      blogFeedCacheTime: [entity?.blogFeedCacheTime ?? 12],
    });
  }

  setOriginalEntityName(entity?: IBlogFeedSetting) {
      this.originalEntityName = 'Blog Feed Settings';

  }


  navigateToParent(warnOnDirty = false) {
    if (warnOnDirty && this.form?.dirty) {
      const leavePage = confirm('Your changes will be lost.  Do you want to continue?');
      if (!leavePage) {
        return;
      }
    }
    this.router.navigate(['../../'], {relativeTo: this.route});
  }

}
