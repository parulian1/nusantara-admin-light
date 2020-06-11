import { Component } from '@angular/core';

@Component({
  selector: 'nus-warehouse-list',
  template: `
    <nus-list-header
      title="Warehouses"
      description="A warehouse is any location where inventory is held;  This can involved retail locations.">
    </nus-list-header>

    <table>
      <thead></thead>
      <tbody></tbody>
    </table>
  `,
  styles: [],
})
export class WarehouseListComponent {
  // public warehouse: Array<Warehouse> = [];
  // public warehouseData: Array<IWarehouse> = [];
  // public displayedColumns: string[] = ['name', 'street', 'city', 'type'];
  //
  // @ViewChild(MatSort, {static: true}) sort: MatSort;
  // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  //
  // dataSource: any;
  //
  // constructor(private warehouseService: WarehouseService) { }
  //
  // ngOnInit() { this.getDefaultWarehouse(); }
  //
  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }
  //
  // getDefaultWarehouse() {
  //   this.warehouse = [];
  //   this.warehouseService.getWarehouse().subscribe(res => {
  //     this.warehouse = res.body;
  //     this.showData(this.warehouse);
  //   });
  // }
  //
  // getDeletedWarehouse() {
  //   this.warehouse = [];
  //   this.warehouseService.getDeletedWarehouse().subscribe(res => {
  //     this.warehouse = res.body;
  //     this.showData(this.warehouse);
  //   });
  // }
  //
  // getDeleted(event: any) {
  //   if (event.checked === true) {
  //     this.getDeletedWarehouse();
  //   } else {
  //     this.getDefaultWarehouse();
  //   }
  // }
  //
  // showData(warehouse: Array<Warehouse>) {
  //   this.warehouseData = [];
  //   for (const item of warehouse) {
  //     const data = {
  //       name: item.name,
  //       street: item.address.street,
  //       city: item.address.city,
  //       slug: item.url.match(/([^\/]*)\/*$/)[1],
  //       type: item.type,
  //       isActive: item.isActive
  //     };
  //
  //     this.warehouseData.push(data);
  //   }
  //
  //   this.dataSource = new MatTableDataSource(this.warehouseData);
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.paginator = this.paginator;
  // }
}
