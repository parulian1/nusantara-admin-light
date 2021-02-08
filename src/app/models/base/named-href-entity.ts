import { IHrefEntity } from './href-entity';

/**
 * Standard convention for links to related resources, returned from our API.
 */
export interface INamedHrefEntity extends IHrefEntity {
  name: string;
}

export interface INamedHrefEntityWarehouse extends IHrefEntity {
  name: string;
  code:string;
}
