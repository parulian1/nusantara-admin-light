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

    const downloadLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const isSafariBrowser =
      navigator.userAgent.indexOf('Safari') !== -1 &&
      navigator.userAgent.indexOf('Chrome') === -1;

    // if Safari open in new window to save file with random filename.
    if (isSafariBrowser) {
      downloadLink.setAttribute('target', '_blank');
    }

    downloadLink.setAttribute('href', url);
    downloadLink.setAttribute('download', filename + '.csv');
    downloadLink.style.visibility = 'hidden';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}
