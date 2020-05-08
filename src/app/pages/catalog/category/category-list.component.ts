import { Component, OnInit } from '@angular/core';
import { ICategory, CategoryService } from './category.service';


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
          <th translate>Icon</th>
          <th translate>Product Count</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
          <td><img [src]="entity.icon.href" alt="icon" class="icon"></td>
          <td>{{ entity.products.count }}</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [
    'img.icon { background-color: gray; height: 16px; width: 16px; }'
  ]
})
export class CategoryListComponent implements OnInit {

  public entities: Array<ICategory> = [];

  constructor(private service: CategoryService) { }

  ngOnInit(): void {
    this.service.fetchList().subscribe(
      users => this.entities = users
    );
  }
}
