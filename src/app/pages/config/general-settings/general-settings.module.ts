import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralSettingsRoutingModule } from './general-settings-routing.module';
import { GeneralSettingsComponent } from './general-settings.component';

@NgModule({
  declarations: [
    GeneralSettingsComponent
  ],
  imports: [
    CommonModule,
    GeneralSettingsRoutingModule
  ]
})
export class GeneralSettingsModule {}
