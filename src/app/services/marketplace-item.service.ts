import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { marketplace } from "@nusantara/models";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MarketplaceItemService {
  baseUrl = "/api/marketplace/item";

  constructor(private httpClient: HttpClient) {}

  getItemMarketplaceInformation(productSlug: string): Observable<marketplace.IItemInfo> {
    return this.httpClient.get<any>(
      `${this.baseUrl}/${productSlug}/information/`
    );
  }

  getItemMarketplaceLogisticInformation(
    productSlug: string
  ): Observable<marketplace.IItemLogisticInfo> {
    return this.httpClient.get<any>(
      `${this.baseUrl}/${productSlug}/logistic-information/`
    );
  }

  getItemMarketplaceAttribute(
    marketplace: string,
    productClassSlug: string,
    productSlug: string
  ): Observable<marketplace.IItemAttributeInfo[]> {
    return this.httpClient.get<any>(
      `${this.baseUrl}/${productClassSlug}/${marketplace}/attribute/?product=${productSlug}`
    );
  }

  patchItemAttribute(
    formData: FormData,
    productClassSlug: string
  ): Observable<any> {
    return this.httpClient.patch(
      `${this.baseUrl}/${productClassSlug}/attribute/`,
      formData
    );
  }
  getMarketplaceInfoDetail(id:string, detail:boolean = true): Observable<marketplace.IItemMarketplaceInfo> {
    return this.httpClient.get<any>(
      `${this.baseUrl}/${id}/links/?detail=${detail}`
    );
  }

  putEditProductMarketplace(formData: FormData, id:string, detail:boolean = true): Observable<any> {
    return this.httpClient.put(
      `${this.baseUrl}/${id}/links/?detail=${detail}`, formData
    );
  }
}
