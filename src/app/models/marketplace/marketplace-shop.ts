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
  attributeCode:string;
  isMandatory: boolean;
  options: string[];
  type: string;
  isVariant:boolean;
  isSpecialAttribute:boolean;
}

export interface IShopAttributeMapping {
  attributeType: string[];
  attributes: IShopAttribute[];
}
