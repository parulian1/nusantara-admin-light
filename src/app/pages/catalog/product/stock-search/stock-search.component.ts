import {Component, Input, OnInit} from '@angular/core';
import {WarehouseService} from '@nusantara/services';
import {IStockSearch} from '@nusantara/models/products/stock-search';

@Component({
  selector: 'nus-stock-search',
  template: `
    <p>Available IN</p>
    <table *ngIf="!!entity">
      <tr>
        <td>Warehouse</td>
        <td>Quantity</td>
      </tr>
      <tr *ngFor="let ent of entity">
        <td>{{ent.name}}</td>
        <td>{{ent.quantity}}</td>
      </tr>
    </table>

  `,
  styles: ['']
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
