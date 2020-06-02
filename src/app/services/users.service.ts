import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractCrudService } from '@nusantara/core/http';
import { IUser } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractCrudService<IUser> {

  protected baseUrl = '/api/iam/user';

  constructor(protected httpClient: HttpClient) {
    super();
  }
}
