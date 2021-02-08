import { Component, Input, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'nus-include-inactive',
  template: `
    <label>
      <input type="checkbox" (click)="applyFilter($event)">{{ text }}
    </label>
  `,
  styles: [
    'label { min-height: auto; padding-bottom: 0; }',
    ':host { padding-right: 20px }'
  ]
})
export class IncludeInactiveComponent implements OnInit {
  public applied = false;
  @Input() text = "Show InActive";

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
