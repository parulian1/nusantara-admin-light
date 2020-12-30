import {Component, OnInit} from '@angular/core';
import {AbstractListComponent} from '@nusantara/core';
import {IOnboardingContent} from '@nusantara/models';
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
        <th>Button Text</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        <td>{{ entity.buttonText }}</td>
      </tr>
      </tbody>
    </table>
  `,
  styles: []
})
export class OnboardingListComponent extends AbstractListComponent<IOnboardingContent> {

  constructor(route: ActivatedRoute) {
    super(route);
  }


}
