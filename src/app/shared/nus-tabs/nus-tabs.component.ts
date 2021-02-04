import { AfterContentInit, Component, ContentChildren,  QueryList } from '@angular/core';

import { NusTabComponent } from '@nusantara/shared/nus-tabs/nus-tab.component';

@Component({
  selector: 'nus-tabs',
  template: `
    <ul class="nav nav-tabs">
      <li *ngFor="let tab of tabs" (click)="selectTab(tab)" [class.active]="tab.active">
        <span>{{tab.title}}</span>
      </li>
      <div class="orange-bar"></div>
    </ul>
    <ng-content></ng-content>
  `,
  styles: [`
    ul {
      list-style-type: none;
      display: flex;
      padding-left: 0;
      padding-bottom: 12px;
      border-bottom: solid 1px #E7E7E7;
      font-family: Open Sans, sans-serif;
      font-weight: 700;
      color: #5A5A5A;
    }

    li {
      padding: 0 40px;
      font-size: 16px;
      line-height: 24px;
      cursor: pointer;
    }

    .orange-bar {
      height: 2px;
      background-color: #EA730B;
      position: absolute;
      display: block;
      transition: left .2s ease;
      -webkit-transition: left .2s ease;
      top: 102px;
    }

    li:first-child.active ~ .orange-bar {
      left: 15px;
      width: 180px;
    }

    li:nth-child(2).active ~ .orange-bar {
      left: 200px;
      width: 148px;
    }

    .tab-close {
      color: gray;
      text-align: right;
      cursor: pointer;
    }
  `]
})
export class NusTabsComponent implements AfterContentInit {

  @ContentChildren(NusTabComponent) tabs: QueryList<NusTabComponent>;

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    const activeTabs = this.tabs.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: NusTabComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);

    // activate the tab the user has clicked on.
    tab.active = true;
  }

}
