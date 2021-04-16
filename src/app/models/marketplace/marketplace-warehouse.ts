export interface IMarketplaceWarehouse {
  href?: string;
  warehouseId: number;
  name: string;
}

export interface IWarehouseDetail {
  marketplace: string;
  storeStock: number;
  store: string;
}

export interface IWarehouseInfo {
  totalProduct: number;
  totalMarketplace: number;
  totalStore: number;
  details: IWarehouseDetail[];
}
