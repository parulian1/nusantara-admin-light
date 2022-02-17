import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'nus-filter-pos-employee',
  template: `
    <label>
      <mat-checkbox [ngModel]="canUsePos" (ngModelChange)="applyFilter($event)">
        Show only Store Employee (Use POS)
      </mat-checkbox>
    </label>
  `,
  styles: [
    'label { min-height: auto; padding-bottom: 0; }',
    ':host { padding-right: 20px }'
  ]
})
export class FilterPosEmployeeComponent implements OnInit {
  canUsePos = false;
  public applied = false;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((queryParam: any) => {
      this.applied = !!queryParam.use_pos && queryParam.use_pos === true  || false;
    });

  }

  applyFilter(event: boolean) {
    const params = {use_pos: event, page: 1};
    this.router.navigate(
      ['./'],
      {
        queryParams: params,
        queryParamsHandling: 'merge',
        relativeTo: this.activatedRoute
      });
  }

}
