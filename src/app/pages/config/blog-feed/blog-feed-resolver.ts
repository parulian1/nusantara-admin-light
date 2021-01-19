import {Injectable} from '@angular/core';
import {AbstractCrudService, AbstractDetailResolver} from '@nusantara/core';
import {IBlogFeedSetting} from '@nusantara/models/blog-feed-setting';
import {BlogFeedConfigService} from '@nusantara/services/blog-feed-config.service';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogFeedResolver implements Resolve<IBlogFeedSetting>{

  protected readonly service: BlogFeedConfigService;

  constructor(service: BlogFeedConfigService) {
    this.service = service;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IBlogFeedSetting> | Observable<never> {
    return this.service.fetchSettings();
  }
}
