import {INamedHrefEntity} from "@nusantara/models/base";

export interface IVendor extends INamedHrefEntity {
  description: string;
  productCount?: number;
  internalNotes: string;
  iconImage: string;
  bannerImage: string;
}
