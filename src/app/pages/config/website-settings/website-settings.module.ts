import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {WebsiteSettingsComponent} from './website-settings.component';
import {WebsiteSettingsRoutingModule} from './website-settings-routing.module';
import {SharedModule} from "@nusantara/shared";

@NgModule({
  declarations: [
    WebsiteSettingsComponent
  ],
    imports: [
        CommonModule,
        WebsiteSettingsRoutingModule,
        SharedModule
    ]
})
export class WebsiteSettingsModule {}
