import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'nus-milestone',
  template: `
    <div>
      <ul>
        <li *ngFor="let step of steps; let i = index;">
          <span [ngClass]="{'current': step === current, 'achieved': i < currentIdx}">{{ step | titlecase }}</span>
        </li>
      </ul>
    </div>
  `,
  styles: [
    'div { display: flex; width: 100%; justify-content: center; align-items: center; counter-reset: step; }',
    'ul { padding-top: 12px; width: 100%; display: flex; justify-content: space-between; flex-wrap: nowrap; overflow: auto; }',
    'li { padding-top: 10px; width: 100%; position: relative; text-align: center; min-width: 20px; }',
    'li:last-child::after, li:first-child::before { display: none; }',
    `li::before, li::after { content: ''; position: absolute; top: 0; width: 50%; border: 1px solid var(--grey); }`,
    'li::before { left: 0; }',
    'li::after { right: 0; }',
    'li span { color: var(--grey); cursor: pointer; font-size: 12px; }',
    `li span::after {
        position: absolute;
        counter-increment: step;
        content: counter(step);
        color: white;
        font-size: 14px;
        font-weight: bold;
        padding-top: 2px;
        width: 24px;
        height: 22px;
        background: var(--grey);
        border-radius: 100%;
        top: -12px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2; 
      }`,
    'li span.current, li span.achieved { color: var(--lighten-black); }',
    'li span.current::after{ background: var(--secondary); }',
    `li span.achieved::after{
        background: var(--tertiary);
        background-image: url(assets/white-checkmark.svg);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 16px;
        content: "";
      }`
  ]
})
export class MilestoneComponent implements OnInit {
  @Input() steps: Array<string>;
  @Input() current: string;
  currentIdx = -1;

  ngOnInit() {
    this.steps.map((step, idx) => {
      if(step === this.current){
        this.currentIdx = idx;
      }
    })
  }
}
