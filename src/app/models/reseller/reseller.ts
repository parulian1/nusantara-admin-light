import {IHrefEntity, INamedHrefEntity} from "../base";
import { IResellerType } from "./reseller-type";

export interface IReseller extends IHrefEntity {
  type?: IResellerType;
  resellerGroups?: INamedHrefEntity[];
}
