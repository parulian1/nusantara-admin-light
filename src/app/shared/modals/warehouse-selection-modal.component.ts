import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DialogResult, PagedResponse} from "@nusantara/core";
import {Subscription} from "rxjs";
import {IWarehouse} from "@nusantara/models";
import {WarehouseService} from "@nusantara/services";
import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from "@angular/core";
import {NgxSmartModalComponent} from "ngx-smart-modal";

@Component({
  selector: 'nus-promo-campaign-selection-modal',
  template: `
    <ngx-smart-modal [identifier]="'selectWarehouse'" #modal [formGroup]="form">
      <h2 class="heading-2" i18n>Select Group</h2>
      <form #modalForm>
        <label>
          <span i18n>Search</span>
          <input type="text" [formControl]="searchText" placeholder="ex, cari or 'new promo group'">
        </label>
        <input type="hidden" [formControl]="warehouse">

        <div>
          <table>
            <thead>
            <tr>
              <th i18n>Warehouse</th>
              <th i18n>Action</th>
            </tr>
            </thead>
            <tbody>
            <tr *ngFor="let warehouse of displayedResults?.entities">
              <td>
                {{ warehouse.name }}
              </td>
              <td class="centered">
                <a href="#" (click)="selectWarehouse(warehouse)" i18n>select</a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </form>
    </ngx-smart-modal>
  `,

})
export class WarehouseSelectionModalComponent implements OnInit{
  @ViewChild('modalForm') formView: ElementRef<HTMLFormElement>;
  @ViewChild('modal') modal: NgxSmartModalComponent;

  form: FormGroup;
  result: DialogResult = DialogResult.Cancelled;
  searchTextChanged$: Subscription;

  displayedResults: PagedResponse<IWarehouse> = null;

  timeoutId: any;
  reloadTimeout = 650;
  originalValue: string = null;

  constructor(protected fb: FormBuilder, protected service: WarehouseService) {}

  get searchText(): FormControl { return this.form.get('searchText') as FormControl; }
  get warehouse(): FormControl { return this.form.get('warehouse') as FormControl; }

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
      warehouse: ['', [Validators.required, ]],
    });
  }

  getValue(): FormData {
    if (this.result !== DialogResult.OK) {
      return null;
    }
    return new FormData(this.formView.nativeElement);
  }

  /*
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

  selectWarehouse(warehouse: IWarehouse) {
    this.warehouse.setValue(warehouse);
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
