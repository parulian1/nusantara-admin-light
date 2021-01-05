import { INamedHrefEntity, ISiteConfigExtra } from "@nusantara/models";

export interface ISiteConfig extends INamedHrefEntity {
  logo?: string;
  gaAccountId?: string;
  favicon?: string;
  tagLine?: string;
  extraConfig: ISiteConfigExtra;
}
