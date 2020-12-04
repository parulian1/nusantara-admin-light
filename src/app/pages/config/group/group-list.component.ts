import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { IAccessGroup } from "@nusantara/models";

@Component({
  selector: 'nus-group-list',
  template: `
    <nus-list-header
      title="Group"
      description="A group with permission information." [canAddNew]="false">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity.href|entityToSlug]">{{ entity.name }} </a></td>
      </tr>
      </tbody>
    </table>
  `,
  styles: [],
})
export class GroupListComponent extends AbstractListComponent<IAccessGroup> {
  constructor(route: ActivatedRoute) { super(route);}
}
