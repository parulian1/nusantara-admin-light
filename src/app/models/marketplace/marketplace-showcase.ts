export interface IShowcase {
  name: string;
  etalaseId: number;
  isActive: boolean;
  isDefault: boolean;
}

export interface IShowcaseDetail {
  name: string;
  total: number;
  disable: boolean;
}

export interface IshowcaseProduct{
  name: string;
  upc: string;
  marketplaceProductId: number;
}