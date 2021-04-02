import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PosIntegrationComponent } from './pos-integration.component';
import {RequireIsEnterpriseGuard} from '@nusantara/auth';
import {DeviceComponent, DeviceListComponent, DeviceListResolver, DeviceResolver} from '@nusantara/pages/config/device';

const routes: Routes = [
  {
    path: '',
    component: PosIntegrationComponent,
    runGuardsAndResolvers: 'always',
  },

  {
    path: 'devices',
    canActivate: [RequireIsEnterpriseGuard],
    children: [
      {
        path: '',
        component: DeviceListComponent,
        resolve: { page: DeviceListResolver },
        runGuardsAndResolvers: 'always'
      },
      {
        path: ':slug',
        component: DeviceComponent,
        resolve: { entity: DeviceResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PosIntegrationRoutingModule {}
