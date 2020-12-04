import { IHrefEntity } from "../base";
import { IShipmentHistory } from "./shipment-history";

export interface IShipment extends IHrefEntity {
  order: string[];
  histories?: IShipmentHistory;
  shippingLabelUrl: string;
  airwayBillNumber: string;
}
