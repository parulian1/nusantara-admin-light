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

    <table>
      <thead>
      <tr>
        <th>Name</th>
        <th>Page</th>
        <th>Is Active</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        <td>{{ entity.type }}</td>
        <td>{{ entity.isActive }}</td>
      </tr>
      </tbody>
    </table>
  `,
  styles: []
})
export class OnboardingListComponent extends AbstractListComponent<IOnBoarding> {

  constructor(route: ActivatedRoute) {
    super(route);
  }


}
