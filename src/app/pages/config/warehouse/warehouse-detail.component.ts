import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nus-warehouse-detail',
  template: `
    <div class="container">
<!--      <app-warehouse-menu [active]="active" [slug]="slug" [subLocation]="warehouse"></app-warehouse-menu>-->
<!--      <div class="add-form">-->
<!--        <form [formGroup]="warehouseForm">-->
<!--          <div class="left-form">-->
<!--            <h3>Basics</h3>-->
<!--            <div class="label-form" [ngClass]="{'has-error': name.invalid && (name.dirty || name.touched)}">-->
<!--              <label>-->
<!--                Name-->
<!--              </label>-->
<!--            </div>-->
<!--            <div class="input-form" [ngClass]="{'has-error': name.invalid && (name.dirty || name.touched)}">-->
<!--              <input [(ngModel)]="warehouse.name" type="text" formControlName="name" required>-->
<!--            </div>-->
<!--            <div *ngIf="name.invalid && (name.dirty || name.touched)" class="form-alert">-->
<!--              <p>Mohon masukkan nama warehouse dengan benar</p>-->
<!--            </div>-->

<!--            <div class="label-form" [ngClass]="{'has-error': code.invalid && (code.dirty || code.touched)}">-->
<!--              <label>-->
<!--                Code-->
<!--              </label>-->
<!--            </div>-->
<!--            <div class="input-form" [ngClass]="{'has-error': code.invalid && (code.dirty || code.touched)}">-->
<!--              <input [(ngModel)]="warehouse.code" type="text" formControlName="code" required>-->
<!--            </div>-->
<!--            <div *ngIf="code.invalid && (code.dirty || code.touched)" class="form-alert">-->
<!--              <p>Mohon masukkan code warehouse dengan benar</p>-->
<!--            </div>-->

<!--            <div class="label-form" [ngClass]="{'has-error': type.invalid && (type.dirty || type.touched)}">-->
<!--              <label>-->
<!--                Type-->
<!--              </label>-->
<!--            </div>-->
<!--            <div class="input-form" [ngClass]="{'has-error': type.invalid && (type.dirty || type.touched)}">-->
<!--              <select [(ngModel)]="warehouse.type" formControlName="type" required>-->
<!--                <option value="permanent">Permanent</option>-->
<!--                <option value="pop-up">Pop-Up</option>-->
<!--              </select>-->
<!--            </div>-->
<!--            <div *ngIf="type.invalid && (type.dirty || type.touched)" class="form-alert">-->
<!--              <p>Mohon masukkan type warehouse dengan benar</p>-->
<!--            </div>-->

<!--            <div class="label-form"-->
<!--                 [ngClass]="{'has-error': internal_notes.invalid && (internal_notes.dirty || internal_notes.touched)}">-->
<!--              <label>-->
<!--                Internal Notes-->
<!--              </label>-->
<!--            </div>-->
<!--            <div class="input-form"-->
<!--                 [ngClass]="{'has-error': internal_notes.invalid && (internal_notes.dirty || internal_notes.touched)}">-->
<!--              &lt;!&ndash;          <input [(ngModel)]="warehouse.internal_notes" type="text" formControlName="internal_notes" required>&ndash;&gt;-->
<!--              <textarea [(ngModel)]="warehouse.internal_notes" formControlName="internal_notes"></textarea>-->
<!--            </div>-->
<!--            <div *ngIf="internal_notes.invalid && (internal_notes.dirty || internal_notes.touched)" class="form-alert">-->
<!--              <p>Mohon masukkan internal notes dengan benar</p>-->
<!--            </div>-->


<!--          </div>-->
<!--          <div class="right-form">-->
<!--            <h3>Location</h3>-->

<!--            <div #googleMap class="map"></div>-->

<!--            <div class="label-form" [ngClass]="{'has-error': address.invalid && (address.dirty || address.touched)}">-->
<!--              <label>-->
<!--                Address-->
<!--              </label>-->
<!--            </div>-->
<!--            <div class="input-form" [ngClass]="{'has-error': address.invalid && (address.dirty || address.touched)}">-->
<!--              <input [(ngModel)]="warehouse.address" type="text" id="searchAddress" formControlName="address" required>-->
<!--            </div>-->
<!--            <div *ngIf="address.invalid && (address.dirty || address.touched)" class="form-alert">-->
<!--              <p>Mohon masukkan address warehouse dengan benar</p>-->
<!--            </div>-->

<!--            <div class="label-form"-->
<!--                 [ngClass]="{'has-error': address_notes.invalid && (address_notes.dirty || address_notes.touched)}">-->
<!--              <label>-->
<!--                Address Notes-->
<!--              </label>-->
<!--            </div>-->
<!--            <div class="input-form"-->
<!--                 [ngClass]="{'has-error': address_notes.invalid && (address_notes.dirty || address_notes.touched)}">-->
<!--              <input [(ngModel)]="warehouse.address_notes" type="text" formControlName="address_notes" required>-->
<!--            </div>-->
<!--            <div *ngIf="address_notes.invalid && (address_notes.dirty || address_notes.touched)" class="form-alert">-->
<!--              <p>Mohon masukkan address notes dengan benar</p>-->
<!--            </div>-->

<!--          </div>-->


<!--        </form>-->
<!--      </div>-->
<!--      <div class="btn-area">-->
<!--    <span class="left">-->
<!--      <button class="btn-primary btn-save" type="submit" (click)="updateWarehouse()" [disabled]="isButtonDisabled">Save</button>-->
<!--      <button class="btn-primary btn-cancel" [routerLink]="['/warehouses']" type="submit">Cancel</button>-->
<!--    </span>-->
<!--        <span class="right">-->
<!--      <button class="btn-primary btn-delete" type="submit" (click)="deleteWarehouse()">Delete</button>-->
<!--    </span>-->

<!--      </div>-->


<!--    </div>-->


  `,
  styles: [``]
})
export class WarehouseDetailComponent {
  // @ViewChild('googleMap', {static: false}) gmapElement: any;
  // @Output()
  // public status = new EventEmitter<any>();
  // @Output()
  // public latitude = new EventEmitter<any>();
  // @Output()
  // public longitude = new EventEmitter<any>();
  //
  // warehouseData: HttpResponse<Warehouse>;
  // warehouse: Warehouse = new Warehouse();
  // loadMap: any;
  // slug: string;
  // window: any = window;
  // map: google.maps.Map;
  // @Input()
  // location: any = {
  //   zipcode: '',
  //   city: '',
  //   district: '',
  //   lat: null,
  //   lng: null
  // };
  // infoMap: string;
  // public isButtonDisabled: boolean;
  // public warehouseForm: FormGroup;
  // public active = 'all';
  //
  // constructor(private warehouseService: WarehouseService,
  //             private route: ActivatedRoute,
  //             private router: Router,
  //             private fb: FormBuilder) {
  //   this.loadGoogleMapApi();
  // }
  //
  // ngOnInit() {
  //   this.slug = this.route.snapshot.paramMap.get('slug');
  //   this.initForm();
  //
  //
  //   this.warehouseService.getSingleWarehouse(this.slug).subscribe(res => {
  //     this.warehouseData = res;
  //
  //     this.warehouseForm.patchValue({
  //       name: res.body.name,
  //       code: res.body.code,
  //       address: res.body.address.street,
  //       internal_notes: res.body.internalNotes,
  //       address_notes: res.body.address.addressNotes,
  //       type: res.body.type
  //     });
  //   });
  //
  //   this.loadGoogleMapApi();
  //   this.loadMap = setTimeout(() => {
  //     if (typeof this.window.google === 'object' && typeof this.window.google.maps === 'object') {
  //       this.setMap();
  //     } else {
  //       this.status.emit('Gagal terhubung dengan Google Maps.');
  //     }
  //   }, 1000);
  // }
  //
  // ngDoCheck(): void {
  //   this.isButtonDisabled = !this.warehouseForm.valid;
  // }
  //
  //
  // loadGoogleMapApi() {
  //   const googleMapSript = document.getElementById('google-map-script');
  //   if (!googleMapSript) {
  //     const newGoogleMapSript = document.createElement('script');
  //     newGoogleMapSript.setAttribute('id', 'google-map-script');
  //     newGoogleMapSript.setAttribute('src',
  //       'https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyC-ct8PW5TS3qNEG1lY0Q09PEr7RDwoLIM');
  //     document.head.appendChild(newGoogleMapSript);
  //   }
  // }
  //
  // setMap() {
  //   const mapProp = {
  //     center: new google.maps.LatLng(-6.2097809, 106.7937499),
  //     zoom: 12,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP,
  //     disableDefaultUI: true
  //   };
  //
  //   this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  //   this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
  //     document.querySelector('.zoom-control'));
  //   // new google.maps.Marker({position:{lat: -6.2097809, lng: 106.7937499}, map: this.map});
  //
  //   const searchInput = document.getElementById('searchAddress');
  //   const searchOpt = {
  //     componentRestrictions: {country: 'id'}
  //   };
  //
  //   new google.maps.places.Autocomplete(searchInput, searchOpt);
  // }
  //
  // get name() {
  //   return this.warehouseForm.get('name');
  // }
  //
  // get code() {
  //   return this.warehouseForm.get('code');
  // }
  //
  // get address() {
  //   return this.warehouseForm.get('address');
  // }
  //
  // get internal_notes() {
  //   return this.warehouseForm.get('internal_notes');
  // }
  //
  // get address_notes() {
  //   return this.warehouseForm.get('address_notes');
  // }
  //
  // get type() {
  //   return this.warehouseForm.get('type');
  // }
  //
  // initForm() {
  //   this.isButtonDisabled = true;
  //   this.warehouseForm = new FormGroup({
  //     name: new FormControl('', Validators.required),
  //     code: new FormControl('', Validators.required),
  //     address: new FormControl('', Validators.required),
  //     internal_notes: new FormControl('', Validators.required),
  //     address_notes: new FormControl('', Validators.required),
  //     type: new FormControl('', Validators.required),
  //   });
  // }
  //
  // updateWarehouse() {
  //   const payload: Warehouse = {
  //     name: this.warehouse.name,
  //     code: this.warehouse.code,
  //     address: this.warehouse.address,
  //     internal_notes: this.warehouse.internal_notes,
  //     address_notes: this.warehouse.address_notes,
  //     type: this.warehouse.type,
  //   };
  //
  //   // console.log('payload', payload);
  //
  //   this.warehouseService.updateWarehouse(payload, this.slug).subscribe(res => {
  //     this.router.navigateByUrl('/warehouses');
  //   });
  // }
  //
  // deleteWarehouse() {
  //   this.warehouseService.deleteWarehouse(this.slug).subscribe(res => {
  //     this.router.navigateByUrl('/warehouses');
  //   });
  //
  // }

}

