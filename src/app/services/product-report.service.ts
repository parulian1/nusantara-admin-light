import {HttpClient} from '@angular/common/http';
import * as moment from 'moment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductReportService {
  protected httpClient: HttpClient;

  baseUrl = '/api/catalog/product-report';

  protected constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  downloadProductList(filters = {}) {
    return this.httpClient.post(
      `${this.baseUrl}/`,
      filters,
      { responseType: 'text' as 'json' }
    );
  }

  downloadAsCsv(data: string) {
    const today = moment().format('YYYY-MM-DD').toString();
    const filename = `PL-${today}`;
    const blob = new Blob(['\ufeff' + data], {
      type: 'text/csv;charset=utf-8;',
    });

    const dwldLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const isSafariBrowser =
      navigator.userAgent.indexOf('Safari') !== -1 &&
      navigator.userAgent.indexOf('Chrome') === -1;

    // if Safari open in new window to save file with random filename.
    if (isSafariBrowser) {
      dwldLink.setAttribute('target', '_blank');
    }

    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', filename + '.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }
}
