import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IVendor } from '@nusantara/models';
import { VendorService } from '@nusantara/services';
import { AbstractDetailComponent } from '@nusantara/core';

@Component({
  selector: 'nus-vendor-detail',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Vendor">
    </nus-detail-title>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <label>
        <span>Name</span>
        <input type="text" formControlName="name">
      </label>
      <label>
        <span>Description</span>
        <textarea formControlName="description"></textarea>
      </label>
      <label>
        <span>Internal Notes</span>
        <textarea formControlName="internalNotes"></textarea>
      </label>

      <div class="actions-container">
        <button type="submit" [disabled]="!form.valid">Save</button>
        <button (click)="navigateToParent(true)">Cancel</button>
        <button (click)="delete()" *ngIf="!isNew">Delete</button>
      </div>
    </form>
  `,
  styles: [`
    label {
      display: block;
      margin-bottom: .5em;
    }
    label > span {
      display: inline-block;
      width: 65px;
    }
    input {
      font-size: 1em;
      font-family: Roboto, "Helvetica Neue", sans-serif;
    }

  `]
})
export class VendorDetailComponent extends AbstractDetailComponent implements OnInit {

  constructor(public service: VendorService,
              public route: ActivatedRoute,
              public router: Router,
              private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: {entity: IVendor}) => {
      this.form = this.fb.group({
        name: [data.entity?.name, [Validators.required, ]],
        href: [data.entity?.href, []],
        description: [data.entity?.description, []],
        internalNotes: [data.entity?.internalNotes, []],
      });

      this.originalEntityName = data.entity?.name;
    });
  }

  submit() {
    this.service.save(this.form.value).subscribe(
      resp => {
        if (resp.success) {
          this.navigateToParent(false);
        } else {
          alert('There was a problem saving');
        }
      }
    );
  }

  delete() {
    this.service.delete(this.form.get('href').value).subscribe(
      resp => {
        if (resp.success) {
          this.navigateToParent(false);
        } else {
          alert('Error deleting');
        }
      }
    );
  }

}
