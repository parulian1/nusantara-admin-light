import { Injectable } from '@angular/core';
import { AbstractCrudService } from '../core';
import { IConfigChat } from '@nusantara/models';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { mergeMap, toArray } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfigChatService extends AbstractCrudService<IConfigChat> {
  baseUrl = '/api/client/chat-service';

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
