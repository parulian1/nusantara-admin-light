import { ActivatedRoute } from '@angular/router';
import { AbstractListComponent } from '@nusantara/core';
import { products } from '@nusantara/models';
import { Component } from '@angular/core';

/**
 * A searchable list of all product option.
 *
 * @see
 */
@Component({
  selector: 'nus-product-option-list',
  template: `
    <nus-list-header title="Product Option"></nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <th translate i18n>Name</th>
        <th i18n>Type</th>
        <th class="numeric" i18n>Minimum Length</th>
        <th class="numeric" i18n>Maximum length</th>
      </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
          <td>{{ entity.type }}</td>
          <td class="numeric">{{ entity.minimumLength }}</td>
          <td class="numeric">{{ entity.maximumLength }}</td>
        </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: []
})
export class ProductOptionListComponent extends AbstractListComponent<products.IProductOption> {
  constructor(route: ActivatedRoute) {
    super(route);
  }
}
