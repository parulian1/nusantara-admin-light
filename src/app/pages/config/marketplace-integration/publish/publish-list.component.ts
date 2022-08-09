import { Component, OnInit } from '@angular/core';
import { PagedResponse } from '@nusantara/core';
import { marketplace } from '@nusantara/models';
import {
  MarketplaceReceivingOrderService,
  MarketplaceShopService,
} from '@nusantara/services';

@Component({
  selector: 'nus-marketplace-publish',
  template: `
    <h1 class="title-1" i18n>Publish List</h1>
    <div class="empty-list">
      <nus-empty-list
        *ngIf="!shops?.entities?.length && !processing?.entities?.length && !completed?.entities?.length"
        title="Add Store Before Publishing Products"
        description="Add a marketplace store to manage all your products in one place."
        [addUrl]="['/config', 'marketplace-integration', 'connect', 'new']"
        addText="Add Store">
      </nus-empty-list>
    </div>

    <div class="empty-list">
      <nus-empty-list
        *ngIf="shops?.entities?.length && !processing?.entities?.length && !completed?.entities?.length"
        title="No Published Product Yet!"
        description="Go to &quot;Receiving&quot; menu to publish your products."
        [addUrl]="['/inventory', 'receiving']"
        addText="Receiving Inventory">
      </nus-empty-list>
    <div class="empty-list">

    <div *ngIf="processing?.entities?.length || completed?.entities?.length">
      <p></p>
      <nus-tabs>
        <nus-tab [title]="'Processing'">
          <nus-pagination-child
            *ngIf="processing?.entities?.length"
            [page]="processing"
            (fetchPageNumber)="fetchProcessing($event)">
          </nus-pagination-child>
          <table>
            <thead>
              <tr>
                <th i18n>ID</th>
                <th i18n>Status</th>
                <th i18n>Received By</th>
                <th i18n>Approved By</th>
                <th class="numeric" i18n>Total</th>
                <th class="numeric" i18n>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let entity of processing?.entities">
                <td>
                  <a routerLink="{{ entity.encryptId }}">
                    {{ entity.id }}
                  </a>
                </td>
                <td>
                  <span class="badge" [ngClass]="{
                    'success': entity.receivingStatus === 'Published',
                    'alert': entity.receivingStatus === 'Publishing',
                    'warn': entity.receivingStatus === 'In QC',
                    'error': entity.receivingStatus === 'Error' }">
                    {{ entity.receivingStatus }}
                  </span>
                </td>
                <td> {{ entity.receivedBy ? entity.receivedBy : '-' }} </td>
                <td> {{ entity.approvedBy ? entity.approvedBy : '-' }} </td>
                <td class="numeric"> {{ entity.totalProduct }} </td>
                <td class="numeric"> {{ entity.created | date: 'dd/MM/yyyy HH:mm:ss' }} </td>
              </tr>
            </tbody>
          </table>
          <nus-pagination-child
            *ngIf="processing?.entities?.length"
            [page]="processing"
            (fetchPageNumber)="fetchProcessing($event)"
          ></nus-pagination-child>
        </nus-tab>
        <nus-tab [title]="'Completed'">
          <nus-pagination-child
            *ngIf="completed?.entities?.length"
            [page]="completed"
            (fetchPageNumber)="fetchCompleted($event)"
          ></nus-pagination-child>
          <table>
            <thead>
              <tr>
                <th i18n>ID</th>
                <th i18n>Status</th>
                <th i18n>Received By</th>
                <th i18n>Approved By</th>
                <th class="numeric" i18n>Total</th>
                <th class="numeric" i18n>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let entity of completed?.entities">
                <td>
                  <a routerLink="{{ entity.encryptId }}">
                    {{ entity.id }}
                  </a>
                </td>
                <td>
                  <span class="badge" [ngClass]="{
                    'success': entity.receivingStatus === 'Published',
                    'alert': entity.receivingStatus === 'Publishing' ,
                    'warn': entity.receivingStatus === 'In QC',
                    'error': entity.receivingStatus === 'Error' }">
                    {{ entity.receivingStatus }}
                  </span>
                </td>
                <td> {{ entity.receivedBy ? entity.receivedBy : '-' }} </td>
                <td> {{ entity.approvedBy ? entity.approvedBy : '-' }} </td>
                <td class="numeric"> {{ entity.totalProduct }} </td>
                <td class="numeric"> {{ entity.created | date: 'dd/MM/yyyy HH:mm:ss' }} </td>
              </tr>
            </tbody>
          </table>
          <nus-pagination-child
            *ngIf="completed?.entities?.length"
            [page]="completed"
            (fetchPageNumber)="fetchCompleted($event)"
          ></nus-pagination-child>
        </nus-tab>
      </nus-tabs>
    </div>`,
    styles: [
      'table { table-layout: fixed }',
      'td { width: 12.5%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
      ':host ::ng-deep nus-empty-list div { height: 100vh }',
       '.badge.warn { color: var(--lighten-black); background: var(--alert);}'
    ]
})
export class PublishListComponent implements OnInit {
  processing: PagedResponse<marketplace.IReceivingOrder>;
  completed: PagedResponse<marketplace.IReceivingOrder>;
  shops: PagedResponse<marketplace.IShop>;

  constructor(
    private receivingOrderService: MarketplaceReceivingOrderService,
    private shopService: MarketplaceShopService
  ) {}

  ngOnInit() {
    this.fetchProcessing();
    this.fetchCompleted();
    this.fetchShopList();
  }

  fetchProcessing(pageNumber?: number) {
    this.receivingOrderService.fetchList(pageNumber || 1).subscribe((page) => {
      this.processing = page;
    });
  }

  fetchCompleted(pageNumber?: number) {
    this.receivingOrderService
      .fetchList(pageNumber || 1, true)
      .subscribe((page) => {
        this.completed = page;
      });
  }

  fetchShopList() {
    this.shopService.fetchList().subscribe((page) => {
      this.shops = page;
    });
  }
}
