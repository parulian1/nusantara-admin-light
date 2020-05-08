import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigHubComponent } from './config-hub.component';

const routes: Routes = [
  { path: '', component: ConfigHubComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
