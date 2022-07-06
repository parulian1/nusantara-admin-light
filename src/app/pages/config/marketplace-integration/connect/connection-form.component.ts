import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketplaceClientService } from '@nusantara/services';
import { marketplace } from '@nusantara/models';
import { Observable } from 'rxjs';
import { MarketplaceClientEnum } from './markeplace-client-enum';

@Component({
  selector: 'nus-marketplace-integration',
  template: `
    <h1 class="title-1" i18n>Add Store</h1>
    <div class="wrapper">
      <h1 class="heading-1" i18n>Connect to Marketplace</h1>
      <p i18n>Connect to manage products in marketplace.</p>

      <form class="fluid">
        <label>
          <span i18n>Marketplace</span>
          <select
            [disabled]="editMode"
            [(ngModel)]="selectedClient"
            name="client"
          >
            <option *ngFor="let opt of marketplaces" value="{{ opt.option }}">
              {{ opt.marketplaceName }}
            </option>
          </select>
        </label>
      </form>

      <div [ngSwitch]="selectedClient">
        <nus-shopee-client-form
          *ngSwitchCase="marketplaceClient.shopee"
          [shopSlug]="shopSlug"
          [isEdit]="editMode"
        ></nus-shopee-client-form>
        <nus-tokopedia-form
          *ngSwitchCase="marketplaceClient.tokopedia"
          [shopSlug]="shopSlug"
          [isEdit]="editMode"
        ></nus-tokopedia-form>
        <nus-tsc-client-form
          *ngSwitchCase="marketplaceClient.tsc"
          [shopSlug]="shopSlug"
          [isEdit]="editMode"
        ></nus-tsc-client-form>
        <nus-lazada-client-form
          *ngSwitchCase="marketplaceClient.lazada"
          [shopSlug]="shopSlug"
          [isEdit]="editMode"
        ></nus-lazada-client-form>
        <nus-bukalapak-client-form
          *ngSwitchCase="marketplaceClient.bukalapak"
          [shopSlug]="shopSlug"
          [isEdit]="editMode"
        ></nus-bukalapak-client-form>
        <nus-tiktok-client-form
          *ngSwitchCase="marketplaceClient.tiktok"
          [shopSlug]="shopSlug"
          [isEdit]="editMode"
        ></nus-tiktok-client-form>
        <nus-blibli-client-form
          *ngSwitchCase="marketplaceClient.blibli"
          [shopSlug]="shopSlug"
          [isEdit]="editMode"
        ></nus-blibli-client-form>
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
export class ConnectionFormComponent implements OnInit {
  marketplaces: marketplace.IClient[];
  selectedClient: string;
  slug$: Observable<string>;
  selectedMarketplace: string;
  shopSlug: string = null;
  editMode = false;
  marketplaceClient = MarketplaceClientEnum;

  constructor(
    private service: MarketplaceClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.service.client.subscribe((data: marketplace.IClient[]) => {
      this.marketplaces = data;
    });

    this.shopSlug = this.route.snapshot.paramMap.get('shop-slug');
    if (this.shopSlug) {
      this.service.getConnection(this.shopSlug).subscribe(
        (data: marketplace.IShopeeAuthResponse) => {
          this.selectedMarketplace = data.marketplace;
          if (this.selectedMarketplace) {
            this.selectedClient = this.selectedMarketplace;
            this.editMode = true;
          }
        },
        () => {
          this.router.navigate(['../'], { relativeTo: this.route });
        }
      );
    }
  }
}
