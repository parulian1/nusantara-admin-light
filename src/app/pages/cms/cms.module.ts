import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@nusantara/shared';
import { CmsRoutingModule } from './cms-routing.module';
import { FlatPageComponent, FlatPageListComponent } from './flat-page';

@NgModule({
  declarations: [
    FlatPageListComponent,
    FlatPageComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CmsRoutingModule,
  ],
})
export class CmsModule { }
