import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService, RequireIsEnterpriseGuard } from '@nusantara/auth';
import { slideInAnimation } from '@nusantara/route-animations';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { SubscriptionLike } from 'rxjs';

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
          <img src="/assets/default-profile-img.svg" alt="Profile Image">
          {{ authService?.tokenPayload | getUserDisplayName }}
        </button>
        <div class="dropdown-content">
          <a [routerLink]="['/auth/logout']" i18n><i class="material-icons">exit_to_app</i>Logout</a>
        </div>
      </div>
    </header>

    <nav class="side-nav">
      <ul>
        <li class="icon-button">
          <a [routerLink]="['/dashboard']" routerLinkActive="active">
            <i class="material-icons">dashboard</i>
            <span translate i18n>Dashboard</span>
            </a>
        </li>

        <li class="section-header">
          <i class="material-icons">store</i>
          <span i18n>Catalog Management</span>
        </li>
        <li><a [routerLink]="['/catalog/products']" routerLinkActive="active" translate i18n>Products</a></li>
        <li><a [routerLink]="['/catalog/categories']" routerLinkActive="active" translate i18n>Categories</a></li>
        <li *ngIf="enterpriseGuard.canActivate(null, null)"><a [routerLink]="['/catalog/product-options']" routerLinkActive="active" translate i18n>Product Options</a></li>
        <li><a [routerLink]="['/catalog/product-classes']" routerLinkActive="active" translate i18n>Product Classes</a></li>
        <li><a [routerLink]="['/catalog/vendors']" routerLinkActive="active" translate i18n>Vendors</a></li>

        <li class="section-header" *ngIf="enterpriseGuard.canActivate(null, null)">
          <i class="material-icons">assignment</i>
          <span i18n>Inventory Management</span>
        </li>
        <li *ngIf="enterpriseGuard.canActivate(null, null)">
          <a [routerLink]="['/inventory/orders-list']" routerLinkActive="active" translate i18n>Pending Orders</a>
        </li>
        <li *ngIf="enterpriseGuard.canActivate(null, null)">
          <a [routerLink]="['/inventory/receiving']" routerLinkActive="active" translate i18n>Delivery (Receiving)</a>
        </li>
        <li *ngIf="enterpriseGuard.canActivate(null, null)">
          <a [routerLink]="['/inventory/adjustment']" routerLinkActive="active" translate i18n>Stock Adjustment</a>
        </li>
        <li *ngIf="enterpriseGuard.canActivate(null, null)">
          <a [routerLink]="['/inventory/transfer-order']" routerLinkActive="active" translate i18n>Transfer</a>
        </li>
<!--        <li><a [routerLink]="['/inventory/adjustment']" routerLinkActive="active" translate>Adjustment</a></li>-->

        <li class="section-header">
          <i class="material-icons">local_offer</i>
          <span i18n>Promotion Management</span>
        </li>
        <li><a [routerLink]="['/promotion/promos']" routerLinkActive="active" translate i18n>Promos</a></li>
        <li><a [routerLink]="['/promotion/vouchers']" routerLinkActive="active" translate i18n>Vouchers</a></li>
        <li *ngIf="enterpriseGuard.canActivate(null, null)"><a [routerLink]="['/promotion/points']" routerLinkActive="active" translate i18n>Points</a></li>
        <li *ngIf="enterpriseGuard.canActivate(null, null)"><a [routerLink]="['/promotion/gift-voucher']" routerLinkActive="active" translate i18n>Gift Vouchers</a></li>

        <li class="section-header">
          <i class="material-icons">edit</i>
          <span i18n>CMS</span>
        </li>
<!--        <li><a [routerLink]="['/cms/widgets']" routerLinkActive="active" translate>Widgets</a></li>-->
        <li><a [routerLink]="['/cms/banners']" routerLinkActive="active" i18n>Banners</a></li>
        <li><a [routerLink]="['/cms/testimonials']" routerLinkActive="active" i18n>Testimonials</a></li>
        <li><a [routerLink]="['/cms/flat-pages']" routerLinkActive="active" i18n>Pages</a></li>
        <li><a [routerLink]="['/cms/navigation']" routerLinkActive="active" i18n>Header Navigation</a></li>
        <li><a [routerLink]="['/cms/content-footers']" routerLinkActive="active" i18n>Content Footers</a></li>
        <li><a [routerLink]="['/cms/highlights']" routerLinkActive="active" i18n>Highlights</a></li>
        <li><a [routerLink]="['/cms/sla']" routerLinkActive="active" i18n>SLA</a></li>
        <li *ngIf="enterpriseGuard.canActivate(null, null)">
          <a [routerLink]="['/cms/video-integration']" routerLinkActive="active" i18n>Video Integration</a>
        </li>
        <li *ngIf="enterpriseGuard.canActivate(null, null)">
          <a [routerLink]="['/cms/onboardingcontent']" routerLinkActive="active" i18n>Onboarding</a>
        </li>
        <li *ngIf="enterpriseGuard.canActivate(null, null)">
          <a [routerLink]="['/cms/company-story']" routerLinkActive="active" i18n>Company Story</a>
        </li>


        <li class="section-header">
          <i class="material-icons">shopping_cart</i>
          <span i18n>Order Fulfillment</span>
        </li>
        <li><a [routerLink]="['/fulfillment/orders']" routerLinkActive="active" translate i18n>Orders</a></li>

        <li class="section-header">
          <i class="material-icons">people</i>
          <span i18n>Customers and Users</span>
        </li>
        <li><a [routerLink]="['/users/customer']" routerLinkActive="active" translate i18n>Customers</a></li>
        <li *ngIf="enterpriseGuard.canActivate(null, null)">
          <a [routerLink]="['/users/customer-groups']" routerLinkActive="active" translate i18n>Customer Groups</a>
        </li>
        <li><a [routerLink]="['/users/employee']" routerLinkActive="active" translate i18n>Employees</a></li>

        <li *ngIf="enterpriseGuard.canActivate(null, null)" class="icon-button" translate>
          <a href="https://reports.bhisma.cloud" target="_blank" i18n>
            <i class="material-icons">assessment</i>Reports
          </a>
        </li>

        <li class="section-header">
          <i class="material-icons">settings</i>
          <span i18n>Config</span>
        </li>
        <li><a [routerLink]="['/config/website-settings']" routerLinkActive="active" i18n>Website Settings</a></li>
        <li *ngIf="enterpriseGuard.canActivate(null, null)">
          <a [routerLink]="['/config/marketplace-integration']" routerLinkActive="active" i18n>Marketplace
            Integration</a>
        </li>
        <li *ngIf="enterpriseGuard.canActivate(null, null)">
          <a [routerLink]="['/config/pos-integration']" routerLinkActive="active" i18n>POS Integration</a>
        </li>
        <li><a [routerLink]="['/config/general-settings']" routerLinkActive="active" i18n>General</a></li>

        <!-- <li class="section-header">
          <i class="material-icons">palette</i>
          <span>Theme Management</span>
        </li>
        <li><a [routerLink]="['/theme']" routerLinkActive="active" translate>Theme</a></li> -->

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
        height: 35px;
        line-height: 35px;
      }
      nav li.section-header {
        font-weight: 900;
        display: flex;
      }
      nav li.section-header i {
        line-height: 35px;
        height: 35px;
        margin-right: 5px;
      }
      nav li.section-header i, nav li.icon-button a {
        padding-left: 25px;
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
        padding-left: 56px;
      }
      nav > ul a.active {
        background-color: #7B869B;
        border-left: 6px solid var(--secondary);
      }
      nav > ul li:not(.icon-button) a.active {
        padding-left: 50px;
      }
      nav > ul li.icon-button a.active {
        padding-left: 19px;
      }
      nav > ul a:hover,
      nav > ul a:focus {
        transition: all .3s;
        border-left: 6px solid var(--bhisma-orange);
        background-color: #7B869B;
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
  animations: [ slideInAnimation, ],
})
export class MainWrapperComponent implements OnInit, OnDestroy {

  private routerEventsSub: SubscriptionLike;
  isBusy = false;

  constructor(public authService: AuthService,
              public router: Router,
              public enterpriseGuard: RequireIsEnterpriseGuard) {

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

  get profileImage(): string { return '/assets/default-profile-img.svg'; }
  get currentSiteName(): string { return 'marthatilaarshop.com'; }

  onNavigationStarted() {
    window.scrollTo(0, 0);
    this.isBusy = true;
  }

  onNavigationEnded() {
    this.isBusy = false;
  }

}


