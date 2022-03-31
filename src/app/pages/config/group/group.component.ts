import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {AbstractDetailComponent, DialogResult, ErrorResult, Logger, PagedResponse, ToastService} from '@nusantara/core';
import {IEmailHrefUserEntity, IAccessGroup, ICustomer, IHttpFailure, IUser} from '@nusantara/models';
import {GroupService} from '@nusantara/services';
import {UserSelectionModalComponent} from '@nusantara/shared';
import {catchError} from 'rxjs/operators';
import {HttpErrorResponse, HttpParams} from '@angular/common/http';
import {EMPTY, of} from 'rxjs';
import {getSlugFromHref} from '@nusantara/shared/helpers';
import {GroupUserService} from '@nusantara/services/group-user.service';

const logger = new Logger('Group Component');

@Component({
  selector: 'nus-group-detail',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      [typeName]="entityTypeName">
    </nus-detail-title>

    <ul class="non-field-errors" *ngIf="!!nonFieldErrors.length">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>

    <nus-tabs>
      <nus-tab title="General" value="general" i18n-title>
        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="wrapper">
            <h1 class="heading-1" i18n>General Information</h1>
            <label>
              <span i18n>Group Name</span>
              <input type="text" [value]="entity.name" readonly>
            </label>
            <!--          <label>-->
            <!--            <span i18n>Permissions</span>-->

            <!--          </label>-->
            <label>
              <span i18n>Users</span>
              <nus-pagination [page]="userEntities" *ngIf="userEntities"></nus-pagination>
            </label>
            <table>
              <thead>
              <tr>
                <th i18n>User</th>
                <th i18n>Email</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr *ngFor="let entityUser of userEntities.entities; let i=index">
                <td>{{ entityUser.firstName }}</td>
                <td>{{entityUser.email}}</td>
                <td>
                  <button (click)="removeUser(entityUser.href,i)"
                          type="button"
                          class="remove-button"
                          title="Remove" i18n-title>
                    <i class="material-icons">remove_circle_outline</i>
                  </button>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <button type="button" (click)="selectUser()" class="add-button" i18n>
                    Add User
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>


          <nus-detail-actions
            [component]="this"
            [hideSave]="true"
            (cancel)="navigateToParent(true)"
            (delete)="delete()" [hideDelete]="true">
          </nus-detail-actions>

        </form>
      </nus-tab>
      <nus-tab title="Access" value="x" *ngIf="showAccessTab" i18n-title>
        <div class="access-list">
          <table>
            <thead>
            <tr>
              <th i18n>Menu</th>
              <th i18n>Access</th>
            </tr>
            </thead>
            <tbody>
            <tr *ngFor="let access of accessibilities; let i=index">
              <td>{{ access.menu }}</td>
              <td><nus-true-false [value]="access.isAllowed"></nus-true-false></td>
            </tr>
            </tbody>
          </table>
        </div>
      </nus-tab>
    </nus-tabs>
    <nus-user-selection-modal [selectedUsers]="entity?.users"></nus-user-selection-modal>

  `,
  styles: [`
    .wrapper {
      padding: 16px 24px; border: solid 1px var(--grey);
      border-radius: 4px; margin-bottom: 24px; margin-top: 24px;
    }
    .heading-1 { margin-bottom: 16px; }
    ::ng-deep div.tab { max-width: 892px; }
    form, .access-list {
      max-width: 892px;
    }
    .access-list {
      margin-top: 24px;
    }
  `]
})
export class GroupComponent extends AbstractDetailComponent<IAccessGroup> implements OnInit, AfterViewInit {

  @ViewChild(UserSelectionModalComponent) userSelectionModal: UserSelectionModalComponent;

  entity?: IAccessGroup;
  userEntities?: PagedResponse<IUser>;
  showAccessTab = false;
  accessibilities: Array<{menu: string, isAllowed: boolean}> = [
    { menu: "Dashboard", isAllowed: true }, { menu: "Inventory Management", isAllowed: true },
    { menu: "Promotion Management", isAllowed: true }, { menu: "CMS", isAllowed: true },
    { menu: "Order Fulfillment", isAllowed: true }, { menu: "Customers and Users", isAllowed: true },
    { menu: "Reports", isAllowed: true }, { menu: "Config", isAllowed: true }
  ]

  constructor(service: GroupService,
              public groupUserService: GroupUserService,
              public fb: FormBuilder,
              toast: ToastService,
              router: Router,
              public route: ActivatedRoute) {
    super(route, router, toast, service);
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get users(): FormArray {
    return this.form.get('users') as FormArray;
  }

  ngOnInit() {
    super.ngOnInit();
    this.route.data.subscribe((data: { userList: PagedResponse<IUser> }) => {
      this.userEntities = data.userList;
    });
    this.updateAccessibilities();
  }

  initializeForm(entity?: IAccessGroup) {
    this.entity = entity;
    this.form = this.fb.group({
      href: [entity?.href],
      name: [entity?.name, [Validators.maxLength(120), Validators.required]],
      users: this.fb.array([]),
    });
    // for (const user of entity?.users ?? []) {
    //   this.addUser(user);
    // }
    this.showAccessTab = !!entity && !!entity.href;
  }

  selectUser() {
    this.userSelectionModal.open();
  }

  addUser(user: IEmailHrefUserEntity) {
    this.users.push(
      this.fb.group({
        href: [user.href],
        email: [user.email]
      }));
  }

  ngAfterViewInit() {
    this.userSelectionModal.onClose.subscribe(() => this.onUserSelectionModalClosed());
  }

  onUserSelectionModalClosed() {
    if (this.userSelectionModal.result === DialogResult.OK) {

      const selectedUser = this.userSelectionModal.user.value as ICustomer;
      this.service.addEmployee(
        getSlugFromHref(this.entity.href), selectedUser.href
      ).pipe(catchError(err => {
        if (err instanceof HttpErrorResponse) {
          return of(new ErrorResult<IHttpFailure>(err.error, err.status));
        } else {
          return of(new ErrorResult<IHttpFailure>({detail: 'Network error.. probably?'}, err.status));
        }
      })).subscribe(res => {
        this.refreshUserList();
      });

      // const f = this.fb.group({
      //   href: [selectedUser.href, []],
      //   email: [selectedUser.email, []]
      // });
      // this.users.push(f);
      this.refreshUserList();
    }
  }

  beforeSave() {
    super.beforeSave();
    this.form.removeControl('users');
  }

  removeUser(href: string, i: number) {
    this.service.removeEmployee(
      getSlugFromHref(this.entity.href), getSlugFromHref(href)
    ).pipe(catchError(err => {
      if (err instanceof HttpErrorResponse) {
        return of(new ErrorResult<IHttpFailure>(err.error, err.status));
      } else {
        return of(new ErrorResult<IHttpFailure>({detail: 'Network error.. probably?'}, err.status));
      }
    })).subscribe(res => {
      logger.info('Employee removed from access group');
      this.refreshUserList();
      // this.users.removeAt(i);
    });
  }

  refreshUserList(): void {
    let params = new HttpParams();
    const theQuery = this.route.queryParams;
    for (const keyParam of Object.keys(theQuery)) {
      if (['q', 'page', 'per_page', 'include_deleted', 'include_inactive'].indexOf(keyParam) >= 0) {
        if ('page' === keyParam || keyParam === 'per_page') {
          // need to validate number
          if (Number.isInteger(theQuery[keyParam])) {
            // TODO: probably need to throw error
            continue;
          }
        }
        params = params.set(keyParam, theQuery[keyParam]);
      }
    }
    const slug = this.route.snapshot.paramMap.get('slug');
    params = params.set('access_group', slug);

    this.groupUserService.fetchParams(params).pipe(catchError(err => {
      logger.error('Error loading group user');
      return of(EMPTY);
    })).subscribe(res => {
      this.userEntities = res;
    });
  }

  updateAccessibilities(): void {
    const isFulfill = this.entity?.name.toLowerCase().indexOf('fulfillment') > -1;
    this.accessibilities.map((access) => {
      const isMenuFulfill = access.menu.toLowerCase().indexOf('fulfillment') > -1;
      if (isFulfill && !isMenuFulfill && ['dashboard', 'reports'].indexOf(access.menu.toLowerCase()) === -1) {
        access.isAllowed = false;
      }
      return access;
    });
  }
}

