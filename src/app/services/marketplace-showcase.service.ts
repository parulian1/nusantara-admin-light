import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { marketplace } from "@nusantara/models";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { PagedResponse } from "@nusantara/core";
import { IShowcase, IShowcaseDetail, IshowcaseProduct } from "@nusantara/models/marketplace";

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

  fetchDetail(shopSlug: string, showcaseId: number): Observable<any> {
    return this.httpClient.get<IShowcaseDetail>(
      `${this.baseUrl}/${shopSlug}/etalase/${showcaseId}/`,
    );
  }

  fetch(shopSlug: string, showcaseId: number, query?: string, page: number = 1, perPage?: number): Observable<PagedResponse<marketplace.IshowcaseProduct>> {
    let params = new HttpParams().set('page', page.toFixed(0).toString());

    if (perPage) {
      params = params.set('per_page', perPage.toFixed(0).toString());
    }

    if (query) {
      params = params.set('q', query);
    }

    return this.httpClient
      .get<marketplace.IshowcaseProduct[]>(`${this.baseUrl}/${shopSlug}/etalase-product/`,
      { observe: "response", responseType: "json", params })
      .pipe(map(resp => new PagedResponse(resp)));
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

  update(shopSlug: string, showcaseId: number, name: string): Observable<any>{
    console.log(name, showcaseId);
    return this.httpClient.put(`${this.baseUrl}/${shopSlug}/etalase/${showcaseId}/`, {
      name: name, id: showcaseId
    });
  }

  delete(shopSlug: string, etalaseId: number): Observable<any> {
    return this.httpClient.delete(
      `${this.baseUrl}/${shopSlug}/etalase/${etalaseId}/`,
      { observe: "response", responseType: "json" }
    );
  }

  addProduct(shopSlug: string, showcaseId: number, marketplaceProductId: number) {
    return this.httpClient.post(`${this.baseUrl}/${shopSlug}/etalase-product/`, {
      item_id: [marketplaceProductId],
      etalase_id: showcaseId,
    });
  }

  getProductListShowcase(shopSlug: string, showcaseId: number): Observable<any> {
    return this.httpClient.get<IshowcaseProduct>(
      `${this.baseUrl}/${shopSlug}/etalase-product/${showcaseId}/`,
    );
  }

  removeProduct(
    shopSlug: string,
    showcaseId: number,
    marketplaceProductId: number
  ): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      body: {
        item_id: [marketplaceProductId],
        etalase_id: showcaseId,
      },
    };
    return this.httpClient.delete(
      `${this.baseUrl}/${shopSlug}/etalase-product/`,
      httpOptions
    );
  }
}
