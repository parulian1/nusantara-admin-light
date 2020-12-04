import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AbstractListComponent, PagedResponse} from '@nusantara/core';
import {drf, ICategory, IOrder, IVendor, products} from '@nusantara/models';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'nus-order-list',
  templateUrl: './order-list.html',
  styles: []
})
export class OrderListComponent extends AbstractListComponent<IOrder> implements OnInit{

  orderStatuses: Array<drf.IChoice>;
  form: FormGroup;
  timeoutId: any;
  reloadTimeout = 650;
  filterParams: {
    status: string,
  } = {
    status: ''
  };

  constructor(public route: ActivatedRoute, public router: Router) { super(route); }

  ngOnInit(): void {
    this.route.data.subscribe((
      data: { page: PagedResponse<IOrder>, orderType: drf.IChoice[], orderStatus: drf.IChoice[]}) => {
      this.page = data.page;
      this.orderStatuses = data.orderStatus;
      const theQuery = this.route.queryParams;
    });

    this.route.queryParams.subscribe((queryParam: any) => {
      this.filterParams.status = queryParam.status || '';

    });

    super.ngOnInit();
  }

  public onStatusChanged(event) {

    this.timeoutId = setTimeout(() => {
      // wait to see if the user is still typing more before navigating
      const params = {status: event.target.value};
      this.router.navigate(
        ['.'],
        {
          queryParams: params,
          relativeTo: this.route
        }
      );
    }, this.reloadTimeout);

  }
}
