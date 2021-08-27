import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AddNewShowcaseModalComponent, DeleteShowcaseModalComponent } from "./modals";
import { DialogResult, ToastLevelEnum, ToastService } from "@nusantara/core";
import { marketplace } from '@nusantara/models';
import { MarketplaceClientEnum } from "../../connect/markeplace-client-enum";
import { Store } from '@ngrx/store';
import * as fromReducer from '@nusantara/reducers';
import { SvgIconService } from '@nusantara/services';
import { MarketplaceShowcaseService } from '@nusantara/services/marketplace-showcase.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

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
          <th class="centered" *ngIf="(currentShop$ | async)?.marketplace !== marketplaceClient.tokopedia">Display On/Off</th>
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
            <td *ngIf='!entity.isDefault'><a [routerLink]="entity.etalaseId">{{ entity.name }}</a></td>
            <td *ngIf='entity.isDefault'>{{ entity.name }}</td>
            <td *ngIf='!entity.isDefault'>Admin</td>
            <td *ngIf='entity.isDefault'>System</td>
            <td class="centered" *ngIf='entity.marketplace !== marketplaceClient.tokopedia;'>
              <div> 
                <mat-slide-toggle
                  [checked]="entity.isConnected">
                </mat-slide-toggle>
              </div>
            </td>
            <td class="centered">
              <button *ngIf="!entity.isDefault; else deleteDisabled"
                class="remove"
                (click)="deleteShowcaseModal.open(entity.etalaseId)">
                <mat-icon class="icon" svgIcon="trash"></mat-icon>
              </button>
              <ng-template #deleteDisabled>
                <button class="remove" disabled>
                  <mat-icon class="icon" svgIcon="trash-disabled"></mat-icon>
                </button>
              </ng-template>
            </td>
          </tr>
        </ng-template>
      </tbody>
    </table>

    <!-- Modals -->
    <nus-delete-showcase-modal></nus-delete-showcase-modal>

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
  subscription: Subscription;

  data = null;
  marketplaceClient = MarketplaceClientEnum;

  @ViewChild(DeleteShowcaseModalComponent)
  deleteShowcaseModal: DeleteShowcaseModalComponent;
  @ViewChild(AddNewShowcaseModalComponent)
  addShowcaseModal: AddNewShowcaseModalComponent;

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromReducer.State>,
    private service: MarketplaceShowcaseService,
    private toast: ToastService,
    svgIconService: SvgIconService, 
    ) {
      this.currentShop$ = this.store.select(fromReducer.getCurrentShop);
      svgIconService.registerIcons();
  }

  ngOnInit() {
    this.shopSlug = this.route.snapshot.paramMap.get("shop-slug");

    this.route.data.subscribe((data: { showcases: marketplace.IShowcase[] }) => {
      this.data = data.showcases;
    });

    this.subscription = this.currentShop$.subscribe((shop: marketplace.IShop) => {});
  }

  ngAfterViewInit() {
    this.deleteShowcaseModal.onClose.subscribe(() =>
      this.ondeleteShowcaseModalClosed()
    );

    this.addShowcaseModal.onClose.subscribe(() =>
      this.onAddShowcaseModalClosed()
    );
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  ondeleteShowcaseModalClosed() {
    if (this.deleteShowcaseModal.result === DialogResult.OK) {
      const ToastMessage = "Showcase successfully deleted";
      const etalaseId = this.deleteShowcaseModal.etalaseId;

      this.service.delete(this.shopSlug, etalaseId).subscribe(
        (resp: HttpResponse<any>) => {
          this.refetch();
          this.toast?.addMessage(ToastMessage,'Deleted', ToastLevelEnum.info);
        },
        (errorResp: HttpErrorResponse) => {
          this.toast?.addMessage(errorResp.error.message,'Error',ToastLevelEnum.error);
        }
      );
    }
  }

  onAddShowcaseModalClosed() {
    if (this.addShowcaseModal.result === DialogResult.OK) {
      const name = this.addShowcaseModal.name;
      this.service.create(this.shopSlug, name).subscribe(
        (resp) => {
          this.addShowcaseModal.name = null;
          this.refetch();
          this.toast?.addMessage(`${name} was saved successfully.`,'Saved',ToastLevelEnum.success);
        },
        (errorResp) => {
          this.toast?.addMessage(errorResp.error.details[0].message,'Error',ToastLevelEnum.error);
        }
      );
    }
  }

  refetch(): void {
    this.service
      .fetchList(this.shopSlug)
      .subscribe((showcases: marketplace.IShowcase[]) => {
        this.data = showcases;
      });
  }
}
