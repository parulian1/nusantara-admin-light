import {IHrefEntity} from '../base';

export interface IShopifyMessage extends IHrefEntity  {
  messageType: string;
  message: string;
  adminGraphqlApiId: string;
  created?: string;
  status: string;
  notes?: string;
  ref_id?: number;
}
