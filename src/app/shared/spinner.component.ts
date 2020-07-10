import { Component, Input } from '@angular/core';

/**
 * Simple roundel-type spinner.  It waits for the input appBusy to be true,
 * then shows itself.
 *
 * component will not be shown unless the app reports busy for more than 750ms.
 */
@Component({
  selector: 'nus-spinner',
  template: `
    <div class="lds-hourglass" *ngIf="isDisplayed"></div>
  `,
  styles: [`
    :host { position: absolute; top: 5px; right: 5px; }
    .lds-hourglass { display: inline-block; position: relative; width: 40px; height: 40px; }
    .lds-hourglass:after {
      content: " ";
      display: block;
      box-sizing: border-box;
      width: 0; height: 0;
      border-radius: 50%;
      border: 16px solid var(--lighter-nav-bg);
      border-color: var(--lighter-nav-bg) transparent var(--lighter-nav-bg) transparent;
      animation: lds-hourglass 1.2s infinite;
    }
    /* TODO: Webkit browsers seem to freeze this animation after the first time isn't shown (hint, maybe something with ngIf?) */
    @keyframes lds-hourglass {
      0% { transform: rotate(0); animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }
      50% { transform: rotate(900deg); animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }
      100% { transform: rotate(1800deg); }
    }
  `]
})
export class SpinnerComponent {

  static DISPLAY_DELAY = 750;

  // tslint:disable-next-line:variable-name
  private _appBusy = false;
  isDisplayed = false;

  private timeoutId: any;

  get appBusy(): boolean { return this._appBusy; }
  @Input() set appBusy(value: boolean) {
    if (value === this.appBusy) {
      return;
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this._appBusy = value;

    if (value) {
      this.timeoutId = setTimeout(
        () => { this.isDisplayed = true; },
        SpinnerComponent.DISPLAY_DELAY
      );
    } else {
      this.isDisplayed = false;
    }
  }
}


