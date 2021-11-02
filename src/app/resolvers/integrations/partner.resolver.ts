import { Injectable } from "@angular/core";

import { IPartner } from "@nusantara/models/integrations/partner";
import { PartnerService } from "@nusantara/services/integrations/partner.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PartnerResolver {
  protected readonly service: PartnerService;

  protected constructor(service: PartnerService) {
    this.service = service;
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IPartner> | Observable<never> {
    const slug = route.paramMap.get("slug");
    return this.service.fetch(slug);
  }
}
