import { Component, OnInit } from '@angular/core';
import {AbstractListComponent} from '@nusantara/core';
import {IShopifyMessage} from '@nusantara/models';
import {ActivatedRoute} from '@angular/router';
import {ShopifyMessageService} from '@nusantara/services';
import {getSlugFromHref} from '@nusantara/shared/helpers';

@Component({
  selector: 'nus-shopify-message-list',
  template: `
    <nus-list-header i18n-title
      title="Shopify Order Message"
      description="A list of receive shopify webhook message." [canAddNew]="false">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <th i18n>ID</th>
        <th i18n>Created</th>
        <th class="centered" i18n>Type</th>
        <th class="centered" i18n>Status</th>
        <th class="centered" i18n>Action</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td>{{ entity.adminGraphqlApiId}}</td>
        <td>{{ entity.created}}</td>
        <td class="centered">{{entity.messageType}}</td>
        <td class="centered">{{entity.status}}</td>
        <td class="centered"><a (click)="processMessage(entity.href)" class="button" *ngIf="entity.status!=='processed'" i18n>Process</a> </td>
      </tr>
      </tbody>
    </table>
  `,
  styles: [
  ]
})
export class ShopifyMessageListComponent extends AbstractListComponent<IShopifyMessage> {

  constructor(route: ActivatedRoute,
              protected service: ShopifyMessageService) { super(route); }

  processMessage(href) {
    const messageId = getSlugFromHref(href);
    this.service.process_message(Number(messageId)).subscribe(res => {
      console.log(res);
    });
  }

}
