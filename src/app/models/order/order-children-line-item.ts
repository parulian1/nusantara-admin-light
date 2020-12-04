import { INamedHrefEntity } from "../base";

export interface IOrderChildrenLineItem {
  notes: string;
  price: string;
  product: {
    href: string;
    image: string;
    name: string;
    upc: string;
  };
  quantity: number;
  variant: string;
  vendor: INamedHrefEntity;
  weight: string;
}
