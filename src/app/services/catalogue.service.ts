import { Injectable } from '@angular/core';
import {AbstractCrudService, Logger} from '@nusantara/core';
import {ICatalogue} from '@nusantara/models/catalogue/catalogue';
import {HttpClient} from '@angular/common/http';
import {getSlugFromHref} from '@nusantara/shared/helpers';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {saveAs} from 'file-saver';
const logger = new Logger('CatalogueService');
interface IDownload {
  url: string;
}
@Injectable({
  providedIn: 'root'
})
export class CatalogueService extends AbstractCrudService<ICatalogue>{
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
    return this.getDownloadLink(catalogue).pipe(switchMap(res => {
      return this.httpClient.get(res.url, {responseType: 'blob',
        headers: {Accept: 'application/*'}});
    }));
  }
}
