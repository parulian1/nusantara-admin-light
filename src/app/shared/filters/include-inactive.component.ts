import { Component, Input, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'nus-include-inactive',
  template: `
    <label>
      <mat-checkbox [ngModel]="showInactive" (ngModelChange)="applyFilter($event)">
        {{ text }}
      </mat-checkbox>
    </label>
  `,
  styles: [
    'label { min-height: auto; padding-bottom: 0; }',
    ':host { padding-right: 20px }'
  ]
})
export class IncludeInactiveComponent implements OnInit {
  showInactive = false;
  public applied = false;
  @Input() text = 'Show InActive';

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((queryParam: any) => {
      this.applied = !!queryParam.include_inactive && queryParam.include_inactive === true  || false;
    });

  }

  applyFilter(event: boolean) {
    const params = {include_inactive: event};
    this.router.navigate(
      ['./'],
      {
        queryParams: params,
        queryParamsHandling: 'merge',
        relativeTo: this.activatedRoute
      });
  }

}
