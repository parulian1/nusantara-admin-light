import { IWarehouse } from '../index';
import { IBaseInventoryOrder, IStockRecord } from './index';


export interface ITransferOrder extends IBaseInventoryOrder {
  destinationWarehouse?: IWarehouse;
  stockRecords: Array<IStockRecord>;
  notes?: string;
}
