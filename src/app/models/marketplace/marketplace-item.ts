export interface IItemDetailStoreInfo {
  marketplace: string;
  name: string;
}

export interface IItemDetailInfo {
  warehouse: string;
  totalStock: number;
  store: IItemDetailStoreInfo[];
}

export interface IItemInfo {
  totalWarehouse: number;
  totalMarketplace: number;
  totalStore: number;
  details: IItemDetailInfo[];
}

export interface IItemLogisticInfo {
  storeName: string;
  storeMarketplace: string;
  storeSlug: string;
  isConnected: true;
  storeLogistic: string[];
}

export interface IAttributeInfo {
  name: string;
  type: string;
  option: string[];
  value: string;
  identifier: string;
  marketplaceAttributeName: string;
}

export interface IItemAttributeInfo {
  shop: string;
  shopSlug: string;
  isConnected: boolean;
  isMapped: boolean;
  attributes: IAttributeInfo[];
}

export interface IItemMarketplaceInfo {
  name: string;
  upc: string;
  stock: number;
  price: number;
  slug:string;
  links: IItemMarketplaceLinks[];
  marketplaces: IItemMarketplaceDetail[];
}

export interface IItemMarketplaceLinks {
  shop: string;
  marketplace: string;
  urlLink: string;
}

export interface IItemMarketplaceDetail {
  warehouse: string;
  sublocation: string;
  sublocationId: number;
  isManagedKgx: boolean;
  originStock:number;
  stocks: IItemStock[];
}

export interface IItemStock {
  isActive:boolean;
  stock: number;
  name: string;
  price: string;
  shop: string;
  shopId:number;
  marketplace:string;
  marketplaceProductId:number;
}
