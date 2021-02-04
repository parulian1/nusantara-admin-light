import { Component, Input } from '@angular/core';

@Component({
  selector: 'nus-tab',
  template: `
    <div [hidden]="!active">
      <ng-content></ng-content>
    </div>
  `
})
export class NusTabComponent {
  @Input() title: string;
  @Input() active = false;
}
