import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListHeaderComponent } from '@nusantara/shared/list-header.component';

@Component({
  selector: 'nus-showcase-list-header',
  template: `
    <header>
      <h1 class="title-1">{{ title }}</h1>
      <p *ngIf="!!description">{{ description }}</p>
      <div>
        <div class="search control" *ngIf="canSearch">
          <i class="material-icons">search</i>
          <input type="search" placeholder="Search" [formControl]="queryText">
        </div>
        <a (click)="add.emit()" class="control" *ngIf="canAddNew"><i class="material-icons">add</i> Add</a>
      </div>
    </header>
  `,
  styles: [
    'header { margin-bottom: 23px; }',
    'header > div { display: flex; }',
    'input[type=search] { font-size: 15px; padding-right: 5px; width: 325px; }',
    'a { display: flex; justify-content: center; align-items: center; margin-left: auto; }',
    'p { margin-bottom: 5px; }',
    'a > i { line-height: 31px; font-size: 20px; }', 
    '.search { display: flex; border: solid 1px var(--grey); background-color: transparent; align-items: center}',
    'div.search > i { background-color: white; color: var(--nav-background); line-height: 31px; padding-left: 13px;}',
    '.search > input[type=search] { border: none !important; }'
  ]
})
export class ShowcaseListHeaderComponent extends  ListHeaderComponent {
  @Input() canAddNew = false;
  @Output() add = new EventEmitter<void>();
}
