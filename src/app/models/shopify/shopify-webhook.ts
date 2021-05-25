export interface IShopifyWebhook {
  id: number;
  address: string;
  topic: string;
  createdAt: Date;
  updatedAt: Date;
  format: string;
  fields?: any[];
  metafieldNamespaces?: any[];
  apiVersion?: string;
  privateMetafieldNamespaces?: any[];
}
