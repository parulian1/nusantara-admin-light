import { Component } from '@angular/core';

import { AbstractListComponent } from '@nusantara/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'nus-promotion-list',
  template: `
    <nus-list-header
      title="Promotions">
    </nus-list-header>
    <table>
<!--      <thead>-->
<!--      <tr>-->
<!--        <th translate>Name</th>-->
<!--      </tr>-->
<!--      </thead>-->
<!--      <tbody>-->
<!--      <tr *ngFor="let entity of page.entities">-->
<!--        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>-->
<!--      </tr>-->
<!--      </tbody>-->
    </table>
  `,
  styles: []
})
export class PromotionListComponent extends AbstractListComponent<any> {
  constructor(route: ActivatedRoute) { super(route); }
}
