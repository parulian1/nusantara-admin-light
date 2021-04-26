/**
 * A postal (street) address.
 */
export interface ICompanyAddress {
  street: string;
  province: string;
  city: string;
  district: string;
  subDistrict: string;
  postalCode: string;
  country: string;

  latitude: number;
  longitude: number;

  notes: string;
}
