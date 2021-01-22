import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'nus-empty-list',
  template: ` <div id="container">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <div id="button-action">
      <button [routerLink]="cancelUrl" class="control secondary">{{ cancelText }}</button>
      <button [routerLink]="addUrl" class="control">
        <i class="material-icons">add</i>&nbsp;{{ addText }}
      </button>
    </div>
  </div>`,
  styles: [
    `
      #container {
        height: 600px;
        padding: 10px 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      h2 {
        font-size: 20px;
        font-weight: 700;
        line-height: 24px;
      }

      p {
        font-size: 14px;
        line-height: 20px;
      }

      #button-action {
        width: 24em;
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      #button-action > button {
        width: 100%;
        padding-top: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      button:not(:first-child) {
        margin-left: 15px;
      }
    `,
  ],
})
export class EmptyListCOmponent {
  @Input() title: string;
  @Input() description: string;
  @Input() cancelUrl: string[];
  @Input() addUrl: string[];
  @Input() cancelText = 'Back';
  @Input() addText = 'Add Data';
}
