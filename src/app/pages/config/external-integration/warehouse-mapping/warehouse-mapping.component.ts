import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AbstractDetailComponent, DialogResult, ToastService} from '@nusantara/core';
import {IWarehouseMapping} from '@nusantara/models/integrations/warehouse-mapping';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {WarehouseMappingService} from '@nusantara/services/integrations/warehouse-mapping.service';
import {drf, ISubLocation} from '@nusantara/models';
import {WarehouseLocationModalComponent} from '@nusantara/shared/modals/warehouse-location-modal.component';

@Component({
  selector: 'nus-warehouse-mapping',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Warehouse Integration Mapping">
    </nus-detail-title>
    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>
    <form [formGroup]="form" (ngSubmit)="save()" #f>
      <div class="wrapper">
        <label>
          <span i18n>Mapping Type</span>
          <select formControlName="type">
            <option *ngFor="let choice of types" [ngValue]="choice.value">{{ choice.displayName }}</option>
          </select>
          <nus-field-errors [control]="type"></nus-field-errors>
        </label>

        <label>
          <span i18n>Partner Data ID</span>
          <input type="text" formControlName="warehouseId" maxlength="25">
          <nus-field-errors [control]="warehouseId"></nus-field-errors>
        </label>
      </div>
      <div class="wrapper">
        <label>
          <span i18n>Sub Location</span>
          <div class="manage">
            <div>
              <input type="hidden" [formControl]="location_href" data-qa="sub-location">
              <input type="text" (click)="selectSubLocation()" readonly [value]="selectedLocationValue?.name" data-qa="product-class-pop">

            </div>
          </div>
        </label>
      </div>
      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
    <nus-warehouse-location-modal #subLocationModal></nus-warehouse-location-modal>
  `,
  styles: []
})
export class WarehouseMappingComponent extends AbstractDetailComponent<IWarehouseMapping>
  implements OnInit, AfterViewInit {
  types: drf.IChoice[] = [];
  selectedLocationValue: ISubLocation;

  @ViewChild(WarehouseLocationModalComponent) subLocationModal: WarehouseLocationModalComponent;

  constructor(service: WarehouseMappingService,
              route: ActivatedRoute,
              router: Router,
              private fb: FormBuilder,
              toast: ToastService) {
    super(route, router, toast, service);
  }

  ngOnInit() {
    super.ngOnInit();
    this.route.data.subscribe((data: { types: drf.IChoice[] }) => {
      this.types = data.types;

    });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.subLocationModal.onClose.subscribe(() => this.onSubLocationModalClosed());
  }

  get type(): FormControl {
    return this.form.get('type') as FormControl;
  }

  get warehouseId(): FormControl {
    return this.form.get('warehouseId') as FormControl;
  }

  get location(): FormGroup {
    return this.form.get('location') as FormGroup;
  }

  get location_href(): FormControl {
    return this.location.get('href') as FormControl;
  }

  initializeForm(entity?: IWarehouseMapping) {
    this.form = this.fb.group({
      type: [entity?.type, [Validators.required]],
      href: [entity?.href, []],
      location: this.fb.group({
        href: [entity?.location?.href, []]
      }),
      warehouseId: [entity?.warehouseId, [Validators.required]]
    });
    this.selectedLocationValue = entity.location;
    this.location_href.setValue(this.selectedLocationValue.href);
  }

  selectSubLocation() {
    this.subLocationModal.open();
  }

  private onSubLocationModalClosed() {
    if (this.subLocationModal.result === DialogResult.OK) {
      this.selectedLocationValue = this.subLocationModal.subLocation.value as ISubLocation;
      this.location_href.setValue(this.selectedLocationValue.href);
    }
  }
  delete() {
    this.toast?.addMessage('Contact admin removing', 'info');
  }
}
