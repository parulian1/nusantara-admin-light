import { INamedHrefEntity, IVendorExtra } from "@nusantara/models";

export interface IVendor extends INamedHrefEntity {
  description: string;
  productCount?: number;
  internalNotes: string;
  iconImage: string;
  bannerImage: string;
  extra?: IVendorExtra;
}
