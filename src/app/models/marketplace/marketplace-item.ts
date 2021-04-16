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
