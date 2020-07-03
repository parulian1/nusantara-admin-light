import { INamedHrefEntity } from '@nusantara/models/base';

import { ICityPostalInfo } from './city-postal-info';

/**
 * Structure of the address.component's internal form data.
 */
export interface InternalAddressValue {
  street: string;
  province: INamedHrefEntity;
  city: INamedHrefEntity;
  postal: ICityPostalInfo;
}
