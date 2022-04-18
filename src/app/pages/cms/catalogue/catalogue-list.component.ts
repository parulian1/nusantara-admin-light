import { Component, OnInit } from '@angular/core';
import {AbstractListComponent} from '@nusantara/core';
import {ICatalogue} from '@nusantara/models/catalogue/catalogue';
import {ActivatedRoute} from '@angular/router';
import {CatalogueService} from '@nusantara/services/catalogue.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'nus-catalogue-list',
  template: `
    <nus-list-header
      title="Catalogue File List"
      [canSearch]="true"
      description="Uploaded catalog file" i18n-title>
    </nus-list-header>
    <div class="filtering">
      <nus-include-inactive></nus-include-inactive>
    </div>
    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <th i18n>Name</th>
        <th i18n>Image</th>
        <th i18n>File</th>
        <th class="centered" i18n>Is Active</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        <td>
          <img [src]="entity?.image" class="preview" *ngIf="!!entity?.image" alt="catalogue image {{entity?.name}}">
          <img src="assets/no-image_id.png" class="preview" *ngIf="!entity?.image" alt="no image">

        </td>
        <td>
          <span *ngIf="!entity?.download; else hasFile">NO FILE</span>
          <ng-template #hasFile>
            <a target="_blank" (click)="download(entity)" title="Download catalogue {{entity?.name}}" class="button">Download File</a>
          </ng-template>
        </td>
        <td class="centered"><nus-true-false [value]="entity.isActive"></nus-true-false></td>
      </tr>
      </tbody>
    </table>
  `,
  styles: [
    `
    img.preview {
      max-height: 100px;
      max-width: 100px;
    }`
  ]
})
export class CatalogueListComponent extends AbstractListComponent<ICatalogue> {

  constructor(route: ActivatedRoute, private service: CatalogueService) { super(route); }

  download(catalogue: ICatalogue) {
    this.service.getDownloadLink(catalogue)
      .subscribe(data => {
        const a = document.createElement('a');
        a.href = data.url;
        a.download = data.url.split('/').pop();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });

  }
}
