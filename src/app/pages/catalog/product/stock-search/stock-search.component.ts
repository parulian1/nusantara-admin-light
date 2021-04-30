import { Component, Input, OnInit } from '@angular/core';
import { WarehouseService } from '@nusantara/services';
import { IStockSearch } from '@nusantara/models/products/stock-search';

@Component({
  selector: 'nus-stock-search',
  template: `
    <h3>Product Inventory</h3>
    <table *ngIf="!!entity">
      <thead>
        <tr>
          <th>Warehouse</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
      <ng-container *ngFor="let ent of entity">
        <tr *ngFor="let sublocation of ent.subLocations">
          <td>
            {{ ent.name }} ({{ sublocation.name }})
          </td>
          <td data-qa="quantity">{{ sublocation.quantity }}</td>
        </tr>
      </ng-container>
      </tbody>
    </table>

  `,
  styles: [
    'h3 { font-size: 20px; margin: 0 0 20px 0; }',
  ]
})
export class StockSearchComponent implements OnInit {

  @Input()
  public productHref: string;

  public entity: IStockSearch[];

  constructor(public warehouseService: WarehouseService) { }

  ngOnInit(): void {
    this.warehouseService.warehouseStockSearchWithDetails(this.productHref).subscribe( res => {
      this.entity = res;
    });
  }

}
