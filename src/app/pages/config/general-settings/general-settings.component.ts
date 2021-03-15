import {Component} from '@angular/core';

@Component({
  selector: 'nus-general-settings',
  template: `
    <h1 class="title-1">General</h1>
  `,
  styles: [
    `
      .wrapper {
        padding: 12px 24px;
        margin-bottom: 24px;
        border: solid 1px var(--grey);
        border-radius: 4px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    `,
    'p { line-height: 20px }',
  ]
})

export class GeneralSettingsComponent {}
