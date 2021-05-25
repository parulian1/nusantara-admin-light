import { Component, OnInit } from '@angular/core';
import {ReindexingService} from '@nusantara/pages/config/reindexing/reindexing.service';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';

@Component({
  selector: 'nus-reindexing',
  templateUrl: './reindexing.component.html',
  styleUrls: ['./reindexing.component.css']
})
export class ReindexingComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private reindexingService: ReindexingService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(data => {
      console.log(data);
      const slug = data.get('slug');
      switch (slug) {
        case 'product':
          this.reindexingService.doService().subscribe(res => {
            console.log(res);
          });
          break;
        case 'stock':
          this.reindexingService.reindexStock().subscribe(res => {
            console.log(res);
          });
          break;
        case 'reference':
          this.reindexingService.reindexReference().subscribe(res => {
            console.log(res);
          });
          break;
        case 'vendor':
          this.reindexingService.reindexVendor().subscribe(res => {
            console.log(res);
          });
          break;
        case 'category':
          this.reindexingService.reindexCategory().subscribe(res => {
            console.log(res);
          });
          break;

        case 'product-class':
          this.reindexingService.reindexProductClass().subscribe(res => {
            console.log(res);
          });
          break;

        case 'product-image':
          this.reindexingService.reindexProductImage().subscribe(res => {
            console.log(res);
          });
          break;
        case 'price-list':
          this.reindexingService.reindexPriceList().subscribe(res => {
            console.log(res);
          });
          break;
        case 'users':
          this.reindexingService.republishUsers().subscribe(res => {
            console.log(res);
          });
          break;
        case 'customer-group':
          this.reindexingService.republishCustomerGroup().subscribe(res => {
            console.log(res);
          });
          break;
      }
    });
  }

}
