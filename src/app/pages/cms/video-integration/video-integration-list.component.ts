import { Component, OnInit } from '@angular/core';
import { IVideoIntegrationItem } from '@nusantara/models/video-integration';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import {getYoutubeIdFromUrl, youtubeUrl} from './utils';

@Component({
  selector: 'nus-video-integration-list',
  template: `
    <nus-list-header i18n-title
      title="Video Integration"
      description="Customer reviews of Video Integration">
    </nus-list-header>
    <div class="filtering">
      <nus-include-deleted></nus-include-deleted>
    </div>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <th i18n>Title</th>
        <th i18n>Type</th>
        <th i18n>Sort Priority</th>
        <th i18n>Emmbed Url</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        <td>{{ entity.type }}</td>
        <td>{{ entity.sortPriority }}</td>
        <td>
          <a target="_blank" [href]="entity.embededUrl">
            {{ entity.embededUrl }}
            <img class="video-preview" [src]="getVideoThumbnail(entity.embededUrl)">
          </a>
        </td>
      </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: [`
    .video-preview {
      max-width: 120px;
    }
  `]
})
export class VideoIntegrationListComponent extends AbstractListComponent<IVideoIntegrationItem> {
  constructor(route: ActivatedRoute) { super(route); }

  getVideoThumbnail(embededUrl: string) : string {
    return `https://img.youtube.com/vi/${getYoutubeIdFromUrl(embededUrl)}/mqdefault.jpg`
  }
}
