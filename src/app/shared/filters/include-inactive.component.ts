import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'nus-include-inactive',
  template: `
    <label>Show InActive<input type="checkbox" (click)="applyFilter($event)"></label>
  `,
  styles: [`label {
    min-height: auto;
  }`
  ]
})
export class IncludeInactiveComponent implements OnInit {
  public applied = false;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((queryParam: any) => {
      this.applied = !!queryParam.include_inactive && queryParam.include_inactive === true  || false;
    });

  }

  applyFilter(event: any) {
    const params = {include_inactive: event.target.checked };
    this.router.navigate(
      ['./'],
      {
        queryParams: params,
        queryParamsHandling: 'merge',
        relativeTo: this.activatedRoute
      });
  }

}
