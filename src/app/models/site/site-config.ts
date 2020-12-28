import { INamedHrefEntity } from "@nusantara/models";

export interface ISiteConfig extends INamedHrefEntity {
  logo?: string;
  gaAccountId?: string;
  favicon?: string;
}
