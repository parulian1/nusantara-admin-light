import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PosIntegrationComponent } from './pos-integration.component';

const routes: Routes = [
  {
    path: '',
    component: PosIntegrationComponent,
    runGuardsAndResolvers: 'always',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PosIntegrationRoutingModule {}
