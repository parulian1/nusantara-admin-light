import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IPartner } from "@nusantara/models/integrations/partner";
import { PartnerService } from "@nusantara/services/integrations/partner.service";
import { ThemeListResolver } from '@nusantara/resolvers';
import { AbstractDetailComponent, ToastService } from '@nusantara/core';

@Component({
  selector: 'nus-partner',
  template: `
    <nus-page-title i18n-title title="Add Partner"></nus-page-title>
    <div class="wrapper">

      <form class="fluid">
        <label>
          <span i18n>Partner</span>
          <select
            [disabled]="editMode"
            [(ngModel)]="selectedPartner"
            name="client"
          >
            <option disabled selected [ngValue]="null"> --Select-- </option>
            <option *ngFor="let opt of partners" value="{{ opt.value }}">
              {{ opt.partner }}
            </option>
          </select>
        </label>
      </form>
      <div [ngSwitch]="selectedPartner">
        <nus-wms-external-form
          *ngSwitchCase="'wms'"
          [shopSlug]="shopSlug"
          [isEdit]="editMode"
        ></nus-wms-external-form>
        <nus-forstok-external-form
          *ngSwitchCase="'forstok'"
          [shopSlug]="shopSlug"
          [isEdit]="editMode"
        ></nus-forstok-external-form>
      </div>
    </div>
  `,
  styles: [
    `.wrapper { padding: 16px 24px; border: solid 1px var(--grey); border-radius: 4px; width: 60vw; }`,
    'p { color: var(--darken-grey); }',
    'form { margin-top: 16px; }',
    'label { margin-bottom: 16px; padding: 0; }'
  ],
})
export class PartnerComponent implements OnInit {
  initializeForm(entity?: IPartner) {
    throw new Error('Method not implemented.');
  }
  // marketplaces: marketplace.IClient[];
  selectedPartner: string;
  slug$: Observable<string>;
  selectedExternal: string;
  shopSlug: string = null;
  editMode = false;
  entity: IPartner;
  // marketplaceClient = MarketplaceClientEnum;

  partners = [
    {value: 'wms', partner: 'WMS'},
    {value: 'forstok', partner: 'Forstok'},
  ];

  constructor(
    public service: PartnerService,
    public route: ActivatedRoute,
    public router: Router,
  ) {}

  ngOnInit() {

    this.shopSlug = this.route.snapshot.paramMap.get("slug");
    if (this.shopSlug) {
      this.service.fetch(this.shopSlug).subscribe(
        (data: IPartner) => {
          this.selectedExternal = data.partner;
          if (this.selectedExternal) {
            this.selectedPartner = this.selectedExternal;
            this.editMode = true;
          }
        }
      )
    }
  }
}
