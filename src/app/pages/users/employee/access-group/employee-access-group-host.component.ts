import { Component, Input, OnInit } from '@angular/core';
import { IAccessGroup, IEmployee } from '@nusantara/models';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { GroupService } from '@nusantara/services';
import { forkJoin, Observable } from 'rxjs';
import { getSlugFromHref } from '@nusantara/shared/helpers';

@Component({
  selector: 'nus-employee-access-group-host',
  template: `
    <table>
      <thead>
      <tr>
        <th>Access Group</th>
        <th>Delete</th>
      </tr>
      </thead>
      <tbody>

      <nus-employee-access-group-list
        *ngFor="let formControl of form.controls; let i = index"
        [form]="formControl"
        [choices]="choices"
        (removed)="onRemove($event, i)">
      </nus-employee-access-group-list>

      <tr>
        <td colspan="2">
          <a (click)="addToForm()" style="cursor: pointer;">Add new Access</a>
        </td>
      </tr>
      </tbody>
    </table>
  `,
  styles: [``],
})
export class EmployeeAccessGroupHostComponent implements OnInit {
  @Input() entity?: IEmployee;
  @Input() form: FormArray;
  @Input() choices: IAccessGroup[] = [];

  deletedAccessGroups: IAccessGroup[] = [];

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
  ) {}

  ngOnInit(): void {}
  initialFormArray(): void {}

  addToForm(accessGroup?: IAccessGroup): void {
    const form = this.fb.group({
      href: [accessGroup?.href ?? ''],
      name: [accessGroup?.name ?? ''],
    });

    this.form.push(form);
  }

  onRemove(form: FormGroup, index: number): void {
    if (!!form.get('href').value) {
      this.deletedAccessGroups.push(form.value as IAccessGroup);
    }
    this.form.removeAt(index);
  }

  saveAll(userHref: string): Observable<unknown> {
    const savedJoin$ = forkJoin(
      this.form.value
        .filter((accessGroup) => accessGroup?.href)
        .map((accessGroup: any) => {
        return this.groupService.addEmployee(
          getSlugFromHref(accessGroup.href), userHref
        );
      }) || []
    );

    return forkJoin([savedJoin$]);
  }
}
