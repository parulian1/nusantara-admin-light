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

@NgModule({
  declarations: [
    LowStockProductListComponent,
    LowStockProductPaginationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ReportRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'never', appearance: 'outline' } },
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } },
  ]
})

export class ReportModule {}
