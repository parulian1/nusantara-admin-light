import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { marketplace } from "@nusantara/models";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { PagedResponse } from "@nusantara/core";
import { IShowcase } from "@nusantara/models/marketplace";

@Injectable({
  providedIn: "root",
})
export class MarketplaceShowcaseService {
  baseUrl = "/api/marketplace/shop";

  constructor(private httpClient: HttpClient) {}

  fetchList(shopSlug: string): Observable<marketplace.IShowcase[]> {
    return this.httpClient.get<marketplace.IShowcase[]>(
      `${this.baseUrl}/${shopSlug}/etalase/`
    );
  }

  fetch(shopSlug: string, showcaseId: number): Observable<any> {
    return this.httpClient.get<IShowcase>(
      `${this.baseUrl}/${shopSlug}/etalase-product/${showcaseId}/`,
      { observe: "body", responseType: "json" }
    );
  }

  public fetchParams(shopSlug: string, params: HttpParams): Observable<marketplace.IShowcase[]> {
    return this.httpClient
      .get<IShowcase[]>(`${this.baseUrl}/${shopSlug}/etalase/`, {
        observe: "response",
        responseType: "json",
        params,
      })
      .pipe(map((resp) => resp.body));
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

  addProduct(shopSlug: string, showcaseId: number, upc: number) {
    return this.httpClient.post(`${this.baseUrl}/${shopSlug}/etalase-product/`, {
      item_id: [upc],
      etalase_id: showcaseId,
    });
  }

  removeProduct(
    shopSlug: string,
    showcaseId: number,
    upc: number
  ): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      body: {
        item_id: [upc],
        etalase_id: showcaseId,
      },
    };
    return this.httpClient.delete(
      `${this.baseUrl}/${shopSlug}/etalase-product/`,
      httpOptions
    );
  }
}
