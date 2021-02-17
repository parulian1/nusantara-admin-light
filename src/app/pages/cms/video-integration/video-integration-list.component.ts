import { Component, OnInit } from '@angular/core';
import { IVideoIntegrationItem } from '@nusantara/models/video-integration';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { youtubeUrl } from './utils';

@Component({
  selector: 'nus-video-integration-list',
  template: `
    <nus-list-header
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
        <th>Title</th>
        <th>Type</th>
        <th>Sort Priority</th>
        <th>Emmbed Url</th>
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
          </a>
        </td>
      </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: [``]
})
export class VideoIntegrationListComponent extends AbstractListComponent<IVideoIntegrationItem> {
  constructor(route: ActivatedRoute) { super(route); }

  youtube(youtubeId): string {
    return youtubeUrl(youtubeId, true);
  }
}
