import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';

import { SharedModule } from '@nusantara/shared';
import { ThemeListComponent } from './theme-list.component';
import { ThemeRoutingModule } from './theme-routing.module';
import { ThemeDetailComponent } from './theme-detail.component';

import * as media from './media';

@NgModule({
  declarations: [
    ThemeListComponent,
    ThemeDetailComponent,

    media.NewThemeImageComponent,
    media.ThemeMediaComponent,
    media.ThemeMediaHostComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxSmartModalModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    ThemeRoutingModule,
  ],
})
export class ThemeModule { }
