import { INamedHrefEntity } from './base';


export interface IHighlight extends INamedHrefEntity {
  description: string;
  sortPriority: string;
  isShowHomepage: boolean;
  isActive: boolean;
  deleted: string;
  productHighlights?: any;
  forVendor?: INamedHrefEntity;
  banner: string;
  background: string;
}

