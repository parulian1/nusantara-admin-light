import { Component, OnInit } from '@angular/core';
import { AuthService } from '@nusantara/auth';

@Component({
  selector: 'nus-main-wrapper',
  template: `
    <header>
      <div id="branding">
        <img src="/assets/bhisma-logo.png" alt="logo" id="brand-icon">
        <div>{{ authService.siteDomain }}</div>
      </div>

      <div class="dropdown">
        <button class="dropbtn">
          <img src="/assets/default-profile-img.svg" alt="Profile Image">
          {{ userDisplayName }}
        </button>
        <div class="dropdown-content">
          <a [routerLink]="['/auth/logout']"><i class="material-icons">exit_to_app</i>Logout</a>
        </div>
      </div>

    </header>
    <nav>
      <ul>
        <li class="icon-button">
          <a [routerLink]="['/dashboard']" routerLinkActive="active">
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
        <li><a [routerLink]="['/promotion/promos']" routerLinkActive="active" translate>Promos</a></li>
        <li><a [routerLink]="['/promotion/vouchers']" routerLinkActive="active" translate>Vouchers</a></li>

        <li class="section-header">
          <i class="material-icons">edit</i>
          <span>CMS</span>
        </li>
        <li><a [routerLink]="['/cms/widgets']" routerLinkActive="active" translate>Widgets</a></li>
        <li><a [routerLink]="['/cms/flat-pages']" routerLinkActive="active">Pages</a></li>

        <li class="section-header">
          <i class="material-icons">shopping_cart</i>
          <span>Order Fulfillment</span>
        </li>
        <li><a [routerLink]="['/fulfillment/orders']" routerLinkActive="active" translate>Orders</a></li>

        <li class="section-header">
          <i class="material-icons">people</i>
          <span>Customers and Users</span>
        </li>
        <li><a [routerLink]="['/users/customer']" routerLinkActive="active" translate>Customers</a></li>
        <li><a [routerLink]="['/users/customer-groups']" routerLinkActive="active" translate>Customer Groups</a></li>

<!--        <li class="section-header" translate><i class="material-icons">assessment</i>Reports</li>-->
<!--        <li><a [routerLink]="[]"></a></li>-->

        <li class="icon-button">
          <a [routerLink]="['/config']" routerLinkActive="active">
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

      /* Style The Dropdown Button */
      .dropbtn {
        /*background-color: #4CAF50;*/
        background: transparent;
        color: white;
        /*padding: 16px;*/
        padding: 0;
        padding-left: 25px;
        padding-right: 40px;
        height: 65px;
        /*font-size: 16px;*/
        border: none;
        font-size: 20px;
        font-weight: lighter;
        font-family: Roboto, "Helvetica Neue", sans-serif;
        cursor: pointer;
        display: flex;
        line-height: 65px;
      }
      .dropbtn img {
        height: 45px;
        padding-top: 7px;
        margin-right: 18px;
      }

      /* The container <div> - needed to position the dropdown content */
      .dropdown {
        position: relative;
        display: inline-block;
      }

      /* Dropdown Content (Hidden by Default) */
      .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 160px;
        width: 100%;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
      }

      /* Links inside the dropdown */
      .dropdown-content a {
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
      }

      /* Change color of dropdown links on hover */
      .dropdown-content a:hover {background-color: #f1f1f1}

      /* Show the dropdown menu on hover */
      .dropdown:hover .dropdown-content {
        display: block;
      }

      /* Change the background color of the dropdown button when the dropdown content is shown */
      .dropdown:hover .dropbtn {
        background-color: var(--lighter-nav-bg);
      }



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
      display: flex;
    }
    #branding {
      grid-row: 1;
      grid-column: 1;
      max-width: 250px;
      padding: 15px 15px 10px 5px;
      box-sizing: border-box;
      font-weight: bold;
      text-align: center;
      width: 100%;
    }
    #branding img {
      height: 20px;
    }
    header > ul {
      grid-row: 1;
      grid-column: 2
    }
    header > :last-child {
      margin-left: auto;
      margin-top: 0;
      margin-bottom: 0;
      list-style-type: none;
    }

    #current-user {

    }
    #current-user img {
      height: 45px;
      width: 45px;
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

  constructor(public authService: AuthService) { }

  /**
   * Returns the user's own name that should be displayed to them.
   */
  get userDisplayName(): string {
    if (!!this.authService.tokenPayload.first_name) {
      return this.authService.tokenPayload.first_name;
    } else if (!!this.authService.tokenPayload.last_name) {
      return this.authService.tokenPayload.last_name;
    } else if (!!this.authService.tokenPayload.email) {
      return this.authService.tokenPayload.email;
    } else {
      // this should more-or-less never occur, but if the user's email address
      // hasn't been set, we're just going to return something.
      return 'User';
    }
  }

  /**
   * Returns the profile image url
   */
  get profileImage(): string {
    return '/assets/default-profile-img.svg';
  }

  get currentSiteName(): string {
    return 'marthatilaarshop.com';
  }

  ngOnInit(): void {
  }
}


