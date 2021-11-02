import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { IPartner } from "@nusantara/models/integrations/partner";
import {
  ErrorResult,
  IResultResponse,
  PagedResponse,
  SuccessCreatedResult,
  SuccessResult,
} from "@nusantara/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class PartnerService {
  private httpClient: HttpClient;
  private baseUrl = "/api/fulfillment/integration-partners";

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  // retrieves a single object from the API based on it's slug
  fetch(slug?: string): Observable<IPartner> {
    let url = `${this.baseUrl}/`;
    if (!!slug) {
      url += `${slug}/`;
    }
    return this.httpClient.get<IPartner>(`${url}`, {
      observe: "body",
      responseType: "json",
    });
  }

  fetchList(
    query?: string,
    page: number = 1,
    perPage?: number
  ): Observable<PagedResponse<IPartner>> {
    // create query params --> ?q=maybe&page=1
    let params = new HttpParams().set("page", page.toFixed(0).toString());

    if (perPage) {
      params = params.set("per_page", perPage.toFixed(0).toString());
    }

    if (query) {
      params = params.set("q", query);
    }

    return this.httpClient
      .get<IPartner[]>(`${this.baseUrl}/`, {
        observe: "response",
        responseType: "json",
        params,
      })
      .pipe(map((resp) => new PagedResponse(resp)));
  }

  create(
    entity: IPartner | FormData,
    headers?: any
  ): Observable<IResultResponse> {
    return this.httpClient
      .post<IPartner>(`${this.baseUrl}/`, entity, {
        observe: "response",
        responseType: "json",
        headers,
      })
      .pipe(
        map((resp) => {
          if (resp.status === 201) {
            return new SuccessCreatedResult<IPartner>(
              resp.headers.get("Location"),
              [],
              resp.body
            );
          }
          return new ErrorResult(resp.body, resp.status);
        })
      );
  }

  update(
    entity: IPartner | FormData,
    slug: string,
    headers?: any
  ): Observable<IResultResponse> {
    delete entity["slug"];

    return this.httpClient
      .put<IPartner>(`${this.baseUrl}/${slug}/`, entity, {
        observe: "response",
        responseType: "json",
        headers,
      })
      .pipe(
        map((resp) => {
          if (resp.status === 200) {
            return new SuccessResult([], resp.body);
          }
          return new ErrorResult(resp.body, resp.status);
        })
      );
  }

  save(
    entity: IPartner | FormData,
    headers?: Headers
  ): Observable<IResultResponse> {
    let slug = entity["slug"];
    delete entity["slug"];

    if (!!slug) {
      return this.update(entity, slug, headers);
    } else {
      return this.create(entity, headers);
    }
  }

  private getSlug(entity: IPartner | FormData) {
    if (entity instanceof FormData) {
      return entity.get("slug") as string;
    }
    return entity.slug;
  }

  public fetchParams(params: HttpParams) {
    let page = params.get("page");
    let perPage = params.get("per_page");
    if (!page) {
      page = "1";
    }

    if (!perPage) {
      perPage = "20";
    }

    params = params.set("page", page);
    params = params.set("per_page", perPage);

    return this.httpClient
      .get<IPartner[]>(`${this.baseUrl}/`, {
        observe: "response",
        responseType: "json",
        params,
      })
      .pipe(map((resp) => new PagedResponse(resp)));
  }
}
