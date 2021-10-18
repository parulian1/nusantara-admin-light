import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ExternalIntegrationComponent} from '@nusantara/pages/config/external-integration/external-integration.component';
import {KgxWmsComponent} from '@nusantara/pages/config/external-integration/kgx-wms/kgx-wms.component';
import {KgxWmsResolver} from '@nusantara/resolvers/integrations/kgx-wms.resolver';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalIntegrationRoutingModule { }
