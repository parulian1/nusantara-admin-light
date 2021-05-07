import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { marketplace } from "@nusantara/models";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MarketplaceEtalaseService {
  baseUrl = "/api/marketplace/shop";

  constructor(private httpClient: HttpClient) {}

  fetchList(shopSlug: string): Observable<marketplace.IEtalase[]> {
    return this.httpClient.get<marketplace.IEtalase[]>(
      `${this.baseUrl}/${shopSlug}/etalase/`
    );
  }
}
