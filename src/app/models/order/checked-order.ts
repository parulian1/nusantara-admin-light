import { IOrder } from "@nusantara/models/order/order";

export interface ICheckedOrder {
  index: number;
  isSelected: boolean;
  order: IOrder;
}
