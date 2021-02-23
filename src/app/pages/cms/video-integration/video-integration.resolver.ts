import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { VideoIntegrationService } from '@nusantara/services';
import { IVideoIntegrationItem} from '@nusantara/models';

@Injectable({
  providedIn: 'root',
})
export class VideoIntegrationResolver implements Resolve<IVideoIntegrationItem>{
  constructor(private service: VideoIntegrationService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IVideoIntegrationItem> {
    const slug = route.paramMap.get('slug');
    return this.service.fetch(slug);
  }
}
