import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'nus-empty-list',
  template: ` <div id="container">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <div id="button-action">
      <button [routerLink]="cancelUrl" id="cancel">{{ cancelText }}</button>
      <button [routerLink]="addUrl" id="add-data">
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
        cursor: pointer;
      }

      button:not(:first-child) {
        margin-left: 15px;
      }

      button {
        border: solid 2px #365dc3;
        border-radius: 4px;
        color: white;
        height: 40px;
        font-weight: 700;
        font-size: 14px;
        text-decoration: none;
      }

      #add-data {
        background: #365dc3;
      }

      #cancel {
        background: white;
        color: #365dc3;
      }

      .material-icons {
        font-size: 20px;
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
