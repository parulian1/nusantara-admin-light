import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { IVideoIntegrationItem } from '@nusantara/models/video-integration';
import { VideoIntegrationService } from '@nusantara/services/video-integration.service';

import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root'})
export class VideoIntegrationListResolver implements Resolve<IVideoIntegrationItem[]> {
  constructor(private service: VideoIntegrationService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IVideoIntegrationItem[]> {
    return this.service.fetchAll();
  }
}
