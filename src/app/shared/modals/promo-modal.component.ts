import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';

import { DialogResult, PagedResponse } from '@nusantara/core';
import { INamedHrefEntity } from '@nusantara/models';
import {CustomerGroupService, ProductPromotionSingleService} from '@nusantara/services';

/**
 * Shows the user a list of user they can select from.
 *
 * Note: Currently this does not allow the user to navigate
 * paginated data -- it assumes they're going to be searching
 * mostly based on email.
 */
@Component({
  selector: 'nus-promo-selection-modal',
  template: `
    <ngx-smart-modal [identifier]="'selectCombination'" #modal [formGroup]="form">
      <h2 class="heading-2" i18n>Select Group</h2>
      <form #modalForm>
        <label>
          <span i18n>Search</span>
          <input type="text" [formControl]="searchText" placeholder="ex, cari or 'new promo'">
        </label>
        <input type="hidden" [formControl]="combination">

        <div>
          <table>
            <thead>
            <tr>
              <th i18n>Name</th>
            </tr>
            </thead>
            <tbody>
            <tr *ngFor="let combination of displayedResults?.entities">
              <td><a href="#" (click)="selectCombination(combination)">{{ combination.name }}</a></td>
            </tr>
            </tbody>
          </table>
        </div>
      </form>
    </ngx-smart-modal>
  `,
  styles: [ ]
})
export class PromoModalComponent implements OnInit, AfterViewInit {

  @ViewChild('imageInput') imageInput: ElementRef;
  @ViewChild('modalForm') formView: ElementRef<HTMLFormElement>;
  @ViewChild('modal') modal: NgxSmartModalComponent;

  @Input() selectedCombination: INamedHrefEntity[];

  form: FormGroup;
  result: DialogResult = DialogResult.Cancelled;
  searchTextChanged$: Subscription;

  displayedResults: PagedResponse<INamedHrefEntity> = null;

  timeoutId: any;
  reloadTimeout = 650;
  originalValue: string = null;

  constructor(protected fb: FormBuilder, protected service: ProductPromotionSingleService) { }

  get searchText(): FormControl { return this.form.get('searchText') as FormControl; }
  get combination(): FormControl { return this.form.get('combination') as FormControl; }

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
      combination: ['', [Validators.required, ]],
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
      this.service.fetchList(this.searchText.value, 1, 10).subscribe((page) => {
        this.displayedResults = page;
      });
    }, this.reloadTimeout);

  }

  open() {
    this.modal.open();
  }

  selectCombination(combination: INamedHrefEntity) {
    this.combination.setValue(combination);
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
