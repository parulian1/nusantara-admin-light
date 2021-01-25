import { Component, Input, OnInit } from '@angular/core';
import { WarehouseService } from '@nusantara/services';
import { IStockSearch } from '@nusantara/models/products/stock-search';

@Component({
  selector: 'nus-stock-search',
  template: `
    <h3>Product Inventory</h3>
    <table *ngIf="!!entity">
      <tr>
        <td>Warehouse</td>
        <td>Quantity</td>
      </tr>
      <tr *ngFor="let ent of entity">
        <td>{{ ent.name }}</td>
        <td data-qa="quantity">{{ ent.quantity }}</td>
      </tr>
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
    this.warehouseService.warehouseStockSearch(this.productHref).subscribe( res => {
      this.entity = res;
    });
  }

}
