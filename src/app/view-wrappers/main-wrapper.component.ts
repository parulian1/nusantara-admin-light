import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService, RequireIsEnterpriseGuard } from '@nusantara/auth';
import { slideInAnimation } from '@nusantara/route-animations';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { SubscriptionLike } from 'rxjs';
import { RequirePermissionGuard } from '@nusantara/auth/guards/require-permission.guard';
import { Logger } from '@nusantara/core';

const logger = new Logger('MainWrapperComponent');

@Component({
  selector: 'nus-main-wrapper',
  template: `
    <header class="main-header">
      <div id="branding">
        <img src="assets/bhisma-logo.png" alt="logo" id="brand-icon">
        <div>{{ authService?.siteDomain }}</div>
      </div>

      <div class="dropdown">
        <button class="dropbtn">
          <img src="assets/default-profile-img.svg" alt="Profile Image">
          {{ authService?.tokenPayload | getUserDisplayName }}
        </button>
        <div class="dropdown-content">
          <a [routerLink]="['/auth/logout']" i18n><i class="material-icons">exit_to_app</i>Logout</a>
        </div>
      </div>
    </header>

    <nav class="side-nav">
      <ul>
        <li class="icon-button dropshow section-header" routerLinkActive="active">
          <a [routerLink]="['/dashboard']" routerLinkActive="active">
            <i class="material-icons">dashboard</i>
            <span translate i18n>Dashboard</span>
          </a>
        </li>

        <li class="section-header" *ngIf="permissionGuard.canActivate(null, null, 'catalog')"
            [class.dropdown-show]="activeMenu.indexOf('catalog')>-1 "
             routerLinkActive="active router-dropdown-show" [routerLinkActiveOptions]="{exact: false}">
          <span (click)="menuToggler('catalog')">
              <i class="material-icons">store</i>
              <span i18n>Catalog Management</span>
              <i class="material-icons expand-icon"></i>
          </span>
          <ul class="section-child">
            <li routerLinkActive="active">
              <a [routerLink]="['/catalog/products']" routerLinkActive="active" translate i18n>Products</a>
            </li>
            <li routerLinkActive="active">
              <a [routerLink]="['/catalog/advanced-price']" routerLinkActive="active" translate i18n>Advanced Price
                List</a>
            </li>
            <li routerLinkActive="active">
              <a [routerLink]="['/catalog/categories']" routerLinkActive="active" translate i18n>Categories</a>
            </li>
            <li routerLinkActive="active" *ngIf="enterpriseGuard.canActivate(null, null)">
              <a [routerLink]="['/catalog/product-options']" routerLinkActive="active" translate i18n>Product Options
              </a>
            </li>
            <li routerLinkActive="active">
              <a [routerLink]="['/catalog/product-classes']" routerLinkActive="active" translate i18n>Product
                Classes</a>
            </li>
            <li routerLinkActive="active">
              <a [routerLink]="['/catalog/vendors']" routerLinkActive="active" translate i18n>Vendors</a>
            </li>
          </ul>
        </li>

        <li class="section-header"
            *ngIf="enterpriseGuard.canActivate(null, null) && permissionGuard.canActivate(null, null, 'inventory')"
            [class.dropdown-show]="activeMenu.indexOf('inventory')>-1 "
            routerLinkActive="active router-dropdown-show" [routerLinkActiveOptions]="{exact: false}">
          <span (click)="menuToggler('inventory')">
            <i class="material-icons">assignment</i>
            <span i18n>Inventory Management</span>
            <i class="material-icons expand-icon"></i>
            </span>
          <ul class="section-child">
            <li *ngIf="enterpriseGuard.canActivate(null, null)" routerLinkActive="active"
            >
              <a [routerLink]="['/inventory/orders-list']" routerLinkActive="active" translate i18n>Pending Orders</a>
            </li>
            <li *ngIf="enterpriseGuard.canActivate(null, null)"
                routerLinkActive="active">
              <a [routerLink]="['/inventory/receiving']" routerLinkActive="active" translate i18n>Delivery
                (Receiving)</a>
            </li>
            <li *ngIf="enterpriseGuard.canActivate(null, null)"
                routerLinkActive="active">
              <a [routerLink]="['/inventory/adjustment']" routerLinkActive="active" translate i18n>Stock Adjustment</a>
            </li>
            <li *ngIf="enterpriseGuard.canActivate(null, null)" routerLinkActive="active"
            >
              <a [routerLink]="['/inventory/transfer-order']" routerLinkActive="active" translate i18n>Transfer</a>
            </li>
          </ul>
        </li>

        <li class="section-header" *ngIf="permissionGuard.canActivate(null, null, 'promotions')"
            [class.dropdown-show]="activeMenu.indexOf('promotions')>-1 "
             routerLinkActive="active router-dropdown-show" [routerLinkActiveOptions]="{exact: false}">
          <span (click)="menuToggler('promotions')">
          <i class="material-icons">local_offer</i>
          <span i18n>Promotion Management</span>
          <i class="material-icons expand-icon"></i>
            </span>
          <ul class="section-child">
            <li routerLinkActive="active" class="promotions">
              <a id="promotions" [routerLink]="['/promotion/promo/campaign']"
                 routerLinkActive="active" translate i18n>
                Promos
              </a>
            </li>
            <li routerLinkActive="active">
              <a [routerLink]="['/promotion/vouchers']" routerLinkActive="active" translate i18n>Vouchers</a>
            </li>
            <li *ngIf="enterpriseGuard.canActivate(null, null)" routerLinkActive="active"
            >
              <a [routerLink]="['/promotion/points']" routerLinkActive="active" translate i18n>Points</a>
            </li>
            <li *ngIf="enterpriseGuard.canActivate(null, null)" routerLinkActive="active"
            >
              <a [routerLink]="['/promotion/gift-voucher']" routerLinkActive="active" translate i18n>
                Gift Vouchers
              </a>
            </li>
          </ul>
        </li>

        <li class="section-header" *ngIf="permissionGuard.canActivate(null, null, 'cms')"
            [class.dropdown-show]="activeMenu.indexOf('cms')>-1 "
             routerLinkActive="active router-dropdown-show" [routerLinkActiveOptions]="{exact: false}">
          <span (click)="menuToggler('cms')">
          <i class="material-icons">edit</i>
          <span i18n>CMS</span>
          <i class="material-icons expand-icon"></i>
            </span>
          <ul class="section-child">
            <!--        <li><a [routerLink]="['/cms/widgets']" routerLinkActive="active" translate>Widgets</a></li>-->
            <li routerLinkActive="active">
              <a [routerLink]="['/cms/banners']" routerLinkActive="active" i18n>Banners</a>
            </li>
            <li routerLinkActive="active">
              <a [routerLink]="['/cms/testimonials']" routerLinkActive="active" i18n>Testimonials</a>
            </li>
            <li routerLinkActive="active">
              <a [routerLink]="['/cms/flat-pages']" routerLinkActive="active" i18n>Pages</a>
            </li>
            <li routerLinkActive="active">
              <a [routerLink]="['/cms/navigation']" routerLinkActive="active" i18n>Header Navigation</a>
            </li>
            <li routerLinkActive="active">
              <a [routerLink]="['/cms/content-footers']" routerLinkActive="active" i18n>Content Footers</a>
            </li>
            <li routerLinkActive="active">
              <a [routerLink]="['/cms/highlights']" routerLinkActive="active" i18n>Highlights</a>
            </li>
            <li routerLinkActive="active">
              <a [routerLink]="['/cms/sla']" routerLinkActive="active" i18n>SLA</a>
            </li>
            <li *ngIf="enterpriseGuard.canActivate(null, null)" routerLinkActive="active"
            >
              <a [routerLink]="['/cms/video-integration']" routerLinkActive="active" i18n>Video Integration</a>
            </li>
            <li *ngIf="enterpriseGuard.canActivate(null, null)">
              <a [routerLink]="['/cms/onboardingcontent']" routerLinkActive="active" i18n>Onboarding</a>
            </li>
            <li *ngIf="enterpriseGuard.canActivate(null, null)">
              <a [routerLink]="['/cms/company-story']" routerLinkActive="active" i18n>Company Story</a>
            </li>
            <li *ngIf="enterpriseGuard.canActivate(null, null)">
              <a [routerLink]="['/cms/catalogue']" routerLinkActive="active" i18n>Reseller Catalogs</a>
            </li>
          </ul>
        </li>

        <li class="section-header" *ngIf="permissionGuard.canActivate(null, null, 'fulfillment')"
            [class.dropdown-show]="activeMenu.indexOf('fulfillment')>-1 "
             routerLinkActive="active router-dropdown-show" [routerLinkActiveOptions]="{exact: false}">
          <span (click)="menuToggler('fulfillment')">
          <i class="material-icons">shopping_cart</i>
          <span i18n>Order Fulfillment</span>
          <i class="material-icons expand-icon"></i>
            </span>
          <ul class="section-child">
            <li routerLinkActive="active">
              <a [routerLink]="['/fulfillment/orders']" routerLinkActive="active" translate i18n>Orders</a>
            </li>
          </ul>
        </li>

        <li class="section-header" *ngIf="permissionGuard.canActivate(null, null, 'users')"
            [class.dropdown-show]="activeMenu.indexOf('users')>-1 "
             routerLinkActive="active router-dropdown-show" [routerLinkActiveOptions]="{exact: false}">
          <span (click)="menuToggler('users')">
          <i class="material-icons">people</i>
          <span i18n>Customers and Users</span>
          <i class="material-icons expand-icon"></i>
            </span>
          <ul class="section-child">
            <li routerLinkActive="active">
              <a [routerLink]="['/users/customer']" routerLinkActive="active" translate i18n>Customers</a>
            </li>
            <li *ngIf="enterpriseGuard.canActivate(null, null)" routerLinkActive="active"
            >
              <a [routerLink]="['/users/customer-groups']" routerLinkActive="active" translate i18n>Customer Groups</a>
            </li>
            <li routerLinkActive="active">
              <a [routerLink]="['/users/employee']" routerLinkActive="active" translate i18n>Employees</a>
            </li>
          </ul>
        </li>

        <li class="section-header" *ngIf="permissionGuard.canActivate(null, null, 'reports')"  [class.dropdown-show]="activeMenu.indexOf('reports')>-1 " routerLinkActive="active router-dropdown-show" [routerLinkActiveOptions]="{exact: false}">
          <span (click)="menuToggler('reports')">
            <i class="material-icons">assessment</i>
            <span i18n>Reports</span>
            <i class="material-icons expand-icon"></i>
          </span>
          <ul class="section-child">
            <li routerLinkActive="active">
              <a [routerLink]="['/reports/low-stock-products']" routerLinkActive="active" i18n>Low Stock</a>
            </li>
            <li *ngIf="enterpriseGuard.canActivate(null, null)" routerLinkActive="active">
              <a routerLinkActive="active" class="icon-link" href="https://reports.bhisma.cloud" target="_blank">
                <span i18n>Other</span><i class="material-icons">open_in_new</i>
              </a>
            </li>
          </ul>
        </li>

        <li class="section-header" *ngIf="permissionGuard.canActivate(null, null, 'config')"
            [class.dropdown-show]="activeMenu.indexOf('config')>-1 "
             routerLinkActive="active router-dropdown-show" [routerLinkActiveOptions]="{exact: false}">
          <span (click)="menuToggler('config')">
          <i class="material-icons">settings</i>
          <span i18n>Config</span>
          <i class="material-icons expand-icon"></i>
            </span>
          <ul class="section-child">
            <li routerLinkActive="active">
              <a [routerLink]="['/config/website-settings']" routerLinkActive="active" i18n>Website Settings</a>
            </li>
            <li *ngIf="enterpriseGuard.canActivate(null, null)" routerLinkActive="active"
            >
              <a [routerLink]="['/config/marketplace-integration']" routerLinkActive="active" i18n>Marketplace
                Integration</a>
            </li>
            <li *ngIf="enterpriseGuard.canActivate(null, null)" routerLinkActive="active"
            >
              <a [routerLink]="['/config/external-integration']" routerLinkActive="active" i18n>External Integration</a>
            </li>
            <li *ngIf="enterpriseGuard.canActivate(null, null)" routerLinkActive="active"
            >
              <a [routerLink]="['/config/pos-integration']" routerLinkActive="active" i18n>POS Integration</a>
            </li>
            <li routerLinkActive="active">
              <a [routerLink]="['/config/general-settings']" routerLinkActive="active" i18n>General</a>
            </li>

            <!-- <li class="section-header">
              <i class="material-icons">palette</i>
              <span>Theme Management</span>
            </li>
            <li><a [routerLink]="['/theme']" routerLinkActive="active" translate>Theme</a></li> -->
          </ul>
        </li>

      </ul>
    </nav>
    <div id="dashboard-content">

      <nus-spinner [appBusy]="isBusy"></nus-spinner>

      <div [@routeAnimations]="o && o.activatedRouteData && o.activatedRouteData['animation']">
        <router-outlet #o="outlet"></router-outlet>
      </div>

    </div>

    <footer class="main-footer">
      <nus-copyright-notice></nus-copyright-notice>
    </footer>
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

      nus-spinner {
        position: absolute;
        top: 15px;
        right: 15px;
        margin: 0;
      }

      nav {
        grid-row: 2/4;
        grid-column: 1;
        background: var(--nav-background);
        color: white;
      }

      #dashboard-content {
        padding: 16px 24px;
        position: relative;
        box-shadow: inset 4px 4px 8px -4px var(--shadow-color);
      }

      #pages-content {
        grid-column: 2;
        grid-row: 2;
        margin: 5px;
      }

      footer {
        grid-row: 3;
        grid-column: 2/3;
        align-self: flex-end;
        margin-bottom: 10px;
      }
    `,
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
        /*height: 35px;*/
        line-height: 35px;
      }

      nav li.section-header {
        font-weight: 900;
        /*display: flex;*/
      }

      nav li.section-header span {
        width: 100%;
      }

      nav li.section-header:hover {
        cursor: pointer;
      }

      nav li.section-header > span:hover {
        cursor: pointer;
        transition: all .3s;
        /*border-left: 6px solid var(--bhisma-orange);*/
        background-color: #7B869B;
        /*margin-right: 6px;*/
      }

      nav li.section-header i {
        line-height: 35px;
        height: 35px;
        margin-right: 5px;
      }

      nav li.section-header > span:hover i {
        /*padding-left: 10px;*/
      }

      nav li.section-header i {
        padding-left: 11px;
      }

      nav li.icon-button a {
        padding-left: 15px;
      }

      nav li.icon-button > a {
        padding-left: 0px;
      }

      nav li.section-header i.expand-icon {
        padding-left: 0;
        float: right;
      }

      nav li.icon-button a {
        font-weight: 900;
        display: flex;
      }

      .icon-button i {
        line-height: 35px;
        margin-right: 5px;
      }

      nav > ul a {
        color: white;
        display: block;
        text-decoration: none;
        padding-left: 46px;
      }

      nav > ul a.icon-link { display: flex; }

      /*nav > ul > li.active > span,*/
      nav > ul a.active {
        background-color: #7B869B;
      }

      nav > ul a.active i {

      }

      nav > ul li:not(.icon-button) a.active {
      }

      nav > ul li.icon-button a.active {
        /*padding-left: 19px;*/
      }

      nav > ul li.section-header.icon-button a.active {
      }

      nav > ul li.section-header a:hover i {

      }

      nav > ul a:hover,
      nav > ul a:focus {
        /*transition: all .3s;*/
        background-color: #7B869B;
      }

      nav > ul li.dropshow {
        display: initial;
      }

      nav li.section-header.dropdown-show:hover,
      nav li.section-header.router-dropdown-show:hover
      {
        cursor: pointer;
        border-left: none;
        /*background-color: #7B869B;*/
      }

      nav > ul li.section-header.router-dropdown-show > span:hover,
      nav > ul li.section-header.dropdown-show > span:hover {
        /*transition: all .3s;*/
        background-color: #7B869B;
      }

      nav > ul li.section-header > span {
        display: flex;
      }

      nav > ul li ul {
        display: none;
        list-style: none;
        padding-inline-start: 0;
        font-weight: normal;
      }

      nav > ul li.dropdown-show ul,
      nav > ul li.router-dropdown-show ul {
        display: block;
      }

      nav > ul li.section-header .expand-icon::before {
        content: "expand_more";
      }

      nav > ul li.section-header.dropdown-show .expand-icon::before,
      nav > ul li.section-header.router-dropdown-show .expand-icon::before {
        content: "expand_less";
      }

      nav > ul li.section-header span:hover .expand-icon {

      }

      nav > ul li.section-header a:hover {
      }

      nav li.section-header.active > a::before,
      nav li.section-header.active > span::before {
        content: " ";
        background-color: var(--bhisma-orange);
        width: 6px;
      }

      nav > ul > li.active > span::before,
      nav > ul a.active::before {
        /*content: " ";*/
        /*background-color: var(--bhisma-orange);*/
        /*width: 6px;*/
      }

      nav li.section-header.active > a > i,
      nav li.section-header.active > span > i {
        padding-left: 8px;
      }

      /*nav li ul > li:hover a::before {*/
      /*  content: " ";*/
      /*  background-color: var(--bhisma-orange);*/
      /*  width: 6px;*/
      /*}*/

      li ul li:hover, li ul li.active {
        border-left: 4px solid var(--bhisma-orange);
      }

      nav li ul > li:hover a,
      nav li ul > li.active a {
        padding-left: 42px;
      }

      @media print {
        :host {
          display: block;
          width: 100%;
        }

        header.main-header {
          display: none;
        }

        footer.main-footer {
          display: none;
        }

        #dashboard-content {
          width: 100%;
          box-shadow: none;
        }

      }
    `],
  animations: [slideInAnimation,],
})
export class MainWrapperComponent implements OnInit, OnDestroy {

  private routerEventsSub: SubscriptionLike;
  isBusy = false;
  activeMenu = [];

  constructor(public authService: AuthService,
              public router: Router,
              public enterpriseGuard: RequireIsEnterpriseGuard,
              public permissionGuard: RequirePermissionGuard) {

  }

  ngOnInit(): void {
    this.routerEventsSub = this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        this.onNavigationStarted();
      } else if (e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError) {
        this.onNavigationEnded();
      }
    });
  }

  ngOnDestroy() {
    if (!!this.routerEventsSub) {
      this.routerEventsSub.unsubscribe();
    }
  }

  onNavigationStarted() {
    window.scrollTo(0, 0);
    this.isBusy = true;
  }

  onNavigationEnded() {
    this.isBusy = false;
  }

  menuToggler($event: string) {
    // ($event.currentTarget as HTMLElement).parentElement.classList.toggle('dropdown-show');
    const idx = this.activeMenu.indexOf($event, 0);
    if (idx > -1) {
      this.activeMenu.splice(idx, 1);
    } else {
      this.activeMenu.push($event);
    }
    logger.debug(this.activeMenu);
  }

}


