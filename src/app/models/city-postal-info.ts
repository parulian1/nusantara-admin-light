/**
 * Combined information about all the postal codes within a city.
 * This is used for the automatically returned results from the
 * address auto-completion service.
 */
export interface ICityPostalInfo {
  district: string;
  subDistrict: string;
  postalCode: string;
}
