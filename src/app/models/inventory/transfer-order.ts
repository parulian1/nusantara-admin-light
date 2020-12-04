import { IWarehouse } from "../index";
import { IBaseInventoryOrder } from "./index";


export interface ITransferOrder extends IBaseInventoryOrder {
  destinationWarehouse?: IWarehouse;
}
