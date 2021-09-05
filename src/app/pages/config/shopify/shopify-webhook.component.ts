import {Component, OnInit} from '@angular/core';
import {AbstractListComponent, PagedResponse} from '@nusantara/core';
import {IShopifyWebhook} from '@nusantara/models/shopify/shopify-webhook';
import {ActivatedRoute} from '@angular/router';
import {ShopifyWebhookService} from '@nusantara/services/shopify/shopify-webhook.service';
import {IShopifyCarrier} from '@nusantara/models/shopify/shopify-carrier';

@Component({
  selector: 'nus-shopify-webhook',
  template: `
    <nus-list-header i18n-title
      title="Shopify Webhook registration list"
      description="A list of receive shopify webhook message." [canAddNew]="false" [canSearch]="false">
    </nus-list-header>

    <table>
      <thead>
      <tr>
        <th i18n>ID</th>
        <th i18n>Topic</th>
        <th i18n>Webhook URL</th>
        <th class="centered" i18n>Format</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of entities">
        <td>{{ entity.id}}</td>
        <td>{{ entity.topic}}</td>
        <td>{{entity.address}}</td>
        <td class="centered">{{entity.format}}</td>
      </tr>
      </tbody>
    </table>

    <div>&nbsp;</div>

    <table>
      <thead>
      <tr>
        <th i18n>ID</th>
        <th i18n>Type</th>
        <th i18n>Name</th>
        <th i18n>Callback URL</th>
        <th class="centered" i18n>Format</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of carrierEntities">
        <td>{{ entity.id}}</td>
        <td>{{ entity.carrierServiceType}}</td>
        <td>{{ entity.name}}</td>
        <td>{{ entity.callbackUrl }}</td>
        <td class="centered">{{entity.format}}</td>
      </tr>
      </tbody>
    </table>

<!--    <a (click)="registerWebhook()" class="control" ><i class="material-icons">add</i> Register Order Webhook</a>-->
  `,
  styles: []
})
export class ShopifyWebhookComponent implements OnInit{
  entities: IShopifyWebhook[];
  carrierEntities: IShopifyCarrier[];

  public constructor(protected route: ActivatedRoute,
                     protected service: ShopifyWebhookService) {  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { page: IShopifyWebhook[], carrier: IShopifyCarrier[] }) => {
      this.entities = data.page;
      this.carrierEntities = data.carrier;
    });
  }

  registerWebhook(): void {
    this.service.registerHook().subscribe((res) => {
      console.log('regsiter');
    });
  }

}
