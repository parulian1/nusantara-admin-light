import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebsiteSettingsComponent } from './website-settings.component';

const routes: Routes = [
  {
    path: '',
    component: WebsiteSettingsComponent,
    runGuardsAndResolvers: 'always',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebsiteSettingsRoutingModule {}
