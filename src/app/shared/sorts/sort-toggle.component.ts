import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'nus-sort-toggle',
  template: `
    <a (click)="applySort($event)">
      <i class="material-icons">{{ isAscending? 'expand_more' : 'expand_less' }}</i>
    </a>
  `,
  styles: [
    'a { vertical-align: middle; color: var(--darken-grey ); }',
    ':host { padding-right: 20px }'
  ]
})
export class SortToggleComponent implements OnInit {
  applied = false;
  isAscending = true;
  @Input() field: string;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((queryParam: any) => {
      // this.applied = !!queryParam.include_inactive === true  || false;
    });

  }

  applySort(event: any) {
    this.isAscending = !this.isAscending;
    console.log(this.isAscending);

    // const params = {field: this.isAscending ? 'asc' : 'desc' };
    // this.router.navigate(
    //   ['./'],
    //   {
    //     queryParams: params,
    //     queryParamsHandling: 'merge',
    //     relativeTo: this.activatedRoute
    //   });
  }

}
