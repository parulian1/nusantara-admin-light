import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';

import { DialogResult, PagedResponse } from '@nusantara/core';
import { IPromoGroup } from '@nusantara/models';
import { PromotionCampaignService } from '@nusantara/services';

/**
 * Shows the user a list of user they can select from.
 *
 * Note: Currently this does not allow the user to navigate
 * paginated data -- it assumes they're going to be searching
 * mostly based on email.
 */
@Component({
  selector: 'nus-promo-campaign-selection-modal',
  template: `
    <ngx-smart-modal [identifier]="'selectCombination'" #modal [formGroup]="form">
      <h2 class="heading-2" i18n>Select Promo Campaign</h2>
      <form #modalForm>
        <label class="header">
          <input type="text" [formControl]="searchText" placeholder="Search Promo Campaign">
        </label>
        <input type="hidden" [formControl]="promotionGroup">
        <span i18n>Search promo campaign name to find more</span>

        <div class="search-content">
          <table>
            <thead>
            <tr>
              <th  i18n>Promo Campaign Name</th>
              <th class="centered" i18n>Action</th>
            </tr>
            </thead>
            <tbody>
            <tr *ngFor="let promoGroup of displayedResults?.entities">
              <td class="break-word">
                {{ promoGroup.name }}
              </td>
              <td class="centered">
                <a href="#" (click)="selectCampaign(promoGroup)" i18n>Select</a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </form>
    </ngx-smart-modal>
  `,
  styles: [
    `
      .heading-2 {
        padding-bottom: 16px;
      }
      .header {
        min-height: 0px;
        padding-bottom: 10px;
      }
      .search-content {
        margin-top: 16px;
      }
    `
  ]

})
export class PromoCampaignModalComponent implements OnInit, AfterViewInit {

  @ViewChild('imageInput') imageInput: ElementRef;
  @ViewChild('modalForm') formView: ElementRef<HTMLFormElement>;
  @ViewChild('modal') modal: NgxSmartModalComponent;

  form: FormGroup;
  result: DialogResult = DialogResult.Cancelled;
  searchTextChanged$: Subscription;

  displayedResults: PagedResponse<IPromoGroup> = null;

  timeoutId: any;
  reloadTimeout = 650;
  originalValue: string = null;

  constructor(protected fb: FormBuilder, protected service: PromotionCampaignService) { }

  get searchText(): FormControl { return this.form.get('searchText') as FormControl; }
  get promotionGroup(): FormControl { return this.form.get('promotionGroup') as FormControl; }

  ngOnInit() {
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    this.modal.onOpen.subscribe(() => {
      this.initializeForm();
      this.result = DialogResult.Cancelled;

      this.searchTextChanged$ = this.searchText.valueChanges.subscribe(
        (value) => { this.onSearchTextChanged(value); }
      );
    });

    // ensure that we unsubscribe from valueChanges when this form
    // is closed (prevent memory leaks, as it will be reinitialized later)
    this.modal.onClose.subscribe(() => {
      if (this.searchTextChanged$) {
        this.searchTextChanged$.unsubscribe();
      }
    });

    this.onSearchTextChanged('');
  }

  /**
   * Sets the modals form to a new empty set of data.
   */
  private initializeForm(): void {
    this.form = this.fb.group({
      searchText: ['', [ ]],
      promotionGroup: ['', [Validators.required, ]],
    });
  }


  getValue(): FormData {
    if (this.result !== DialogResult.OK) {
      return null;
    }
    return new FormData(this.formView.nativeElement);
  }

  /**
   * Whenever the user changes the search text, reload
   * the currently-displayed products (after a slight delay
   * to ensure they're not still typing; 650ms)
   *
   * @param newValue The new value the user has typed.
   */
  onSearchTextChanged(newValue: string) {
    if (!!this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // don't run if the value hasn't actually changed from the original.
    if (newValue === this.originalValue) {
      return;
    }

    // wait to see if the user is still typing, before we reload
    this.timeoutId = setTimeout(() => {
      this.service.fetchListWithInactive(this.searchText.value, 1, 10).subscribe((page) => {
        this.displayedResults = page;
      });
    }, this.reloadTimeout);

  }

  open() {
    this.modal.open();
  }

  selectCampaign(campaign: IPromoGroup) {
    this.promotionGroup.setValue(campaign);
    this.close();
    return false;
  }

  get onClose(): EventEmitter<any> {
    return this.modal.onClose;
  }

  close() {
    this.result = DialogResult.OK;
    this.modal.close();
  }

  cancel() {
    this.modal.close();
  }
}
