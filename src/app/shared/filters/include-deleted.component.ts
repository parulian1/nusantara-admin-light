import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'nus-include-deleted',
  template: `<label><input type="checkbox" (click)="applyFilter($event)">{{ text }}</label>`,
  styles: [
    'label { min-height: auto; padding-bottom: 0; }',
    ':host { padding-right: 20px }'
  ]
})
export class IncludeDeletedComponent implements OnInit {
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

  applyFilter(event: any) {
    const params = {include_deleted: event.target.checked };
    this.router.navigate(
      ['./'],
      {
        queryParams: params,
        queryParamsHandling: 'merge',
        relativeTo: this.activatedRoute
      });
  }

}
