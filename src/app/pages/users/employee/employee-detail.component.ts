import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '@nusantara/services';
import { AbstractDetailComponent } from '@nusantara/core';

@Component({
  selector: 'nus-employee-detail',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Employee">
    </nus-detail-title>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="actions-container">
        <button type="submit" [disabled]="!form.valid">Save</button>
        <button (click)="navigateToParent(true)">Cancel</button>
        <button (click)="delete()" *ngIf="!isNew">Delete</button>
      </div>
    </form>
  `,
  styles: [ ]
})
export class EmployeeDetailComponent extends AbstractDetailComponent implements OnInit {

  constructor(public service: UserService,
              public route: ActivatedRoute,
              public router: Router,
              private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void { }
  submit() { }
  delete() { }
}
