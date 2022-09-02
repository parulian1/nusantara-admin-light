import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AbstractCrudService, PagedResponse} from '@nusantara/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import * as moment from 'moment';
import {ITransactionHistory} from "@nusantara/models/transaction-history";
import {IOrderFilterValue} from "@nusantara/models/order/filter";

@Injectable({
  providedIn: 'root'
})
export class TransactionHistoryReportService extends AbstractCrudService<ITransactionHistory> {
  protected baseUrl = '/api/order/reporting/transaction-history';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  fetchListWithFilter(query?: string, page: number = 1, perPage?: number, filter = {}): Observable<PagedResponse<ITransactionHistory>> {
    // create query params --> ?q=maybe&page=1
    let params = new HttpParams({fromObject: filter});

    params = params.set('page', page.toFixed(0).toString());

    if (perPage) {
      params = params.set('per_page', perPage.toFixed(0).toString());
    }

    if (query) {
      params = params.set('q', query);
    }

    return this.httpClient
      .get<ITransactionHistory[]>(`${this.baseUrl}/`, {observe: 'response', responseType: 'json', params})
      .pipe(map(resp => new PagedResponse(resp)));
  }

  downloadOrderList(filters: IOrderFilterValue) {
    return this.httpClient.post(
      `${this.baseUrl}/download/`,
      filters,
      {responseType: 'text' as 'json'}
    );
  }

  downloadAsCsv(data: string) {
    const today = moment().format('YYYY-MM-DD').toString();
    const filename = `TR-${today}`;
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
