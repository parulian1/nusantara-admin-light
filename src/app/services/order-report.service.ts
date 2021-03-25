import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IOrderFilterValue } from "@nusantara/models/order/filter";

@Injectable({
  providedIn: "root",
})
export class OrderReportService {
  protected baseUrl = "/api/order/order-report";
  readonly options = { responseType: 'text' as 'json' };

  constructor(private httpClient: HttpClient) {}

  public downloadOrderList(filters: IOrderFilterValue, orderNumbers: Array<string>) {
    return this.httpClient.post(
      `${this.baseUrl}/order-download/`,
      {
        order_filter: this.getAppliedFilters(filters),
        order_number: orderNumbers,
        report_type: "list",
      },
      this.options
    );
  }


  public downloadProductList(filters: IOrderFilterValue, orderNumbers: Array<string>) {
    return this.httpClient.post(
      `${this.baseUrl}/order-product/`,
      {
        order_filter: this.getAppliedFilters(filters),
        order_number: orderNumbers,
        report_type: "list",
      },
      this.options
    );
  }

  public downloadProductDetail(orderNumbers: string) {
    return this.httpClient.post(
      `${this.baseUrl}/order-product/`,
      {
        order_filter: {},
        order_number: [orderNumbers],
        report_type: "detail",
      },
      this.options
    );
  }

  getAppliedFilters(filters: IOrderFilterValue) {
    let params: any = {};
    if(filters){
      if (filters.startDate) params.start_time = filters.startDate;
      if (filters.endDate) params.end_time = filters.endDate;
      if (filters.platform) params.store_id = filters.platform;
      if (filters.status) params.order_status_admin = filters.status;
      if (filters.logistic) params.shipping_method = filters.logistic;
      if (filters.q) params.order_number_q = filters.q;
    }
    return params;
  }
}
