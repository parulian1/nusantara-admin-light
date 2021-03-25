import { Component, Input } from '@angular/core';

@Component({
  selector: 'nus-empty-list',
  template: `
  <div>
    <h1 class="heading-1">{{ title }}</h1>
    <p>{{ description }}</p>
    <button [routerLink]="addUrl" class="control">
      <i class="material-icons">add</i>&nbsp;
      <span>{{ addText }}</span>
    </button>
  </div>`,
  styles: [
    '.material-icons { font-size: 20px; }',
    'div { height: 70vh; display: flex; flex-direction: column; justify-content: center; align-items: center}',
    'h1 { margin-buttom: 10px; }',
    'p { line-height: 20px; margin-bottom: 24px; }',
    'button { display: flex; align-items: center; justify-content: center; }',
    'span { padding-right: 10px; }'
  ],
})
export class EmptyListComponent {
  @Input() title: string;
  @Input() description: string;
  @Input() cancelUrl: string[];
  @Input() addUrl: string[];
  @Input() cancelText = 'Back';
  @Input() addText = 'Add';
}
