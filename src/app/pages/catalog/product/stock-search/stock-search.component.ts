import { Component, Input, OnInit } from '@angular/core';
import { InventoryStockRecordService, WarehouseService } from '@nusantara/services';
import { IStockSearch } from '@nusantara/models/products/stock-search';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'nus-stock-search',
  template: `
    <h3 i18n>Product Inventory</h3>
    <table *ngIf="!!entity" class="table-accordion">
      <thead>
      <tr>
        <th i18n>Warehouse (Location)</th>
        <th i18n>Stock</th>
      </tr>
      </thead>
      <tbody>
      <ng-container *ngFor="let ent of entity">
        <ng-container *ngFor="let subLocation of ent.subLocations">
          <tr>
            <td colspan="2">

              <table class="table-accordion-nested">
                <tr [id]="'heading'+subLocation.id" class="panel-heading" role="tab"
                    (click)="fetchSkuList(ent.href, subLocation.href)">
                  <td>
                    {{ ent.name }} ({{ subLocation.name | titlecase }})
                  </td>
                  <td data-qa="quantity">
                    <div class="sublocation-total-qty">
                      {{ subLocation.quantity }}
                      <div class="chevron-round">
                        <ng-container *ngIf="subLocation.displaySku">
                          <i class="material-icons">expand_more</i>
                        </ng-container>
                        <ng-container *ngIf="!subLocation.displaySku">
                          <i class="material-icons">expand_less</i>
                        </ng-container>
                      </div>
                    </div>
                  </td>
                </tr>
                <ng-container *ngIf="subLocation.skuList.length > 0">
                  <tr class="panel-body" role="tabpanel" [attr.aria-labelledby]="'heading'+subLocation.id"
                      [@contentExpansion]="subLocation.displaySku ? 'expanded':'collapsed'"
                      *ngFor="let item of subLocation.skuList">
                    <td>
                        {{item.sku}}
                    </td>
                    <td>{{item.latestStock}}</td>
                  </tr>
                </ng-container>
              </table>

            </td>
          </tr>
        </ng-container>
      </ng-container>
      </tbody>
    </table>

  `,
  styles: [
    'h3 { font-size: 20px; margin: 0 0 20px 0; }',
    `
      .table-accordion > tbody > tr > td {
        padding: 0;
      }

      .table-accordion tr th:first-child {
        width: 85%;
      }

      .table-accordion-nested {
        border-collapse: collapse;
        border: none;
      }

      .table-accordion-nested tr td {
        border-collapse: collapse;
        border: none;
      }

      .table-accordion-nested tr td:first-child {
        width: 85%;
      }

      .panel-heading {
        font-weight: 700;
        cursor: pointer;
      }

      .panel-heading > td:first-child {
        color: var(--bhisma-orange);
      }

      .sublocation-total-qty {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .chevron-round {
        background-color: var(--darken-white);
        width: 24px;
        height: 24px;
        border-radius: 24px;
      }
    `
  ],
  animations: [
    trigger('contentExpansion', [
      state('expanded', style({height: 'max-content', opacity: 1, visibility: 'visible'})),
      state('collapsed', style({height: '0', opacity: 0, visibility: 'hidden'})),
      transition('expanded <=> collapsed', [
        animate('200ms cubic-bezier(.37,1.04,.68,.98)')
      ]),
    ])
  ]
})
export class StockSearchComponent implements OnInit {

  @Input()
  public productHref: string;

  public entity: IStockSearch[];

  constructor(public warehouseService: WarehouseService, public stockRecordService: InventoryStockRecordService) { }

  ngOnInit(): void {
    this.warehouseService.warehouseStockSearchWithDetails(this.productHref).subscribe( res => {
      this.entity = res;
      for (const warehouse of this.entity) {
        for (const location of warehouse.subLocations) {
          // Add empty skuList, later skuList will be fetched everytime user click location row for detail sku list
          location.skuList = [];
          location.displaySku = false;
        }
      }
    });
  }

  fetchSkuList(warehouseHref, locationHref) {
    const warehouseObject = this.entity.find(({href}) => href === warehouseHref);
    const locationObject = warehouseObject.subLocations.find(({href}) => href === locationHref);

    if (!locationObject.displaySku) {
      this.stockRecordService.fetchListStockRecordSearch(
        {
          productHref: this.productHref,
          sublocationHref: locationHref,
          receivingOrderStatus: 'approved',
          latestStockMin: '1',
          groupBy: ['sku']
        }
      ).subscribe(res => {
        if (res.length > 0) {
          locationObject.skuList = res;
        }
      });
      locationObject.displaySku = true;
    } else {
      locationObject.skuList = [];
      locationObject.displaySku = false;
    }
  }
}
