import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: "nus-sort-toggle",
  template: `
    <a (click)="toggleSort()">
      <i class="material-icons">{{
        isAscending ? "expand_less" : "expand_more"
      }}</i>
    </a>
  `,
  styles: [
    "a { vertical-align: middle; color: var(--darken-grey ); }",
    ":host { padding-right: 20px }",
  ],
})
export class SortToggleComponent implements OnInit {
  isAscending = false;
  @Input() field: string;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((value) => {
      if (value?.order === this.field) {
        this.isAscending = true;
      } else {
        this.isAscending = false;
      }
    });
  }

  toggleSort() {
    this.isAscending = !this.isAscending;
    this.applySort();
  }

  applySort() {
    const sortBy = this.isAscending? this.field : `-${this.field}`;
    this.router.navigate(["."], {
      queryParams: { order: sortBy },
      queryParamsHandling: "merge",
      relativeTo: this.route,
    });
  }
}
