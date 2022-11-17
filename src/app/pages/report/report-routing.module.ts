import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {RequirePermissionGuard} from "@nusantara/auth/guards/require-permission.guard";
import {LowStockProductListComponent} from "@nusantara/pages/report/low-stock-products";
import {LowStockConfigResolver} from "@nusantara/pages/config/low-stock-config";
import * as wh from "@nusantara/pages/config/warehouse";
import {TransactionListComponent} from "@nusantara/pages/report/transaction-history/transaction-list.component";
import {TransactionHistoryResolver} from "@nusantara/resolvers/transaction-history.resolver";
import {OrderFilterResolver} from "@nusantara/resolvers";

const routes: Routes = [
  {
    path: 'low-stock-products',
    canActivateChild: [RequirePermissionGuard],
    children: [
      {
        path: '',
        component: LowStockProductListComponent,
        resolve: {
          lowStockConfig: LowStockConfigResolver,
          subLocationTypes: wh.SubLocationTypeResolver,
          allWarehouses: wh.WarehouseFullListResolver,
        },
        runGuardsAndResolvers: 'always',
      },
    ]
  },
  {
    path: 'transaction',
    canActivateChild: [RequirePermissionGuard],
    children: [
      {
        path: '',
        component: TransactionListComponent,
        resolve: {
          page: TransactionHistoryResolver,
          orderFilter: OrderFilterResolver,
        },
        runGuardsAndResolvers: 'always',
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {}
