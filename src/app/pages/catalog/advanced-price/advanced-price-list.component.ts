import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { IAdvancedPriceList } from '@nusantara/models/products/advanced-price-list';

@Component({
  selector: 'nus-advanced-price-list',
  template: `
    <nus-list-header
      title="Advanced Price List">
    </nus-list-header>
    <div class="filtering">
      <!-- Soft deleted product but change the wording into InActive -->
      <nus-include-deleted text="Show Inactive Advanced Price"></nus-include-deleted>
    </div>
    <nus-pagination [page]="page"></nus-pagination>
    <table>
      <thead>
        <tr>
          <th translate>Price Name</th>
          <th translate>Type</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
          <td class="column-warehouse">
            <span>Warehouse ( {{ entity.warehouses.length }} ) </span>
            <!-- Tooltip-->
            <div class="tooltip">
              <i class="material-icons">info_outline</i>
              <div class="tooltip-content">
                <ul>
                  <li *ngFor="let warehouse of entity.warehouses">
                    <span class="body-2" >{{warehouse.name}}</span>
                  </li>
                </ul>
              </div>
            </div>
            <!-- Tooltip-->
          </td>
        </tr>
      </tbody>
    </table>
    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: [`
    .column-warehouse > *{
      vertical-align: middle;
    }

    /* Tooltip container */
    .tooltip {
      position: relative;
      display: inline-block;
      margin-left: 5px;
      height: 22px;
      cursor: pointer;
    }

    .tooltip > i {
      font-size: 22px;
    }

    /* Tooltip text */
    .tooltip .tooltip-content {
      display: none;
      width: max-content;
      background-color: #F1F1F1;
      color: var(--darken-grey);
      text-align: left;
      padding: 16px;

      /* Position the tooltip text - see examples below! */
      position: absolute;
      z-index: 1;
      top: -5px;
      left: 180%;
      filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.16)) drop-shadow(0px -2px 6px rgba(0, 0, 0, 0.08));
    }

    /* Show the tooltip text when you mouse over the tooltip container */
    .tooltip:hover .tooltip-content {
      display: inline-block;
    }
    .tooltip .tooltip-content::before {
      content: " ";
      position: absolute;
      right: 100%; /* To the left of the tooltip */
      margin-top: 0;
      margin-right: -8px;
      width: 18px;
      height: 18px;
      background: #F1F1F1;
      transform: rotate(-45deg);
    }

    .tooltip-content > ul {
      margin: 0;
      padding-inline-start: 24px;
    }
  `]
})

export class AdvancedPriceListComponent extends AbstractListComponent<IAdvancedPriceList> {
  constructor(route: ActivatedRoute) {
    super(route);
  }
}
