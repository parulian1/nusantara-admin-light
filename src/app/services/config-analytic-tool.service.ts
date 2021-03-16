import { Injectable } from '@angular/core';
import { AbstractCrudService } from '../core';
import { IConfigAnalyticTool } from '@nusantara/models';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { mergeMap, toArray } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfigAnalyticToolService extends AbstractCrudService<IConfigAnalyticTool> {
  baseUrl = '/api/client/analytic-tool';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  deleteAll(): Observable<unknown> {
    return this.fetchAll().pipe(
      mergeMap((result) =>
        forkJoin(
          result.map((chat) => {
            return this.delete(chat);
          })
        )
      ),
      toArray(),
    );
  }
}
