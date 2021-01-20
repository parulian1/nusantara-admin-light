/**
 * The main component that renders single TabComponent
 * instances.
 */

import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit, Output, EventEmitter,
} from '@angular/core';

import { TabComponent } from './tab.component';

@Component({
  selector: 'nus-tabs',
  template: `
    <div class="tab">
      <div
        *ngFor="let tab of tabs"
        (click)="selectTab(tab)"
        [class.active]="tab.active"
      >
        <strong>{{ tab.title }}</strong>
      </div>
    </div>
    <ng-content></ng-content>
  `,
  styles: [
    `
      .tab {
        overflow: hidden;
        display: flex;
        margin: 0 18px;
        justify-content: space-evenly;
      }

      .tab div {
        flex-grow: 1;
        text-align: center;
        outline: none;
        cursor: pointer;
        padding: 15px 0;
        transition: 0.3s;
        border-bottom: 3px solid #e7e7e7;
      }

      .tab div:hover {
        background: #f4f4f4;
      }

      .tab div.active {
        border-bottom: 3px solid #ff7d09;
      }
    `,
  ],
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  @Output() OutPutTitle = new EventEmitter<any>();

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
    this.OutPutTitle.next(tab.title);
  }
}
