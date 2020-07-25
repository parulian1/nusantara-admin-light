import { OnInit, Directive } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PagedResponse } from '@nusantara/core/pagination';

/**
 * Base class for common list page components.
 */
@Directive()
export abstract class AbstractListComponent<T> implements OnInit {

  page: PagedResponse<T>;

  protected constructor(protected route: ActivatedRoute) {  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { page: PagedResponse<T> }) => {
      this.page = data.page;
    });
  }
}
