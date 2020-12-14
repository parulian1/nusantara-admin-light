import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractDetailComponent, DialogResult, ToastService } from '@nusantara/core';
import { drf, INamedHrefEntity, IReseller, IResellerType, products } from '@nusantara/models';
import { CustomerGroupModalComponent } from "@nusantara/shared";
import { ResellerService } from "@nusantara/services";


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
        <ng-container *ngFor="let option of options">
          <mat-radio-group></mat-radio-group>
          <input type="radio" id="option" name="types" [ngValue]="option">
          <label>{{ option }}</label><br>
        </ng-container>
      </label>

      <table>
        <tbody>
        <tr *ngFor="let control of groups.controls; let i=index">
          <td>{{ control.get('name').value }}</td>
          <td>
            <button (click)="groups.removeAt(i)" type="button" class="remove-button">
              <i class="material-icons">remove_circle_outline</i>
            </button>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <button type="button" (click)="selectGroup()" class="add-button">
              Add Customer Group
            </button>
          </td>
        </tr>
        </tbody>
      </table>


      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()" [hideDelete]="true">
      </nus-detail-actions>

      <nus-customer-group-selection-modal [selectedGroups]="entity?.groups"></nus-customer-group-selection-modal>
    </form>
  `,
  styles: [``]
})
export class ResellerComponent extends AbstractDetailComponent<IReseller> implements OnInit, AfterViewInit {

  @ViewChild(CustomerGroupModalComponent) customerGroupSelectionModal: CustomerGroupModalComponent;

  entity?: IReseller;
  options: drf.IChoice[] = [];

  constructor(service: ResellerService,
              public fb: FormBuilder,
              toast: ToastService,
              router: Router,
              route: ActivatedRoute) {
    super(route, router, toast, service);
  }

  get type(): FormControl { return this.form.get('type') as FormControl; }
  get groups(): FormArray { return this.form.get('groups') as FormArray; }

  ngOnInit() {
    super.ngOnInit();
    this.route.data.subscribe((data: { entity: IReseller, types: drf.IChoice[]}) => {
      this.entity = data.entity;
      this.options = data.types;
    });
    this.originalEntityName = "Reseller Config";
    console.log('options', this.options);
  }

  initializeForm(entity?: IReseller) {
    this.entity = entity;
    this.form = this.fb.group({
      href: [this.service.apiBaseUrl],
      type: [entity?.type, [Validators.required]],
      groups: this.fb.array([]),
    });
    for (const group of entity?.groups ?? []) {
      this.addGroup(group);
    }
  }

  selectGroup() {
    this.customerGroupSelectionModal.open();
  }

  addGroup(group: INamedHrefEntity) {
    this.groups.push(
      this.fb.group({
        href: [group.href],
        name: [group.name]
      }));
  }

  ngAfterViewInit() {
    this.customerGroupSelectionModal.onClose.subscribe(() => this.onGroupSelectionModalClosed());
  }

  onGroupSelectionModalClosed() {
    if (this.customerGroupSelectionModal.result === DialogResult.OK) {

      const selectedGroup = this.customerGroupSelectionModal.group.value as INamedHrefEntity;

      const f = this.fb.group({
        href: [selectedGroup.href, []],
        name: [selectedGroup.name, []]
      });
      this.groups.push(f);
    }
  }

  optionChange(event: Event| String) {
  }
}

