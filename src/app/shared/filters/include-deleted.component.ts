import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'nus-include-deleted',
  template: `
    <label>
      <mat-checkbox [ngModel]="showDeleted" (ngModelChange)="applyFilter($event)">
        {{ text }}
      </mat-checkbox>
    </label>
  `,
  styles: [
    'label { min-height: auto; padding-bottom: 0; }',
    ':host { padding-right: 20px }'
  ]
})
export class IncludeDeletedComponent implements OnInit {
  showDeleted = false;
  public applied = false;
  @Input() text = 'Show SoftDeleted';

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((queryParam: any) => {
      this.applied = !!queryParam.include_deleted && queryParam.include_deleted === true  || false;
    });

  }

  applyFilter(event: boolean) {
    const params = {include_deleted: event, page: 1};
    this.router.navigate(
      ['./'],
      {
        queryParams: params,
        queryParamsHandling: 'merge',
        relativeTo: this.activatedRoute
      });
  }

}
