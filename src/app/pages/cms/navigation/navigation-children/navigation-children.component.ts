import {Component, Input, OnInit} from '@angular/core';
import {INavigation} from '@nusantara/models';

@Component({
  selector: 'nus-navigation-children',
  template: `
    <div style="margin-top: 30px;">
      <div class="filtering">
        <nus-include-deleted></nus-include-deleted>
      </div>
      <h1>Children</h1>

      <table>
        <thead>
        <tr>
          <th>Title</th>
          <th>Number of Child</th>
        </tr>
        </thead>
        <tbody>
        <tr *ngIf="children.length === 0">
          <td colspan="3" style="text-align: center;">
            <i>Doesnt Have Children</i>
          </td>
        </tr>
        <tr *ngFor="let entity of children">
          <td>
            <a [routerLink]="['/cms/navigation', entity | entityToSlug]">
              {{ entity.title }}
            </a>
          </td>
          <td>{{ entity.children.length }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
  `]
})
export class NavigationChildrenComponent {
  @Input() children: INavigation[];

  constructor() { }


}
