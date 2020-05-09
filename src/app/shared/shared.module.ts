import { NgModule } from '@angular/core';
import { EntityToSlugPipe } from './entity-to-slug.pipe';
import { PaginationComponent } from './pagination.component';
import { EntityDetailTitle } from './entity-detail-title.component';
import { CommonModule } from '@angular/common';

/**
 * The purpose of this module is to make common code (like pipes)
 * easily importable to any modules that need them.
 */
@NgModule({
  declarations: [
    EntityToSlugPipe,
    PaginationComponent,
    EntityDetailTitle,
  ],
  exports: [
    EntityToSlugPipe,
    PaginationComponent,
    EntityDetailTitle,
  ],
  imports: [
    CommonModule,
  ],

})
export class SharedModule { }
