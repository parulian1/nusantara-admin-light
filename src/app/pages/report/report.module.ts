import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@nusantara/shared";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ReportRoutingModule } from "@nusantara/pages/report/report-routing.module";
import {
  LowStockProductListComponent,
  LowStockProductPaginationComponent
} from "@nusantara/pages/report/low-stock-products";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MAT_RIPPLE_GLOBAL_OPTIONS} from "@angular/material/core";
import {TransactionListComponent} from "@nusantara/pages/report/transaction-history/transaction-list.component";
import {TransactionHistoryFilterComponent} from "@nusantara/pages/report/transaction-history";
import {FulfillmentModule} from "@nusantara/pages/fulfillment";

@NgModule({
  declarations: [
    LowStockProductListComponent,
    LowStockProductPaginationComponent,
    TransactionListComponent,
    TransactionHistoryFilterComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ReportRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    FulfillmentModule,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'never', appearance: 'outline' } },
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } },
  ]
})

export class ReportModule {}
