import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nus-main-wrapper',
  template: `
    <header><h2>Nusantara Admin</h2></header>
    <nav>
      <ul>
        <li class="icon-button">
          <a [routerLink]="['/pages']" routerLinkActive="active">
            <i class="material-icons">dashboard</i>
            <span translate>Dashboard</span>
            </a>
        </li>

        <li class="section-header">
          <i class="material-icons">store</i>
          <span>Catalog Management</span>
        </li>
        <li><a [routerLink]="['/catalog/products']" routerLinkActive="active" translate>Products</a></li>
        <li><a [routerLink]="['/catalog/categories']" routerLinkActive="active" translate>Categories</a></li>
        <li><a [routerLink]="['/catalog/product-classes']" routerLinkActive="active" translate>Product Classes</a></li>
        <li><a [routerLink]="['/catalog/vendor']" routerLinkActive="active" translate>Vendors</a></li>

        <li class="section-header">
          <i class="material-icons">local_offer</i>
          <span>Promotion Management</span>
        </li>
        <li><a [routerLink]="['/promotion/promo']" translate>Promos</a></li>
        <li><a [routerLink]="['/promotion/voucher']" translate>Vouchers</a></li>
        <li><a [routerLink]="['/promotion/widget']" translate>Widgets</a></li>

        <li class="section-header">
          <i class="material-icons">shopping_cart</i>
          <span>Order Fulfillment</span>
        </li>
        <li><a [routerLink]="['/fulfillment/orders']" translate>Orders</a></li>

        <li class="section-header">
          <i class="material-icons">people</i>
          <span>Customers and Users</span>
        </li>
        <li><a [routerLink]="['/user/customer']" translate>Customers</a></li>
        <li><a [routerLink]="['/user/customer-group']" translate>Customer Groups</a></li>

<!--        <li class="section-header" translate><i class="material-icons">assessment</i>Reports</li>-->
<!--        <li><a [routerLink]="[]"></a></li>-->

        <li class="icon-button">
          <a [routerLink]="['/config']">
            <i class="material-icons">settings</i>
            <span translate>Config</span>
          </a>
        </li>

      </ul>
    </nav>

    <div id="dashboard-content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
    /*
     * Main Page Layout
     */
    :host {
      display: grid;
      grid-template-columns: 250px auto;
      grid-template-rows: 65px auto;
      min-height: 100vh;
    }
    header {
      grid-row: 1;
      grid-column: 1/3;
      background: black;
      color: white;
    }
    nav {
      grid-row: 2;
      grid-column: 1;
      background: black;
      color: white;
    }
    #dashboard-content {
      margin: 15px;
    }
    #pages-content {
      grid-column: 2;
      grid-row: 2;
      margin: 5px;
    }`,
    `
      /*
       * Sidebar Nav
       */
      nav > ul {
        padding: 0;
        list-style-type: none;
        margin: 0;
      }

      nav li {
        height: 35px;
        line-height: 35px;
      }

      nav li.section-header {
        font-weight: 900;
        padding-left: 0;
        display: flex;
      }

      nav li.section-header i {
        line-height: 35px;
        height: 35px;
        margin-right: 5px;
      }

      nav li.icon-button a {
        padding-left: 0;
      }

      nav > ul a {
        color: white;
        display: block;
        padding-left: 25px;
        text-decoration: none;
      }

      nav > ul a.active {
        background-color: var(--accent-color);
      }

      nav > ul a:hover,
      nav > ul a:focus {
        transition: background-color .3s;
        background-color: var(--accent-lighter-color);
      }


    `],
})
export class MainWrapperComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}


