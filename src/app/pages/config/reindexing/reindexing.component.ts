import {Component, OnInit} from '@angular/core';
import {ReindexingService} from '@nusantara/pages/config/reindexing/reindexing.service';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {of} from 'rxjs';
import {ErrorResult, ToastLevelEnum, ToastService} from '@nusantara/core';
import {IHttpFailure} from '@nusantara/models';

@Component({
  selector: 'nus-reindexing',
  template: `
    <h1 class="title-1" i18n>Reindexing</h1>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Reindex Product (SOLR)</h1>
      </div>
      <div>
        <button (click)="doReindex('product')" class="control" i18n>Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Reindex Product Reference</h1>
      </div>
      <div>
        <button (click)="doReindex('reference')" class="control" i18n>Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Reindex Vendor</h1>
      </div>
      <div>
        <button (click)="doReindex('vendor')" class="control" i18n>Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Reindex Product Category</h1>
      </div>
      <div>
        <button (click)="doReindex('category')" class="control" i18n>Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Reindex Product Class</h1>
      </div>
      <div>
        <button (click)="doReindex('product-class')" class="control" i18n>Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Reindex Highlight</h1>
      </div>
      <div>
        <button (click)="doReindex('highlight')" class="control" i18n>Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Reindex User</h1>
      </div>
      <div>
        <button (click)="doReindex('users')" class="control" i18n>Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Reindex Auth Group User</h1>
      </div>
      <div>
        <button (click)="doReindex('group')" class="control" i18n>Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Reindex Customer Group User</h1>
      </div>
      <div>
        <button (click)="doReindex('customer-group')" class="control" i18n>Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Recreate Google Data Feed</h1>
      </div>
      <div>
        <button (click)="doReindex('google-feed')" class="control" i18n>Open</button>
      </div>
    </div>
  `,
  styleUrls: ['./reindexing.component.css']
})
export class ReindexingComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private reindexingService: ReindexingService,
    public toast: ToastService, ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(data => {
      const slug = data.get('slug');
      if (!!slug) {
        this.doReindex(slug);
      }
    });
  }

  doReindex(slug: string) {
    this.reindexingService.doTask(slug).pipe(catchError(err => {
      if (err instanceof HttpErrorResponse) {
        return of(new ErrorResult<IHttpFailure>(err.error, err.status));
      } else {
        return of(new ErrorResult<IHttpFailure>({detail: 'Network error.. probably?'}, err.status));
      }
    })).subscribe(res => {
      console.log(res);
      if (res.ok) {
        this.toast?.addMessage(`"Reindex ${slug}" was successfull.`, 'Success', ToastLevelEnum.success);
      } else {
        this.toast?.addError('Failed', 'Failed to Reindex');
      }
    });
  }

}
