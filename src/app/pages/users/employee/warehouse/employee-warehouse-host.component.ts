import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { forkJoin, Observable } from 'rxjs';

import { AuthService } from '@nusantara/auth';
import { WarehouseService } from '@nusantara/services';
import { IEmployee, IWarehouse } from '@nusantara/models';

import { getSlugFromHref } from '@nusantara/shared/helpers';
import { IJwtClaims } from '@nusantara/auth/models';

@Component({
  selector: 'nus-employee-warehouse-host',
  template: `
    <table>
      <thead>
        <tr>
          <th>Warehouse</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <nus-employee-warehouse-list
          *ngFor="let formControl of form.controls; let i = index"
          [choices]="choices"
          [form]="formControl"
          (removed)="onRemove($event, i)"
        >
        </nus-employee-warehouse-list>
        <tr>
          <td colspan="2">
            <a (click)="addToForm()" style="cursor: pointer;">Add new Warehouse</a>
          </td>
        </tr>
      </tbody>
    </table>
  `,
})
export class EmployeeWarehouseHostComponent implements OnInit {
  @Input() entity?: IEmployee;
  @Input() form: FormArray;
  @Input() choices: IWarehouse[] = [];

  currentUser: IJwtClaims; // user_id is username
  deletedWarehouse: IWarehouse[] = [];

  get token(): any {
    return this.authService.token;
  }

  constructor(
    private fb: FormBuilder,
    private warehouseService: WarehouseService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.initialFormArray();
    this.handleCurrentUser();
  }

  handleCurrentUser(): void {
    this.currentUser = this.authService.tokenPayload;
  }

  initialFormArray(): void {
    this.warehouseService
      .fetchAllByUser(this.entity?.username)
      .subscribe((warehouses) => {
        warehouses.forEach((warehouse) => {
          this.addToForm(warehouse);
        });
      });
  }

  addToForm(warehouse?: IWarehouse): void {
    const form = this.fb.group({
      href: [warehouse?.href ?? ''],
      name: [warehouse?.name ?? ''],
    });

    this.form.push(form);
  }

  onRemove(form: FormGroup, index: number): void {
    if (!!form.get('href').value) {
      this.deletedWarehouse.push(form.value as IWarehouse);
    }
    this.form.removeAt(index);
  }

  saveAll(userHref: string): Observable<unknown> {
    const savedJoin$ = forkJoin(
      this.form.value.map((warehouse) => {
        return this.warehouseService.createEmployee(
          getSlugFromHref(warehouse.href),
          {
            user: userHref,
          }
        );
      }) || []
    );

    const deletedJoin$ = forkJoin(
      this.deletedWarehouse.map((warehouse) => {
        return this.warehouseService.deleteEmployee(
          getSlugFromHref(warehouse.href),
          getSlugFromHref(userHref),
          // this.currentUser.user_id
        );
      })
    );

    return forkJoin([savedJoin$, deletedJoin$]);
  }
}
