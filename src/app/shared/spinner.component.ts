import { Component, Input } from '@angular/core';


@Component({
  selector: 'nus-spinner',
  template: `
    <div class="lds-hourglass" *ngIf="isDisplayed"></div>
  `,
  styles: [`
    :host {
      position: absolute;
      top: 5px;
      right: 5px;
    }
    .lds-hourglass {
      display: inline-block;
      position: relative;
      width: 40px;
      height: 40px;
    }
    .lds-hourglass:after {
      content: " ";
      display: block;
      border-radius: 50%;
      width: 0;
      height: 0;
      margin: 8px;
      box-sizing: border-box;
      border: 16px solid var(--lighter-nav-bg);
      border-color: var(--lighter-nav-bg) transparent var(--lighter-nav-bg) transparent;
      animation: lds-hourglass 1.2s infinite;
    }
    @keyframes lds-hourglass {
      0% {
        transform: rotate(0);
        animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
      }
      50% {
        transform: rotate(900deg);
        animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      }
      100% {
        transform: rotate(1800deg);
      }
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

    console.log('Got signal for appBusy =', value);

    if (value !== this.appBusy) {

      if (this.timeoutId) { clearTimeout(this.timeoutId); }

      this._appBusy = value;

      if (value) {
        console.log('Starting timer');
        this.timeoutId = setTimeout(
          () => { this.isDisplayed = true;  console.log('Is dispalyed shoudl be true'); },
          SpinnerComponent.DISPLAY_DELAY
        );
      } else {
        this.isDisplayed = false;
      }

    }
  }

}


