import { IEntityHref } from '@nusantara/core';

import { ICityPostalInfo } from './city-postal-info';

/**
 * Structure of the address.component's internal form data.
 */
export interface InternalAddressValue {
  street: string;
  province: IEntityHref;
  city: IEntityHref;
  postal: ICityPostalInfo;
}
