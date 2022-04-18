import {Injectable} from '@angular/core';
import {
  AbstractCrudService,
  ErrorResult,
  IResultResponse,
  Logger,
  SuccessCreatedResult,
  SuccessResult
} from '@nusantara/core';
import {ICatalogue} from '@nusantara/models/catalogue/catalogue';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {getSlugFromHref} from '@nusantara/shared/helpers';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {saveAs} from 'file-saver';

const logger = new Logger('CatalogueService');

interface IDownload {
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogueService extends AbstractCrudService<ICatalogue> {
  baseUrl = '/api/cms/catalogue-file';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getDownloadLink(catalogue: ICatalogue) {
    const slug = getSlugFromHref(catalogue?.href);
    return this.httpClient.get<IDownload>(`${this.baseUrl}/${slug}/download/?download=1`,
      {responseType: 'json'});
  }

  downloadCatalogue(catalogue: ICatalogue): Observable<Blob> {
    const slug = getSlugFromHref(catalogue.href);
    return this.httpClient.get(`${this.baseUrl}/${slug}/download/?download=1`,
      {responseType: 'blob', headers: {Accept: 'application/*'}});
  }

  /**
   * Sends JSON or FormData to this service's list endpoint using HTTP POST.
   */
  createWithProgress(entity: ICatalogue | FormData, headers?: any): Observable<HttpEvent<ICatalogue>> {
    return this.httpClient
      .post<ICatalogue>(`${this.baseUrl}/`, entity, {
        reportProgress: true,
        observe: 'events', headers
      });
  }


  updateWithProgress(entity: ICatalogue | FormData, removeEmptyFiles = true, headers?: any): Observable<HttpEvent<ICatalogue>> {

    // prevent unchanged files from being deleted on form data.
    if (entity instanceof FormData && removeEmptyFiles) {
      this.removeEmptyFiles(entity);
    }
    return this.httpClient
      .patch<ICatalogue>(this.getEntityUrl(entity), entity, {
        reportProgress: true,
        observe: 'events', headers});
  }

  saveWithProgress(entity: ICatalogue | FormData, headers?: Headers): Observable<HttpEvent<ICatalogue>> {
    if (!!this.getEntityUrl(entity)) {
      return this.updateWithProgress(entity, true, headers);
    } else {
      return this.createWithProgress(entity, headers);
    }
  }

}
