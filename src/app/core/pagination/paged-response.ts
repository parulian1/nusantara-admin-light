import { HttpResponse } from '@angular/common/http';

import { LinkHeaderField } from './link-header';

/**
 * Wraps an HTTP API response containing paginated data.
 * Intended for use only with Nusantara APIs.
 *
 */
export class PagedResponse<T> {

  public linkHeaders: LinkHeaderField[];
  public entities: Array<T> = [];

  constructor(private response: HttpResponse<Array<T>>) {
    const links = response.headers.get('Link');
    if (links) {
      this.linkHeaders = links.split(',').map(s => new LinkHeaderField(s));
    }
    this.entities = response.body;
  }


}

//
// export abstract class PaginatedApiService extends BaseApiService {
//
//   public constructor(http: HttpClient,
//                      public localStorage: LocalStorage) {
//     super(http, localStorage);
//   }
//
//   protected get linkHeaders(): Array<LinkHeaderField> {
//     if (!this._lastResponse || !this._lastResponse.headers.get("Link")) {
//       return [];
//     }
//
//     return this._lastResponse.headers.get("Link").split(",").map(
//       rawLink => new LinkHeaderField(rawLink)
//     );
//   }
//
//   private getLink(rel: PaginationRelType): LinkHeaderField {
//     if (!this._lastResponse) {
//       return null;
//     }
//     return this.linkHeaders.filter(link => link.rel === rel).pop();
//   }
//
//   public hasLink(rel: PaginationRelType): boolean {
//     if (!this._lastResponse) {
//       return false;
//     }
//     return !!this.getLink(rel);
//   }
//
//   public get totalResults(): number {
//     if (!this._lastResponse) {
//       return 0;
//     }
//     const totalResults = this._lastResponse.headers.get("X-Total-Results");
//     return (!!totalResults) ? +totalResults : 0;
//   }
//
//   public get totalPages(): number {
//     if (!this._lastResponse) {
//       return 0;
//     } else {
//       if (this.hasLink("last")) {
//         return +this.getLink("last").title;
//       } else if (this.hasLink("previous")) {
//         return (+this.getLink("previous").title) + 1;
//       } else {
//         return 0;
//       }
//     }
//   }
//
//   public async getPage<T>(rel: PaginationRelType): Promise<T> {
//     return await super.getJson<T>(this.getLink(rel).url);
//   }
//
// }
