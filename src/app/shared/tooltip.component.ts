/**
 * Simple tooltip component.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'nus-tooltip',
  template: `
    <span class="tooltip">
      <i class="material-icons">info_outline</i>
      <span class="text">{{ text }}</span>
    </span>
  `,
  styles: [
    `
      /* Tooltip container */
      .tooltip {
          position: relative;
          display: inline-block;
      }

      /* Tooltip text */
      .tooltip .text {
        visibility: hidden;
        min-width: 312px;
        font-weight: 400;
        text-align: left;
        padding: 16px;
        border-radius: 4px;
        background-color: white;

        /* Position the tooltip text */
        position: absolute;
        z-index: 1;
        top: 150%;
        left: -200%;

        /* Fade in tooltip */
        opacity: 0;
        transition: opacity 1s;
        box-shadow: 0 0 8px -1px var(--shadow-color);
      }

      /* Tooltip arrow */
      .tooltip .text::before {
        content: "";
        position: absolute;
        bottom: 100%;
        left: 6%;

        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-bottom-color: white;
        filter: drop-shadow(0 -2px 2px var(--shadow-color));
      }

      /* Show the tooltip text when you mouse over the tooltip container */
      .tooltip:hover .text {
        visibility: visible;
        opacity: 1;
      }

      .material-icons {
        font-size: 13px
      },
    `
  ],
})
export class TooltipComponent {
  @Input() text: string;
}
