import { Component, OnInit } from '@angular/core';
import { IVideoIntegrationItem } from '@nusantara/models/video-integration';
import { ActivatedRoute } from '@angular/router';
import {youtubeUrl} from './utils';

@Component({
  selector: 'nus-video-integration-list',
  template: `
    <nus-list-header
      [canSearch]="false"
      title="Video Integration"
      description="Customer reviews of Video Integration">
    </nus-list-header>

    <table>
      <thead>
      <tr>
        <th>Name</th>
        <th>Youtube Video</th>
        <th>Sort Priority</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        <td>
          <a target="_blank" href="{{ youtube(entity.youtubeVideoId) }}">
            {{ entity.youtubeVideoId }}
          </a>
        </td>
        <td>{{ entity.sortPriority }}</td>
      </tr>
      </tbody>
    </table>
  `,
  styles: [``]
})
export class VideoIntegrationListComponent implements OnInit {
  page: { entities?: IVideoIntegrationItem[]} = { entities: [] };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: { page: IVideoIntegrationItem[] }) => {
      this.page.entities = data.page;
    });
  }

  youtube(youtubeId): string {
    return youtubeUrl(youtubeId, true);
  }
}
