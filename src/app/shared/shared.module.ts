import { NgModule } from '@angular/core';
import { EntityToSlugPipe } from './entity-to-slug.pipe';
import { PaginationComponent } from './pagination.component';

/**
 * The purpose of this module is to make common code (like pipes)
 * easily importable to any modules that need them.
 */
@NgModule({
  declarations: [
    EntityToSlugPipe,
    PaginationComponent,
  ],
  exports: [
    EntityToSlugPipe,
    PaginationComponent,
  ],
  imports: [ ],
})
export class SharedModule { }
