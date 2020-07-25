import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { INamedHrefEntity } from '@nusantara/models/base';

@Component({
  selector: 'nus-employee-list',
  template: `
    <nus-list-header
      title="Employees"
      description="Users who can actually meh">
    </nus-list-header>
    <table>
      <thead>
        <tr>
          <th translate>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [ ]
})
export class EmployeeListComponent extends AbstractListComponent<INamedHrefEntity> {
  constructor(route: ActivatedRoute) { super(route); }
}
