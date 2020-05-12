import { Component, Input } from '@angular/core';

@Component({
  selector: 'nus-list-header',
  template: `
    <header>
      <h1>{{ title }}</h1>
      <p *ngIf="!!description">{{ description }}</p>
      <div>
        <div class="search control">
          <i class="material-icons">search</i>
          <input type="search" placeholder="Search">
        </div>
        <a [routerLink]="['new']" class="control"><i class="material-icons">add</i> New</a>
      </div>
    </header>
  `,
  styles: [
    'header { margin-bottom: 23px; }',
    'h1 { font-weight: normal; font-size: 1.5em; }',
    'header > div { display: flex; }',
    'input[type=search] { font-size: 15px; padding-right: 5px; width: 250px; }',
    '.search { display: flex; }',
    '.search > input[type=search] { border: none; }',
    'a { display: flex; margin-left: auto; padding-right:20px; }'
  ]
})
export class ListHeaderComponent {
  @Input() title: string;
  @Input() description: string;
}
