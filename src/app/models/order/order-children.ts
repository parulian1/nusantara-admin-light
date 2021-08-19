import { IWarehouse } from "../warehouse";
import { IOrderChildrenData } from "./order-children-data";

export interface IOrderChildren {
  data: IOrderChildrenData[];
  warehouse: IWarehouse;
  marketplaceRedirectHref?: string;
}
