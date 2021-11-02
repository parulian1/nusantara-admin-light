import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { PagedResponse } from "@nusantara/core";
import { IPartner } from "@nusantara/models/integrations/partner";
import { PartnerService } from "@nusantara/services/integrations/partner.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PartnerListResolver {
  protected readonly service: PartnerService;

  protected constructor(service: PartnerService) {
    this.service = service;
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<PagedResponse<IPartner>> | Observable<never> {
    let params = new HttpParams();
    const theQuery = route.queryParams;
    for (const keyParam of Object.keys(theQuery)) {
      if (
        [
          "q",
          "page",
          "per_page",
          "include_deleted",
          "include_inactive",
        ].indexOf(keyParam) >= 0
      ) {
        if ("page" === keyParam || keyParam === "per_page") {
          // need to validate number
          if (Number.isInteger(theQuery[keyParam])) {
            // TODO: probably need to throw error
            continue;
          }
        }
        params = params.set(keyParam, theQuery[keyParam]);
      }
    }

    return this.service.fetchParams(params);
  }
}
