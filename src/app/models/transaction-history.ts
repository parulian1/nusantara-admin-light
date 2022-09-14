import {IHrefEntity} from "@nusantara/models/base";

export interface ITransactionHistory extends IHrefEntity {
  orderNumber: string;
  created: string;
  source: string;
  totalTransaction: number;
}
