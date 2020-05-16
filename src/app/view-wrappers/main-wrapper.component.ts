import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nus-main-wrapper',
  template: `
    <header>
      <img src="/assets/bhisma-logo.png" alt="logo" id="brand-icon">
      <ul>
        <li>
          <a [routerLink]="['/auth/logout']">Logout</a>
        </li>
      </ul>
    </header>
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
        <li><a [routerLink]="['/promotion/promos']" translate>Promos</a></li>
        <li><a [routerLink]="['/promotion/vouchers']" translate>Vouchers</a></li>
        <li><a [routerLink]="['/promotion/widgets']" translate>Widgets</a></li>

        <li class="section-header">
          <i class="material-icons">shopping_cart</i>
          <span>Order Fulfillment</span>
        </li>
        <li><a [routerLink]="['/fulfillment/orders']" translate>Orders</a></li>

        <li class="section-header">
          <i class="material-icons">people</i>
          <span>Customers and Users</span>
        </li>
        <li><a [routerLink]="['/users/customer']" translate>Customers</a></li>
        <li><a [routerLink]="['/users/customer-groups']" translate>Customer Groups</a></li>

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
      background: var(--nav-background);
      color: white;
    }
    #brand-icon {
      grid-row: 1;
      grid-column: 1;
      max-width: 250px;
      padding: 10px 15px 0 5px;
      box-sizing: border-box;
    }
    header > ul {
      grid-row: 1;
      grid-column: 2
    }

    nav {
      grid-row: 2;
      grid-column: 1;
      background: var(--nav-background);
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
        display: flex;
      }
      .icon-button i {
        line-height: 35px;
      }

      nav > ul a {
        color: white;
        display: block;
        padding-left: 25px;
        text-decoration: none;
      }

      nav > ul a.active {
        background-color: #7B869B;
        border-left: 6px solid var(--bhisma-orange);
      }

      nav > ul a:hover,
      nav > ul a:focus {
        transition: all .3s;
        border-left: 6px solid var(--bhisma-orange);
        background-color: #7B869B; /*var(--accent-lighter-color);*/
      }


    `],
})
export class MainWrapperComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}


