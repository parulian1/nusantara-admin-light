import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractDetailComponent, DialogResult, ToastService } from '@nusantara/core';
import { IEmailHrefUserEntity, IAccessGroup, ICustomer } from '@nusantara/models';
import { GroupService } from '@nusantara/services';
import { UserSelectionModalComponent } from '@nusantara/shared';


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

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span i18n>Name</span>
        <input type="text" [value]="entity.name" readonly>
      </label>

      <label>
        <span i18n>Permissions</span>

      </label>

      <table>
        <thead>
        <tr>
          <th i18n>User</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let control of users.controls; let i=index">
          <td>{{ control.get('email').value }}</td>
          <td>
            <button (click)="users.removeAt(i)" type="button" class="remove-button">
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

      <nus-user-selection-modal [selectedUsers]="entity?.users"></nus-user-selection-modal>

      <nus-detail-actions
      [component]="this"
      (cancel)="navigateToParent(true)"
      (delete)="delete()" [hideDelete]="true">
      </nus-detail-actions>

    </form>
  `,
  styles: [``]
})
export class GroupComponent extends AbstractDetailComponent<IAccessGroup> implements OnInit, AfterViewInit {

  @ViewChild(UserSelectionModalComponent) userSelectionModal: UserSelectionModalComponent;

  entity?: IAccessGroup;

  constructor(service: GroupService,
              public fb: FormBuilder,
              toast: ToastService,
              router: Router,
              route: ActivatedRoute) {
    super(route, router, toast, service);
  }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get users(): FormArray { return this.form.get('users') as FormArray; }

  ngOnInit() {
    super.ngOnInit();
  }

  initializeForm(entity?: IAccessGroup) {
    this.entity = entity;
    this.form = this.fb.group({
      href: [entity?.href],
      name: [entity?.name, [Validators.maxLength(120), Validators.required]],
      users: this.fb.array([]),
    });
    for (const user of entity?.users ?? []) {
      this.addUser(user);
    }
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

      const f = this.fb.group({
        href: [selectedUser.href, []],
        email: [selectedUser.email, []]
      });
      this.users.push(f);
    }
  }
}

