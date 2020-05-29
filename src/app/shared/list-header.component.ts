import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'nus-list-header',
  template: `
    <header>
      <h1>{{ title }}</h1>
      <p *ngIf="!!description">{{ description }}</p>
      <div>
        <div class="search control">
          <i class="material-icons">search</i>
          <input type="search" placeholder="Search" [formControl]="queryText">
        </div>
        <a [routerLink]="['new']" class="control" *ngIf="canAddNew"><i class="material-icons">add</i> New</a>
      </div>
    </header>
  `,
  styles: [
    'header { margin-bottom: 23px; }',
    'h1 { font-weight: normal; font-size: 1.5em; }',
    'header > div { display: flex; }',
    'input[type=search] { font-size: 15px; padding-right: 5px; width: 250px; }',
    'a { display: flex; margin-left: auto; padding-right:20px; }',

    `

      a > i {
        line-height: 31px;
      }

      .search {
        display: flex;
        border: solid 1px var(--lighter-nav-bg);
        background-color: transparent;
      }
      div.search > i {
        background-color: white;
        color: var(--nav-background);
        line-height: 31px;
      }
      .search > input[type=search] {
        border: none;
      }
    `
  ]
})
export class ListHeaderComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;
  @Input() canAddNew = true;

  timeoutId: any;
  reloadTimeout = 650;
  queryText = new FormControl('');

  constructor(public route: ActivatedRoute,
              public router: Router) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(
      (value) => {
        this.queryText.setValue(value.get('q'));
        this.queryText.valueChanges.subscribe(
          (newValue) => { this.onQueryTextChanged(newValue); }
        );
      }
    );
  }

  onQueryTextChanged(newValue: string) {
    if (!!this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    // always go back to page 1 when a new filter is applied
    if (!newValue) {
      // if the search input was cleared -> navigate immediately
      this.router.navigate(['.'], {relativeTo: this.route});
    } else {
      this.timeoutId = setTimeout(() => {
        // wait to see if the user is still typing more before navigating
        const params = {q: this.queryText.value};
        this.router.navigate(
          ['.'],
          {
            queryParams: params,
            relativeTo: this.route
          }
        );
      }, this.reloadTimeout);
    }
  }

}
