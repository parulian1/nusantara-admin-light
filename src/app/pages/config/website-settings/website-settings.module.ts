import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {WebsiteSettingsComponent} from './website-settings.component';
import {WebsiteSettingsRoutingModule} from './website-settings-routing.module';

@NgModule({
  declarations: [
    WebsiteSettingsComponent
  ],
  imports: [
    CommonModule,
    WebsiteSettingsRoutingModule
  ]
})
export class WebsiteSettingsModule {}
