import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { ConfirmModalComponent } from "@nusantara/shared/confirm-modal.component";
import { AddNewShowcaseModalComponent } from "./modals";
import { DialogResult } from "@nusantara/core";
import { marketplace } from '@nusantara/models';
import { Store } from '@ngrx/store';
import * as fromReducer from '@nusantara/reducers';
import { SvgIconService } from '@nusantara/services';
import { MarketplaceEtalaseService } from '@nusantara/services/marketplace-showcase.service';

@Component({
  selector: "nus-showcase",
  template: `
    <h1 class="title-1">Showcase Configuration</h1>
    <div class="wrapper">
      <div>
        <p class="body-2">Store</p>
        <p class="subheading-2">
          <strong>{{ (currentShop$ | async)?.name }}</strong>
        </p>
      </div>
      <div>
        <p class="body-2">Marketplace</p>
        <p class="subheading-2">
          <strong>{{ (currentShop$ | async)?.marketplace | titlecase }}</strong>
        </p>
      </div>
      <div>
        <p class="body-2">Status</p>
        <p class="subheading-2" [ngClass]="{ connected: (currentShop$ | async)?.isConnected === true }">          
          {{
            (currentShop$ | async)?.isConnected === true
              ? "Connected"
              : "Not Connected"
          }}
        </p>
      </div>
    </div>
    <nus-showcase-list-header
      [canAddNew]="!!data"
      (add)="addShowcaseModal.open()">
    </nus-showcase-list-header>
    <table>
      <thead>
        <tr>
          <th>Showcase Display Name</th>
          <th>Author</th>
          <th class="centered">Display On/Off</th>
          <th class="centered">Remove</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngIf="!data; else elseBlock">
          <td colspan="4">
            <nus-empty-list
              [title]="'Add Showcase'"
              [description]="'Add showcase to manage all your products in one place.'"
              [addUrl]=""
              [addText]="'Add Showcase'"
              (add)="addShowcaseModal.open()">
            </nus-empty-list>
          </td>
        </tr>
        <ng-template #elseBlock>
          <tr *ngFor="let entity of data">
            <td><a [routerLink]="">{{ entity.name }}</a></td>
            <td>{{ entity.author }}</td>
            <td class="centered">
              <div>
                <mat-slide-toggle
                  [checked]="entity.isActive">
                </mat-slide-toggle>
              </div>
            </td>
            <td class="centered">
              <button class="remove" (click)="confirmDeleteModal.open()">
                <mat-icon class="icon" svgIcon="trash"></mat-icon>
              </button>
            </td>
          </tr>
        </ng-template>
      </tbody>
    </table>

    <!-- Modals -->
    <nus-confirm-modal
      [title]="confirmDeleteTitle"
      [content]="confirmDeleteText">
    </nus-confirm-modal>

    <!-- Modals -->
    <nus-add-showcase-modal></nus-add-showcase-modal>
  `,
  styles: [
    `
      .wrapper {
        padding: 20px 24px;
        margin-bottom: 20px;
        border: solid 1px var(--grey);
        border-radius: 4px;

        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        grid-row-gap: 20px;

      }
    `,
    '.wrapper > div { flex: 1; min-width: 0; }',
    '.wrapper p { color: var(--darken-grey); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    '.icon { height: 20px; }',
    '.remove { background: none; border: none; }',
    '::ng-deep label { min-height: 40px}',
    ':host ::ng-deep nus-empty-list div { padding: 32px 0; }'
  ],
})
export class ShowcaseListComponent implements OnInit, AfterViewInit, OnDestroy {
  shopSlug: string;
  currentShop$: Observable<marketplace.IShop>;
  isBusy: boolean;
  data = null;

  subscription: Subscription;

  @ViewChild(ConfirmModalComponent)
  confirmDeleteModal: ConfirmModalComponent;

  @ViewChild(AddNewShowcaseModalComponent)
  addShowcaseModal: ConfirmModalComponent;

  confirmDeleteTitle = "Delete Showcase?";
  confirmDeleteText =
    "Deleting this showcase will not delete the product. Deleted showcase can't be recovered.";

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromReducer.State>,
    private service: MarketplaceEtalaseService,
    svgIconService: SvgIconService, 
    ) {
      this.currentShop$ = this.store.select(fromReducer.getCurrentShop);
      svgIconService.registerIcons();
  }

  ngOnInit() {
    this.shopSlug = this.route.snapshot.paramMap.get("shop-slug");

    this.route.data.subscribe((data: { showcases: marketplace.IEtalase[] }) => {
      this.data = data.showcases;
    });

    this.subscription = this.currentShop$.subscribe((shop: marketplace.IShop) => {});
  }

  ngAfterViewInit() {
    this.confirmDeleteModal.onClose.subscribe(() =>
      this.onConfirmModalClosed()
    );
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  onConfirmModalClosed() {
    if (this.confirmDeleteModal.result === DialogResult.OK) {
      console.log("delete");
    }
  }
}
