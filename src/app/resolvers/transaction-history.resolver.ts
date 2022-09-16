import {Injectable} from "@angular/core";
import {AbstractListResolver, PagedResponse} from "@nusantara/core";
import {ITransactionHistory} from "@nusantara/models/transaction-history";
import {TransactionHistoryReportService} from "@nusantara/services";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TransactionHistoryResolver extends AbstractListResolver<ITransactionHistory> {
  constructor(public service: TransactionHistoryReportService) {
    super(service);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<ITransactionHistory>> | Observable<never> {
    let params = new HttpParams();
    const theQuery = route.queryParams;
    for (const keyParam of Object.keys(theQuery)) {
      if (
        [
          'q',
          'ordering',
          'start_time',
          'end_time',
          'store_id',
          'page',
          'per_page',
        ].indexOf(keyParam) >= 0
      ) {
        if ('page' === keyParam || keyParam === 'per_page') {
          // need to validate number
          if (Number.isInteger(theQuery[keyParam])) {
            // TODO: probably need to throw error
            continue;
          }
        }
        if (!!theQuery[keyParam]) {
          params = params.set(keyParam, theQuery[keyParam]);
        }
      }
    }
    if (!params.get('per_page')) {
      params = params.set('per_page', '25');
    }
    return this.service.fetchParams(params);
  }
}
