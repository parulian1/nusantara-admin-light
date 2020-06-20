export interface IShippingRate {
  href: string;
  leadTime: string;
  originPostalCode: string;
  destinationPostalCode: string;
  rate: number;
  minWeight: number;
  maxWeight: number;
  service: string;  // href
}
