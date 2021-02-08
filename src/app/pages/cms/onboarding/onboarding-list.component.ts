import {Component, OnInit} from '@angular/core';
import {AbstractListComponent} from '@nusantara/core';
import {IOnBoarding} from '@nusantara/models';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'nus-onboarding-list',
  template: `
    <nus-list-header
      title="Onboarding"
      description="">
    </nus-list-header>
    <div class="filtering">
      <nus-include-deleted></nus-include-deleted>
    </div>
    <nus-pagination [page]="page"></nus-pagination>
    <table>
      <thead>
      <tr>
        <th>Name</th>
        <th>Page</th>
        <th>Is Active</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        <td>{{ entity.type }}</td>
        <td>{{ entity.isActive }}</td>
      </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: []
})
export class OnboardingListComponent extends AbstractListComponent<IOnBoarding> {

  constructor(route: ActivatedRoute) {
    super(route);
  }


}
