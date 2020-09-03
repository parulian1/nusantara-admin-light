import { Component, OnInit } from '@angular/core';
import {AbstractListComponent} from '@nusantara/core';
import {IContentFooter} from '@nusantara/models/content-footer';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'nus-content-footer',
  template: `
    <nus-list-header
      title="Content Footer"
      description="The Content Footer">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <th>Title</th>
        <th>Number of Child</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.title }}</a></td>
        <td>{{ entity.children.length }}</td>
      </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: [``],
})
export class ContentFooterListComponent extends AbstractListComponent<IContentFooter>{
  constructor(route: ActivatedRoute) { super(route); }
}
