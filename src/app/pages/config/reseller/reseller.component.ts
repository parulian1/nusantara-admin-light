import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractDetailComponent, DialogResult, ToastService } from '@nusantara/core';
import { drf, INamedHrefEntity, IReseller, IResellerType, products } from '@nusantara/models';
import { CustomerGroupModalComponent } from "@nusantara/shared";
import { ResellerService } from "@nusantara/services";


@Component({
  selector: 'nus-reseller-config',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      [typeName]="entityTypeName">
    </nus-detail-title>

    <ul class="non-field-errors" *ngIf="!!nonFieldErrors.length">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>

    <form [formGroup]="form" (ngSubmit)="save()">
      <label *ngFor="let option of options" class="types">
        <span>
          <input type="radio" id="option" name="types" [value]="option.value" [formControl]="type"
          (change)="optionChange($event)">
        </span>
        <div>
          {{ option.displayName }}
        </div>
        <nus-field-errors [control]="type"></nus-field-errors>
      </label>

      <table [hidden]="!showGroups">
        <tbody>
        <tr *ngFor="let control of resellerGroups.controls; let i=index">
          <td>{{ control.get('name').value }}</td>
          <td>
            <button (click)="resellerGroups.removeAt(i)" type="button" class="remove-button">
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
      <nus-customer-group-selection-modal [selectedGroups]="entity?.resellerGroups" >
      </nus-customer-group-selection-modal>
      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()" [hideDelete]="true">
      </nus-detail-actions>
    </form>
  `,
  styles: [`
    .types > span {
      float: left;
      width: 10%;
    }
    .types > div {
      float: left;
      width: 90%;
    }

  `]
})
export class ResellerComponent extends AbstractDetailComponent<IReseller> implements OnInit, AfterViewInit {

  @ViewChild(CustomerGroupModalComponent) customerGroupSelectionModal: CustomerGroupModalComponent;

  entity?: IReseller;
  options: drf.IChoice[] = [];
  showGroups: boolean = false;

  constructor(service: ResellerService,
              public fb: FormBuilder,
              toast: ToastService,
              router: Router,
              route: ActivatedRoute) {
    super(route, router, toast, service);
  }

  get type(): FormControl { return this.form.get('type') as FormControl; }
  get resellerGroups(): FormArray { return this.form.get('resellerGroups') as FormArray; }

  ngOnInit() {
    super.ngOnInit();
    this.route.data.subscribe((data: { entity: IReseller, types: drf.IChoice[]}) => {
      this.entity = data.entity;
      this.options = data.types;
      this.updateShowGroups(this.entity.type);
    });
    this.originalEntityName = "Reseller Config";
  }

  initializeForm(entity?: IReseller) {
    this.entity = entity;
    this.form = this.fb.group({
      href: [this.service.apiBaseUrl],
      type: [entity?.type, [Validators.required]],
      resellerGroups: this.fb.array([]),
    });
    for (const group of entity?.resellerGroups ?? []) {
      this.addGroup(group);
    }
  }

  selectGroup() {
    this.customerGroupSelectionModal.open();
  }

  addGroup(group: INamedHrefEntity) {
    this.resellerGroups.push(
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
      this.resellerGroups.push(f);
    }
  }

  optionChange(event: any) {
    this.updateShowGroups(event.target.attributes[5].value);
    this.resetResellerGroups();
  }

  updateShowGroups(value: string) {
    if (value === IResellerType.groups) {
      this.showGroups = true;
    } else {
      this.showGroups = false;
    }
  }

  resetResellerGroups() {
    this.resellerGroups.clear();
  }

}

