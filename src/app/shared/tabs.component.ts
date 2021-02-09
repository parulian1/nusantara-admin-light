/**
 * The main component that renders single TabComponent
 * instances.
 */

import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit, Output, EventEmitter, Input,
} from '@angular/core';

import { TabComponent } from './tab.component';

@Component({
  selector: 'nus-tabs-mp',
  template: `
    <div class="tab">
      <div
        *ngFor="let tab of tabs"
        (click)="selectTab(tab)"
        [class.active]="tab.active"
        [ngClass]="{ 'fluid' : fluid === true }">
        <strong>{{ tab.title }}</strong>
      </div>
    </div>
    <ng-content></ng-content>
  `,
  styles: [
    '.tab { overflow: hidden; display: flex; justify-content: start; border-bottom: 1px solid var(--grey); }',
    '.tab div { outline: none; cursor: pointer; padding: 12px 50px; transition: 0.3s; }',
    '.tab div:hover { background: var(--darken-white); }',
    '.tab div.active { border-bottom: 2px solid var(--secondary); }',
    
    '.tab.wide { justify-content: center; }',
    '.tab.wide div { flex-grow: 1; }',
    '.fluid { flex-grow: 1; text-align: center; }'
  ],
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  @Output() select = new EventEmitter<any>();
  @Input() fluid = false;
  
  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    const activeTabs = this.tabs.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: TabComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach((tab) => (tab.active = false));

    // activate the tab the user has clicked on.
    tab.active = true;
    this.select.next(tab.title);
  }
}
