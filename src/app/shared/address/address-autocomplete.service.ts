import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IEntityHref } from '@nusantara/core';
import { ICityPostalInfo } from './city-postal-info';

/**
 * Gets data to be used for the auto-completion options
 * (provinces > cities > postals) in the address forms.
 */
@Injectable({
  providedIn: 'root'
})
export class AddressAutocompleteService {

  constructor(protected httpClient: HttpClient) { }

  /**
   * Returns a list of all provinces for a given country code.
   *
   * @param countryCode The country code to fetch provinces for.
   */
  fetchProvinces(countryCode = 'id'): Observable<IEntityHref[]> {
    return this.httpClient.get<IEntityHref[]>(
      `/api/fulfillment/address/${countryCode}/`,
      { observe: 'body', responseType: 'json' }
    );
  }

  /**
   * Gets a list of cities within a province.
   *
   * @param provinceUrl One of the hrefs fetched from the results of fetchProvinces
   */
  fetchCities(provinceUrl: string): Observable<IEntityHref[]> {
    return this.httpClient.get<IEntityHref[]>(provinceUrl, { observe: 'body', responseType: 'json' });
  }

  /**
   * Fetches all of the districts, sub-districts, and postal codes within a city.
   *
   * @param cityUrl One of the hrefs from the results of fetchCities.
   */
  fetchPostalData(cityUrl: string): Observable<ICityPostalInfo[]> {
    return this.httpClient.get<ICityPostalInfo[]>(cityUrl, { observe: 'body', responseType: 'json' });
  }

}
