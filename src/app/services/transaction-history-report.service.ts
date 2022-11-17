import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AbstractCrudService} from '@nusantara/core';
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
