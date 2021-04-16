/**
 * A single tab page. It renders the passed template
 * via the @Input properties by using the ngTemplateOutlet
 * and ngTemplateOutletContext directives.
 */

import { Component, Input } from "@angular/core";

@Component({
  selector: "nus-tab",
  template: `
    <div [hidden]="!active" class="pane">
      <ng-content></ng-content>
    </div>
  `,
})
export class NusTabComponent {
  inputTitle: string = null;
  @Input() set title(value: string) {
    this.value = value;
    this.inputTitle = value;
  }
  @Input() value: string;
  @Input() active = false;

  get title() {
    return this.inputTitle;
  }
}
