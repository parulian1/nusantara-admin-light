import {AbstractListComponent, PagedResponse} from "@nusantara/core";
import {ActivatedRoute} from "@angular/router";
import {TransactionHistoryReportService} from "@nusantara/services";
import {ITransactionHistory} from "@nusantara/models/transaction-history";
import {Component} from "@angular/core";
import {IOrderFilterValue} from "@nusantara/models/order/filter";

@Component({
  selector: 'nus-transaction-history-report',
  template: `
    <h1 class="title-1" i18n>Report Transaction</h1>
    <nus-transaction-history-report-filter
      (filterApplied)="onFilterApplied($event)">
    </nus-transaction-history-report-filter>
    <nus-pagination [page]="page"></nus-pagination>
    <table>
      <thead>
        <tr>
          <th>Order Number</th>
          <th>Order Date</th>
          <th>Source</th>
          <th>Total Transaction</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td>{{entity.orderNumber}}</td>
          <td>{{entity.created | date: 'dd/MM/yyyy HH:mm:ss'}}</td>
          <td>{{entity.source}}</td>
          <td>{{entity.totalTransaction | currency: "IDR"}}</td>
        </tr>
      </tbody>
    </table>
    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: [
    'thead tr th:first-child, tbody tr td:first-child { min-width: 200px; }',
    '.checklist { display: flex; align-items: center; }',
    '.checklist mat-checkbox { margin-right: 10px; margin-bottom: 12px; }',
    // '::ng-deep .date-range-footer { padding: 10px 25px; }',
    '.nowrap { white-space: nowrap; }'
  ]
})

export class TransactionListComponent extends AbstractListComponent<ITransactionHistory> {
  constructor(public route: ActivatedRoute,
              protected service: TransactionHistoryReportService) {super(route);}
  appliedFilter: IOrderFilterValue;

  ngOnInit(): void {
    this.route.data.subscribe((
      data: { page: PagedResponse<ITransactionHistory> }) => {
      this.page = data.page;
    });
    super.ngOnInit();
  }

  onFilterApplied(event: IOrderFilterValue){
    this.appliedFilter = event;
  }
}
