import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ExternalIntegrationComponent} from '@nusantara/pages/config/external-integration/external-integration.component';
import {KgxWmsComponent} from '@nusantara/pages/config/external-integration/kgx-wms/kgx-wms.component';
import {KgxWmsResolver} from '@nusantara/resolvers/integrations/kgx-wms.resolver';
import {WarehouseMappingListComponent} from '@nusantara/pages/config/external-integration/warehouse-mapping/warehouse-mapping-list.component';
import {WarehouseMappingListResolver} from '@nusantara/resolvers/integrations/warehouse-mapping-list-resolver.service';
import {WarehouseMappingComponent} from '@nusantara/pages/config/external-integration/warehouse-mapping/warehouse-mapping.component';
import {WarehouseMappingTypeResolver} from '@nusantara/resolvers/integrations/warehouse-mapping-type.resolver';
import {WarehouseMappingResolver} from '@nusantara/resolvers/integrations/warehouse-mapping.resolver';

const routes: Routes = [
  {
    path: '',
    component: ExternalIntegrationComponent,
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'kgx-wms',
    component: KgxWmsComponent,
    runGuardsAndResolvers: 'always',
    resolve: {
      entity: KgxWmsResolver,
    },
    data: { animation: 'Detail', },
  },
  {
    path: 'warehouse-mapping',
    children: [
      {
        path: '',
        component: WarehouseMappingListComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
          page: WarehouseMappingListResolver,
        }
      },
      {
        path: 'new',
        component: WarehouseMappingComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
          types: WarehouseMappingTypeResolver,
        }
      },
      {
        path: ':slug',
        component: WarehouseMappingComponent,
        resolve: {
            entity: WarehouseMappingResolver,
          types: WarehouseMappingTypeResolver,
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalIntegrationRoutingModule { }
