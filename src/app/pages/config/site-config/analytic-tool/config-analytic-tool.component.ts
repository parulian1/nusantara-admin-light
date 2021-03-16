import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';

import { mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ConfigAnalyticToolService } from '@nusantara/services';
import { AnalyticToolChoices, IConfigAnalyticTool } from '@nusantara/models';

@Component({
  selector: 'nus-config-analytic-tool-service',
  template: `
    <ng-container *ngIf="isLoaded">
      <div>
        <form [formGroup]="form">
          <div class="analytic-wrapper">
            <div class="analytic-item">
              <select name="" id="" [formControl]="type" (change)="onTypeChange($event)">
                <option value="" selected>-- Choose --</option>
                <option *ngFor="let t of types" [ngValue]="t.value">
                  {{ t.name }}
                </option>
              </select>
            </div>

            <div class="analytic-item">
              <input type="text" [formControl]="trackingId" class="analytic-input">
            </div>
          </div>
        </form>
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
  isLoaded = false;
  form: FormGroup;

  analyticTools: IConfigAnalyticTool[] = [];
  types: { value: string; name: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private service: ConfigAnalyticToolService,
  ) { }

  ngOnInit(): void {
    this.types = [
      { name: 'GA', value: AnalyticToolChoices.GA },
      { name: 'GTM', value: AnalyticToolChoices.GTM }
    ];

    this.service.fetchAll().subscribe((tools) => {
      this.isLoaded = true;
      this.initializeForm(tools?.[0] || null);
    });
  }

  initializeForm(entity?: IConfigAnalyticTool) {
    this.form = this.fb.group({
      href: [entity?.href ?? null, []],
      type: [entity?.type ?? '', []],
      trackingId: [entity?.trackingId ?? null, []],
    });
  }

  get href(): FormControl {
    return this.form.get('href') as FormControl;
  }

  get type(): FormControl {
    return this.form.get('type') as FormControl;
  }

  get trackingId(): FormControl {
    return this.form.get('trackingId') as FormControl;
  }

  /**
   * easy technic to save /update config,
   * delete all then create new one
   */
  save(): Observable<unknown> {
    return this.service
      .deleteAll()
      .pipe(
        mergeMap(() => {
          // has value mean create one
          if (this.type.value) {
            return this.service.create(this.form.value);
          } else {
            return of([]);
          }
        }),
      );
  }

  /**
   * whenever user change provider to `-- select live chat --`
   * remove exist widgetCode value
   */
  onTypeChange(ev: any): void {
    if (!ev.target.value) {
      this.trackingId.setValue('', {onlySelf: true});
    }
  }
}
