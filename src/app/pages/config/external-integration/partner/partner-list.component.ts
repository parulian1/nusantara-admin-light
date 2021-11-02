import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { AbstractListComponent } from "@nusantara/core";
import { IPartner } from "@nusantara/models/integrations/partner";
import { SiteConfigService } from "@nusantara/services";

@Component({
  selector: "nus-partner-list",
  template: `
    <nus-list-header i18n-title title="External Integration" description="">
    </nus-list-header>

    <div>
      <nus-include-deleted></nus-include-deleted>
    </div>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
        <tr>
          <th i18n>Name</th>
          <th i18n>Partner</th>
          <th i18n>Client ID</th>
          <th i18n>Company ID</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td>
            <a [routerLink]="entity.slug">{{ entity.name }}</a>
          </td>
          <td>{{ entity.partner }}</td>
          <td>{{ entity.clientId }}</td>
          <td>{{ entity.companyId }}</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [],
})
export class PartnerListComponent extends AbstractListComponent<IPartner> {
  constructor(route: ActivatedRoute, public configService: SiteConfigService) {
    super(route);
  }
}
