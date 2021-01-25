import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketplaceClientService } from '@nusantara/services';
import { IClient, IShopeeAuthResponse } from '@nusantara/models';
import { Observable } from 'rxjs';
import { MarketplaceClientEnum } from '../markeplace-client-enum';

@Component({
  selector: 'nus-marketplace-integration',
  template: `
    <h1 class="heading-1">Add Store</h1>
    <div class="mp-connect-container">
      <h1 class="mpSubTitle">Connect to Marketplace</h1>
      <p>Connect to manage products in marketplace.</p>

      <form>
        <label>
          <span>Marketplace</span>
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
        ></nus-tokopedia-form>
        <nus-tsc-client-form
          *ngSwitchCase="marketplaceClient.tsc"
          [shopSlug]="shopSlug"
          [isEdit]="editMode"
        ></nus-tsc-client-form>
      </div>
    </div>
  `,
  styles: [
    `
      h1{
        font-weight: bold;
      }

      .mpSubTitle{
        color: #365DC3;
      }

      .mp-connect-container{
        border-radius: 5px;
        background-color: white;
        padding: 20px;
        border: 1px solid #E7E7E7;
        width: 566px;
      }
      select{
        background-color: white !important;
        max-width: none !important;
        width: 100%;
        height: 40px;
        border-radius: 4px;
      }
    `
  ],
})
export class ConnectionFormComponent implements OnInit {
  marketplaces: IClient[];
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
    this.service.client.subscribe((data: IClient[]) => {
      this.marketplaces = data;
    });

    this.shopSlug = this.route.snapshot.paramMap.get('shop-slug');
    if (this.shopSlug) {
      this.service.getConnection(this.shopSlug).subscribe(
        (data: IShopeeAuthResponse) => {
          this.selectedMarketplace = data.marketplace;
          if (this.selectedMarketplace) {
            this.selectedClient = this.selectedMarketplace;
            this.editMode = true;
          }
        },
        () => {
          this.router.navigate(['../../'], { relativeTo: this.route });
        }
      );
    }
  }
}
