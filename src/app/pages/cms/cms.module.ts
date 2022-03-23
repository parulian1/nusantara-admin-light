import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxSmartModalModule } from 'ngx-smart-modal';

import { SharedModule } from '@nusantara/shared';
import { CmsRoutingModule } from './cms-routing.module';
import { FlatPageComponent, FlatPageListComponent } from './flat-page';
import { ContentFooterListComponent, ContentFooterComponent, ContentFooterChildrenComponent } from './content-footer';
import {
  WidgetBlockComponent,
  WidgetBlockListComponent,
  BannerGroupComponent,
  WidgetSummaryRowComponent
} from './widget';
import { TestimonialComponent, TestimonialListComponent } from './testimonial';
import { BannerListComponent, BannerComponent } from './banner';
import { HighlightComponent, HighlightListComponent } from './highlight';
import { SlaListComponent, SlaComponent } from './sla';
import { VideoIntegrationListComponent, VideoIntegrationComponent } from './video-integration';
import { NavigationComponent } from './navigation/detail/navigation.component';
import { NavigationListComponent } from './navigation/navigation-list/navigation-list.component';
import { NavigationChildrenComponent } from './navigation/navigation-children/navigation-children.component';
import {
  OnboardingComponent,
  OnboardingListComponent,
  OnboardingContentComponent,
  OnboardingContentHostComponent,
  OnboardingContentImageComponent,
  OnboardingPreviewHostDialogComponent
} from './onboarding';
import { DragDropModule } from '@angular/cdk/drag-drop';

import * as companyStory from './company-story';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { CatalogueListComponent } from './catalogue/catalogue-list.component';


@NgModule({
    declarations: [
        FlatPageListComponent,
        FlatPageComponent,

        TestimonialComponent,
        TestimonialListComponent,

        WidgetBlockListComponent,
        WidgetBlockComponent,
        WidgetSummaryRowComponent,

        BannerGroupComponent,
        BannerListComponent,
        BannerComponent,

        ContentFooterComponent,
        ContentFooterListComponent,
        ContentFooterChildrenComponent,

        HighlightListComponent,
        HighlightComponent,

        SlaComponent,
        SlaListComponent,
        VideoIntegrationComponent,
        VideoIntegrationListComponent,
        NavigationComponent,
        NavigationListComponent,
        NavigationChildrenComponent,
        OnboardingComponent,
        OnboardingListComponent,
        OnboardingContentComponent,
        OnboardingContentHostComponent,
        OnboardingContentImageComponent,
        OnboardingPreviewHostDialogComponent,

        companyStory.CompanyStoryListComponent,
        companyStory.CompanyStoryDetailComponent,
        companyStory.CompanyStoryListOrderingComponent,
        CatalogueComponent,
        CatalogueListComponent,
    ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    CmsRoutingModule,
    DragDropModule,
    NgxSmartModalModule.forChild(),
  ],
  exports: [],
})
export class CmsModule { }
