import { HttpResponse } from '@angular/common/http';

import { LinkHeaderField } from './link-header';

/**
 * Wraps an HTTP API response containing paginated data.
 * Intended for use only with Nusantara APIs.
 *
 */
export class PagedResponse<T> {

  public linkHeaders: LinkHeaderField[];
  public totalResults = 0;
  public pageSize = 25;
  public pageNumber = 1;
  public entities: Array<T> = [];

  constructor(private response: HttpResponse<Array<T>>) {
    const links = response.headers.get('Link');

    this.totalResults = parseInt(response.headers.get('X-Total-Results') ?? '0', 10);

    if (links) {
      this.linkHeaders = links.split(',').map(s => new LinkHeaderField(s));
    }
    this.entities = response.body;
  }
}
