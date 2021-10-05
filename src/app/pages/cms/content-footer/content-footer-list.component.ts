import { Component, OnInit } from '@angular/core';
import {AbstractListComponent} from '@nusantara/core';
import {IContentFooter} from '@nusantara/models/content-footer';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'nus-content-footer',
  template: `
    <nus-list-header i18n-title
      title="Content Footer"
      description="The Content Footer">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <th i18n>Title</th>
        <th class="numeric" i18n>Number of Child</th>
        <th class="centered" i18n>Is Active</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.title }}</a></td>
        <td class="numeric">{{ entity.children.length }}</td>
        <td class="centered"><nus-true-false [value]="entity.isActive"></nus-true-false></td>
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
