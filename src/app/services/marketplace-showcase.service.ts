import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { marketplace } from "@nusantara/models";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ErrorResult, IResultResponse, SuccessResult } from "@nusantara/core";

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

  create(shopSlug: string, name: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/${shopSlug}/etalase/`, {
      name: name,
    });
  }

  delete(shopSlug: string, etalaseId: number): Observable<any> {
    return this.httpClient.delete(
      `${this.baseUrl}/${shopSlug}/etalase/${etalaseId}/`,
      { observe: "response", responseType: "json" }
    );
  }
}
