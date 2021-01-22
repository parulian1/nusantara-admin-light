import { Component, OnInit } from '@angular/core';
import { PagedResponse } from '@nusantara/core';
import { IReceivingOrder, IShop } from '@nusantara/models';
import {
  MarketplaceReceivingOrderService,
  MarketplaceShopService,
} from '@nusantara/services';

@Component({
  selector: 'nus-marketplace-publish',
  template: `<h1>Publish List</h1>
    <nus-empty-list
      *ngIf="
        !shops?.entities?.length &&
        !processing?.entities?.length &&
        !completed?.entities?.length
      "
      [title]="'Add Store Before Publishing Products'"
      [description]="
        'Add a marketplace store to manage all your products in one place.'
      "
      [cancelUrl]="['/config', 'marketplace-integration']"
      [addUrl]="[
        'config',
        'marketplace-integration',
        'setup',
        'connect',
        'new'
      ]"
      [addText]="'Add Store'"
    >
    </nus-empty-list>
    <nus-empty-list
      *ngIf="
        shops?.entities?.length &&
        !processing?.entities?.length &&
        !completed?.entities?.length
      "
      [title]="'No Published Product Yet!'"
      [description]="
        'Go to &quot;Receiving&quot; menu to publish your products.'
      "
      [cancelUrl]="['/config', 'marketplace-integration']"
      [addUrl]="['/inventory', 'receiving']"
      [addText]="'Receiving Inventory'"
    >
    </nus-empty-list>

    <div *ngIf="processing?.entities?.length || completed?.entities?.length">
      <p></p>
      <nus-tabs>
        <nus-tab [title]="'Processing'">
          <nus-pagination-child
            *ngIf="processing?.entities?.length"
            [page]="processing"
            (fetchPageNumber)="fetchProcessing($event)"
          ></nus-pagination-child>
          <div *ngFor="let entity of processing.entities" class="wrapper">
            <div>
              <p>ID</p>
              <p class="item-value">
                {{ entity.id }}
              </p>
            </div>
            <div>
              <p>Date</p>
              <p class="item-value">
                {{ entity.created | date: 'dd MMM yyyy' }}
              </p>
            </div>
            <div>
              <p>Total Product</p>
              <p class="item-value">
                {{ entity.totalProduct }}
              </p>
            </div>
            <div>
              <p>Received By</p>
              <p class="item-value">
                {{ entity.receivedBy ? entity.receivedBy : '-' }}
              </p>
            </div>
            <div>
              <p>Approved By</p>
              <p class="item-value">
                {{ entity.approvedBy ? entity.approvedBy : '-' }}
              </p>
            </div>
            <div>
              <p>Status</p>
              <p
                class="item-value"
                [ngClass]="entity.isError ? 'error' : 'publishing'"
              >
                {{ entity.receivingStatus }}
              </p>
            </div>
            <div>
              <button routerLink="{{ entity.encryptId }}" class="control">
                Detail
              </button>
            </div>
          </div>
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
          <div *ngFor="let entity of completed.entities" class="wrapper">
            <div>
              <p>ID</p>
              <p class="item-value">
                {{ entity.id }}
              </p>
            </div>
            <div>
              <p>Date</p>
              <p class="item-value">
                {{ entity.created | date: 'dd MMM yyyy' }}
              </p>
            </div>
            <div>
              <p>Total Product</p>
              <p class="item-value">
                {{ entity.totalProduct }}
              </p>
            </div>
            <div>
              <p>Received By</p>
              <p class="item-value">
                {{ entity.receivedBy ? entity.receivedBy : '-' }}
              </p>
            </div>
            <div>
              <p>Approved By</p>
              <p class="item-value">
                {{ entity.approvedBy ? entity.approvedBy : '-' }}
              </p>
            </div>
            <div>
              <p>Status</p>
              <p
                class="item-value"
                [ngClass]="entity.isError ? 'error' : 'publishing'"
              >
                {{ entity.receivingStatus }}
              </p>
            </div>
            <div>
              <button routerLink="{{ entity.encryptId }}" class="control">
                Detail
              </button>
            </div>
          </div>
          <nus-pagination-child
            *ngIf="completed?.entities?.length"
            [page]="completed"
            (fetchPageNumber)="fetchCompleted($event)"
          ></nus-pagination-child>
        </nus-tab>
      </nus-tabs>
    </div>`,
  styles: [
    `
      .wrapper {
        padding: 12px 24px;
        border: solid 1px #e7e7e7;
        border-radius: 5px;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }

      .wrapper:not(:first-of-type) {
        margin-top: 15px;
      }

      .wrapper > * {
        flex: 1;
        min-width: 0;
        margin: 10px;
      }

      p {
        margin: 8px auto;
      }

      .item-value {
        color: #5a5a5a;
        font-weight: 700;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .error {
        color: #c83228;
      }

      .publishing {
        color: #f0be00;
      }

      .published {
        color: #21a656;
      }
    `,
  ],
})
export class PublishListComponent implements OnInit {
  processing: PagedResponse<IReceivingOrder>;
  completed: PagedResponse<IReceivingOrder>;
  shops: PagedResponse<IShop>;

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
