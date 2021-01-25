import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'nus-include-deleted',
  template: `<label>Show SoftDeleted<input type="checkbox" (click)="applyFilter($event)"></label>`,
  styles: [
    'label { min-height: auto;}',
    'input { margin-left: 5px }'
  ]
})
export class IncludeDeletedComponent implements OnInit {
  public applied = false;

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
