import { IHrefEntity } from "../base/href-entity";
import { INamedHrefEntity } from "../base";
import { IDeviceData } from "./device-data";


export interface IDevice extends IHrefEntity{
  href: string;
  warehouse: INamedHrefEntity;
  data: IDeviceData;
  isApproved: boolean;
}
