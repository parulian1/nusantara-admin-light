import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { SharedModule } from '@nusantara/shared';
import { CmsRoutingModule } from './cms-routing.module';
import { FlatPageComponent, FlatPageListComponent } from './flat-page';
import { WidgetBlockComponent, WidgetBlockListComponent, BannerComponent, WidgetSummaryRowComponent } from './widget';
import { TestimonialComponent, TestimonialListComponent } from './testimonial';

@NgModule({
  declarations: [
    FlatPageListComponent,
    FlatPageComponent,

    TestimonialComponent,
    TestimonialListComponent,

    WidgetBlockListComponent,
    WidgetBlockComponent,
    WidgetSummaryRowComponent,

    BannerComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    CmsRoutingModule,
  ],
})
export class CmsModule { }
