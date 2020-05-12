import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nus-main-wrapper',
  template: `
    <header><h2>Nusantara Admin</h2></header>
    <nav>
      <ul>
        <li class="icon-button"><a [routerLink]="['/pages']" translate><i class="material-icons">dashboard</i>Dashboard</a></li>

        <li class="section-header"><i class="material-icons">store</i>Catalog Management</li>
        <li><a [routerLink]="['/catalog/products']" translate>Products</a></li>
        <li><a [routerLink]="['/catalog/categories']" translate>Categories</a></li>
        <li><a [routerLink]="['/catalog/product-classes']" translate>Product Classes</a></li>

        <li class="section-header"><i class="material-icons">local_offer</i>Promotion Management</li>

        <li class="section-header"><i class="material-icons">shopping_cart</i> Order Fulfillment</li>
        <li>Orders</li>

        <li class="section-header"><i class="material-icons">people</i>Customers and Users</li>
        <li><a [routerLink]="['/users']" translate>Users</a></li>

        <li class="section-header" translate><i class="material-icons">assessment</i>Reports</li>


        <li translate class="icon-button"><a [routerLink]="['/config']"><i class="material-icons">settings</i>Config</a></li>

      </ul>
    </nav>

    <div id="dashboard-content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    ':host { display: grid; grid-template-columns: 250px auto; grid-template-rows: 65px auto; min-height: 100vh; }',
    'header { grid-row: 1; grid-column: 1/3; background: black; color: white; }',
    'nav { grid-row: 2; grid-column: 1; background: black; color: white; }',
    'nav > ul { padding: 0; list-style-type: none; }',
    'nav li { height: 35px; line-height: 35px; }',
    'nav li.section-header { font-weight: 900; padding-left: 0; }',
    'nav li.icon-button a { padding-left: 0; }',
    'nav > ul a { color: white; text-decoration: underline; display: block; padding-left: 25px; text-decoration: none; }',
    `nav > ul a:hover, nav > ul a:focus {
      transition: background-color .3s;
      background-color: gray;
    }`,
    '#dashboard-content { margin: 15px; }',
    '#pages-content { grid-column: 2; grid-row: 2; margin: 5px;}',
],
})
export class MainWrapperComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}


