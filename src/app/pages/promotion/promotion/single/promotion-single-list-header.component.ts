import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {
  PromotionSingleTypeSelectionModalComponent
} from './promotion-single-type-selection-modal.component';

@Component({
  selector: 'nus-promotion-single-list-header',
  template: `
    <header>
      <h1 class="title-1" *ngIf="!!showTitle">{{ title }}</h1>
      <div>
        <div class="search control">
          <i class="material-icons">search</i>
          <input type="search" placeholder="Search" [formControl]="queryText">
        </div>
        <button type="button" (click)="selectPromoType()" class="control" i18n>
          <i class="material-icons">add</i> Add
        </button>
      </div>
    </header>
    <nus-promotion-single-type-selection-modal></nus-promotion-single-type-selection-modal>
  `,
  styles: [
    'header { margin-bottom: 23px; }',
    'header > div { display: flex; }',
    'input[type=search] { font-size: 15px; padding-right: 5px; width: 325px; }',
    'button { display: flex; justify-content: center; align-items: center; margin-left: auto; }',
    'button > i { line-height: 31px; font-size: 20px; }',
    'p { margin-bottom: 5px; }',
    `
      .search {
        display: flex;
        border: solid 1px var(--grey);
        background-color: transparent;
        align-items: center
      }
      .search > i {
        background-color: white;
        color: var(--nav-background);
        line-height: 31px;
        padding-left: 13px;
      }
      .search > input[type=search] {
        border: none !important;
      }
    `,
  ]
})
export class PromotionSingleListHeaderComponent implements OnInit {
  @Input() title: string;
  @Input() showTitle = true;
  @ViewChild(PromotionSingleTypeSelectionModalComponent) promoTypeSelectionModal: PromotionSingleTypeSelectionModalComponent;

  timeoutId: any;
  reloadTimeout = 650;
  originalValue: string = null;
  queryText = new FormControl('');

  constructor(public route: ActivatedRoute,
              public router: Router) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(
      (value) => {
        this.queryText.setValue(value.get('q'));
        this.originalValue = value.get('q');
        this.queryText.valueChanges.subscribe(
          (newValue) => { this.onQueryTextChanged(newValue); }
        );
      }
    );
  }

  onQueryTextChanged(newValue: string) {

    if (!!this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // don't run if the value hasn't actually changed from the original.
    if (newValue === this.originalValue) {
      return;
    }

    // always go back to page 1 when a new filter is applied
    if (!newValue) {
      // if the search input was cleared -> navigate immediately
      this.router.navigate(['.'], {relativeTo: this.route});
    } else {
      this.timeoutId = setTimeout(() => {
        // wait to see if the user is still typing more before navigating
        const params = {q: this.queryText.value, page: 1};
        this.router.navigate(
          ['.'],
          {
            queryParams: params,
            queryParamsHandling: 'merge',
            relativeTo: this.route
          }
        );
      }, this.reloadTimeout);
    }
  }

  selectPromoType() {
    this.promoTypeSelectionModal.open();
  }

}
