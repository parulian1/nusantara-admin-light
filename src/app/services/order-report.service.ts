import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IOrderFilterValue } from "@nusantara/models/order/filter";
import * as moment from 'moment';
import { order } from '@nusantara/models';

const apiDateFormat = "YYYY-MM-DDTHH:mm:ss";
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
        order_filter: this.getAppliedFilters(filters, orderNumbers),
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
        order_filter: this.getAppliedFilters(filters, orderNumbers),
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

  getAppliedFilters(filters: IOrderFilterValue, orderNumbers: Array<string>) {
    let params: any = {};
    if(filters){
      // applied date range limit if not specify custom order numbers
      if (orderNumbers === undefined || orderNumbers?.length == 0) {
        // array empty or does not exist
        if(!!filters.date.start && !!filters.date.start){
          params.start_time = filters.date.start;
          params.end_time = filters.date.end;
        } else {
          // set 14 days date range for select all Date 
          const endDate = moment();
          const startDate = moment().subtract(14, "days");
          params.start_time = startDate.format(apiDateFormat);
          params.end_time = endDate.format(apiDateFormat);
        }
      }


      if (filters.platform) params.store_id = filters.platform;
      if (filters.status) params.order_status_admin = filters.status;
      if (filters.logistic) params.shipping_method = filters.logistic;
      if (filters.q) params.order_number_q = filters.q;
    }
    return params;
  }
}
