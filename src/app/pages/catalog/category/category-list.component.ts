import { Component, OnInit } from '@angular/core';

import { ICategory } from '@nusantara/models';
import { PagedResponse } from '@nusantara/core/pagination';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'nus-category-list',
  template: `
    <h1>Categories</h1>
    <nav>
      <a [routerLink]="['new']">New</a>
    </nav>
    <table>
      <thead>
        <tr>
          <th translate>Name</th>
          <th translate>Depth</th>
          <th translate>Icon</th>
          <th translate>Product Count</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.pathName }}</a></td>
          <td><img [src]="entity.icon.href" alt="icon" class="icon"></td>
          <td>---</td>
        </tr>
      </tbody>
    </table>
    <code><pre>{{page|json}}</pre></code>
  `,
  styles: [
    'img.icon { background-color: gray; height: 16px; width: 16px; }'
  ]
})
export class CategoryListComponent implements OnInit {

  page: PagedResponse<ICategory>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe((data: { page: PagedResponse<ICategory> }) => {
      this.page = data.page;
    });
  }
}
