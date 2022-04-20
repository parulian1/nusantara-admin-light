export interface IReceivingOrder {
  id: number;
  created: Date;
  approvedBy: string;
  receivedBy: string;
  receivingStatus: string;
  totalProduct: number;
  encryptId: string;
}

export interface IReceivingProduct {
  identifier: number;
  name: string;
  sku: string;
  quantity: number;
  isError: boolean;
  status: string;
  sublocation: string;
  errorStatus:string;
  errorMessage:string;
  store:string;
}

export interface IReceivingOrderDetail extends IReceivingOrder {
  totalRecord: {
    errorAuthentication: number;
    errorTimeout: number;
    errorMetadata: number;
  };
  warehouse: string;
  products: IReceivingProduct[];
  shops: IShopErrorDetail[];
}

export interface IShopErrorDetail {
  name: string;
  slug: string;
  marketplace: string;
  status: string;
  errorStatus: string;
}
