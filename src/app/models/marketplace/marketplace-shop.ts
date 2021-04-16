export interface IShop {
  name: string;
  isConnected: string;
  href: string;
  connectionUrl: number;
  marketplace: string;
  slug: string;
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
