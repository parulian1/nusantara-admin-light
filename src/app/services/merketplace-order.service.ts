import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MarketplaceOrderService {
  baseUrl = "/api/order/order-marketplace";

  constructor(private httpClient: HttpClient) {}


  fetchDetail(orderNumber: string): Observable<any> {
    return this.httpClient.get<any>(
      `${this.baseUrl}/${orderNumber}/`,
    );
  }
}
