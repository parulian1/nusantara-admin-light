import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
} from '@angular/forms';

import { AnalyticToolChoices, IConfigAnalyticTool } from '@nusantara/models';

@Component({
  selector: 'nus-config-analytic-tool-service',
  template: `
    <ng-container>
      <div>
        <div class="analytic-wrapper">
          <div class="analytic-item">
            <select name="" id="" [formControl]="type" (change)="onTypeChange($event)">
              <option *ngFor="let t of types" [ngValue]="t.value">
                {{ t.name }}
              </option>
            </select>
          </div>

          <div class="analytic-item">
            <input type="text" [formControl]="gaAccountId" class="analytic-input">
          </div>
        </div>
      </div>
    </ng-container>
  `,
  styles: [`
    .analytic-wrapper {
      display: flex;
      align-items: center;
    }
    .analytic-item:not(:last-child) {
      margin-right: 8px;
    }
    .analytic-input {
      min-width: 480px;
    }
  `],
})
export class ConfigAnalyticToolComponent implements OnInit {
  @Input() form: FormGroup;

  analyticTools: IConfigAnalyticTool[] = [];
  types: { value: string; name: string }[] = [];


  ngOnInit(): void {
    this.types = [
      { name: 'GA', value: AnalyticToolChoices.GA },
      { name: 'GTM', value: AnalyticToolChoices.GTM }
    ];
  }

  get type(): FormControl {
    return this.form.get('gaAccountType') as FormControl;
  }

  get gaAccountId(): FormControl {
    return this.form.get('gaAccountId') as FormControl;
  }

  /**
   * whenever user change provider to `-- select live chat --`
   * remove exist widgetCode value
   */
  onTypeChange(ev: any): void {
    if (!ev.target.value) {
      this.gaAccountId.setValue('', {onlySelf: true});
    }
  }
}
