export interface IClient {
  href: string;
  option: string;
  marketplaceName: string;
}

export interface IMarketplaceWarehouse {
  href?: string;
  warehouseId: number;
  name: string;
}

export interface IShopeeCredential {
  partnerId: string;
  partnerKey: string;
  redirectUrl: string;
  shopId: number;
  warehouse: number;
  marketplace: string;
}

export interface IShopeeAuthResponse {
  authenticationUrl: string;
  isConnected: boolean;
  partnerId: string;
  partnerKey: string;
  redirectUrl: string;
  shopId: number;
  warehouseId: number;
  marketplace: string;
  href: string;
  splitVariant: boolean;
}

export interface IShop {
  name: string;
  isConnected: string;
  href: string;
  connectionUrl: number;
  marketplace: string;
  slug: string;
}

export interface IProductClass {
  name: string;
  slug: string;
  isMapped: boolean;
  categoryAttribute: string;
  attribute: string;
  category: string;
}

export interface IProductCategory {
  name: string;
  categoryId: number;
  hasChildren: boolean;
  childUrl: string;
}

export interface IShopAttribute {
  name: string;
  attributeId: number;
  isMandatory: boolean;
  options: string[];
  type: string;
}

export interface IShopAttributeMapping {
  attributeType: string[];
  attributes: IShopAttribute[];
}

export interface ISelectedCategory {
  categoryNames: string[];
  deepestChildId: number;
}

export interface IAttributeForMapping {
  marketplace_attribute_name: string;
  marketplace_attribute_id: number;
  marketplace_attribute_type: string;
  marketplace_attribute_option: string[] | string;
  product_class_attribute_id: number;
  product_class_attribute_type: string;
  new_attribute_name: string;
}

export interface IAttributesMapping {
  category_id: number;
  attributes: IAttributeForMapping[];
}

export interface ILogistic {
  name: string;
  enabled: boolean;
  logisticId: number;
  minWeight: number;
  maxWeight: number;
  hasCod: boolean;
}

export interface IReceivingOrder {
  id: number;
  created: Date;
  approvedBy: string;
  receivedBy: string;
  receivingStatus: string;
  totalProduct: number;
  encryptId: string;
}

export interface IReceivingProduct {
  identifier: number;
  name: string;
  sku: string;
  quantity: number;
  isError: boolean;
  status: string;
  sublocation: string;
}
export interface IShopErrorDetail {
  name: string;
  slug: string;
  marketplace: string;
  status: string;
  errorStatus: string;
}

export interface IReceivingOrderDetail extends IReceivingOrder {
  totalRecord: {
    errorAuthentication: number;
    errorTimeout: number;
    errorMetadata: number;
  };
  warehouse: string;
  products: IReceivingProduct[];
  shops: IShopErrorDetail[];
}

export interface IWarehouseDetail{
  marketplace: string;
  storeStock: number;
  store: string;
}

export interface IWarehouseInformation {
  totalProduct: number;
  totalMarketplace: number;
  totalStore: number;
  details: IWarehouseDetail[];
}

export interface IMarketplaceItemDetailStoreInformation{
  marketplace: string;
  name: string;
}

export interface IMarketplaceItemDetailInformation{
  warehouse: string;
  totalStock: number;
  store:IMarketplaceItemDetailStoreInformation[];
}

export interface IMarketplaceItemInformation {
  totalWarehouse: number;
  totalMarketplace: number;
  totalStore: number;
  details: IMarketplaceItemDetailInformation[];
}

export interface IMarketplaceItemLogisticInformation {
  storeName: string;
  storeMarketplace: string;
  storeSlug:string;
  isConnected: true;
  storeLogistic: string[];
}

export interface IAttributeInformation {
  name: string;
  type: string;
  option:string[];
  value: string;
  identifier:string;
  marketplaceAttributeName: string;
}

export interface IMarketplaceItemAttributeInformation {
  shop: string;
  shopId: number;
  shopSlug:string;
  isConnected: boolean;
  attributes: IAttributeInformation[];
}


export interface ILazadaCredential {
  sellerEmail: string;
  warehouse: number;
  marketplace: string;
}

export interface ILazadaAuthResponse{
  sellerEmail: string;
  warehouseId: number;
}

export interface ITokopediaCredential {
  partnerKey: string;
  partnerId: string;
  fsId: number;
  warehouse: number;
  marketplace: string;
}


export interface ITokopediaAuthResponse {
  authenticationUrl: string;
  isConnected: boolean;
  partnerId: string;
  partnerKey: string;
  redirectUrl: string;
  shopId: number;
  warehouseId: number;
  marketplace: string;
  href: string;
  splitVariant: boolean;
}
