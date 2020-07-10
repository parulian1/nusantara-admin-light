import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EntityToSlugPipe } from './entity-to-slug.pipe';
import { PaginationComponent } from './pagination.component';
import { DetailTitleComponent } from './detail-title.component';
import { ListHeaderComponent } from './list-header.component';
import { DetailActionsComponent } from './detail-actions.component';
import { TrueFalseComponent } from './true-false.component';
import { CamelToHumanizedPipe } from './camel-to-humanized.pipe';
import { AddressComponent } from './address';
import { FieldErrorsComponent } from './field-errors.component';
import { NonFieldErrorsComponent } from './non-field-errors.component';
import { SpinnerComponent } from './spinner.component';


/**
 * The purpose of this module is to make common code (like pipes)
 * easily importable to any modules that need them.
 */
@NgModule({
  declarations: [
    EntityToSlugPipe,
    CamelToHumanizedPipe,
    PaginationComponent,
    DetailTitleComponent,
    DetailActionsComponent,
    ListHeaderComponent,
    TrueFalseComponent,
    AddressComponent,
    FieldErrorsComponent,
    NonFieldErrorsComponent,
    SpinnerComponent,
  ],
  exports: [
    EntityToSlugPipe,
    CamelToHumanizedPipe,
    PaginationComponent,
    DetailTitleComponent,
    ListHeaderComponent,
    DetailActionsComponent,
    TrueFalseComponent,
    AddressComponent,
    FieldErrorsComponent,
    NonFieldErrorsComponent,
    SpinnerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
  ],

})
export class SharedModule { }
