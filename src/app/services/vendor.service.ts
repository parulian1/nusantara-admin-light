import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractCrudService } from '@nusantara/core/http';
import { ICategory, IVendor } from '@nusantara/models';
import { Observable } from 'rxjs';
import { ErrorResult, IResultResponse, SuccessResult } from '@nusantara/core/responses';
import { map } from 'rxjs/operators';
import { IEntityHref } from '@nusantara/core';

@Injectable({
  providedIn: 'root'
})
export class VendorService extends AbstractCrudService<IVendor> {

  baseUrl = 'api/catalog/vendor';

  constructor(protected httpClient: HttpClient) {
    super();
  }

  uploadImages(entityUrl: string, images: ImageUploadList): Observable<IResultResponse> {
    const fd = new FormData();
    Object.entries(images).forEach(([propertyName, image]) => {
      fd.append(propertyName, image);
    });
    return this.httpClient.patch(
      entityUrl,
      fd, { observe: 'response' }
    ).pipe(
      map(resp => resp.status === 200 ? new SuccessResult() : new ErrorResult() )
    );
  }
}


export interface ImageUploadList {
  [key: string]: File;
}
