import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { FormControl } from "@angular/forms";

@Component({
  selector: "nus-order-list-header",
  template: `
    <header>
      <h1 class="title-1">{{ title }}</h1>
      <div>
        <div class="search control">
          <i class="material-icons">search</i>
          <input type="search" placeholder="Search" [formControl]="queryText" />
        </div>
      </div>
    </header>
  `,
  styles: [
    "header { margin-bottom: 23px; }",
    "header > div { display: flex; }",
    "input[type=search] { font-size: 15px; padding-right: 5px; width: 325px; }",
    "a { display: flex; justify-content: center; align-items: center; margin-left: auto; }",
    "p { margin-bottom: 5px; }",
    "a > i { line-height: 31px; font-size: 20px; }",
    `
      .search {
        display: flex;
        border: solid 1px var(--lighter-nav-bg);
        background-color: transparent;
        align-items: center;
      }
    `,
    `
      div.search > i {
        background-color: white;
        color: var(--nav-background);
        line-height: 31px;
        padding-left: 13px;
      }
    `,
    '.search > input[type="search"] { border: none !important; }',
  ],
})
export class OrderListHeaderComponent implements OnInit {
  @Input() title: string;

  timeoutId: any;
  reloadTimeout = 650;
  originalValue: string = null;
  queryText = new FormControl("");

  constructor(public route: ActivatedRoute, public router: Router) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((value) => {
      this.queryText.setValue(value.get("q"));
      this.originalValue = value.get("q");
      this.queryText.valueChanges.subscribe((newValue) => {
        this.onQueryTextChanged(value, newValue);
      });
    });
  }

  onQueryTextChanged(params: ParamMap, newValue: string) {
    let existingParams = {
      start_time: null,
      end_time: null,
      store_id: null,
      order_status_admin: null,
      shipping_method: null,
      q: null,
    };
    params.keys.forEach(function (key) {
      if (key !== "q") {
        existingParams[key] = params.get(key);
      }
    });

    if (!!this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // don't run if the value hasn't actually changed from the original.
    if (newValue === this.originalValue) {
      return;
    }

    // always go back to page 1 when a new filter is applied
    if (!newValue) {
      // if the search input was cleared -> navigate immediately
      this.router.navigate(["."], {
        queryParams: existingParams,
        queryParamsHandling: "merge",
        relativeTo: this.route,
      });
    } else {
      this.timeoutId = setTimeout(() => {
        // wait to see if the user is still typing more before navigating
        const newParams = { ...existingParams, q: this.queryText.value, page: 1 };
        this.router.navigate(["."], {
          queryParams: newParams,
          queryParamsHandling: "merge",
          relativeTo: this.route,
        });
      }, this.reloadTimeout);
    }
  }
}
