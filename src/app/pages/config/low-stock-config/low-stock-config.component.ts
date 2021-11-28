import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AbstractDetailComponent, ToastService} from '@nusantara/core';
import {IPoints} from '@nusantara/models';
import {PointsService} from '@nusantara/services';

@Component({
  selector: 'nus-low-stock-config',
  template: `
    <h1 class="title-1" i18n>Low Stock Config</h1>
    <form [formGroup]="form" (ngSubmit)="save()" class="fluid">
      <nus-tabs>
        <nus-tab [title]="'Stock Configuration'">
          <div class="low-stock-config">
            <h3>Low Stock Alert</h3>

            <label class="checkbox" style="min-height: 1rem;">
              <input type="checkbox" name="isActive" i18n> Is Active
              <nus-field-errors></nus-field-errors>
            </label>

            <label>
              <span i18n>Low Stock Qty</span>
              <input type="text" placeholder="insert quantity threshold">
              <nus-field-errors></nus-field-errors>
            </label>

            <label>
              <span i18n>Email Alert</span>
              <span i18n class="email-label">Send daily email notification when stock is low. / Email notification will be send regularly every 6 am</span>
              <div class="email-input">
                <input type="text" placeholder="insert email to send daily notification">
                <button type="button" class="control">Add</button>
              </div>
              <nus-field-errors></nus-field-errors>
            </label>

          </div>
        </nus-tab>
        <nus-tab [title]="'Product List'">
        </nus-tab>
      </nus-tabs>
      <nus-detail-actions
        [component]="this"
        [hideDelete]="true"
        (cancel)="navigateToParent(true)">
      </nus-detail-actions>
    </form>
  `,
  styles: [`
    .low-stock-config {
      margin-top: 24px;
      border: 1px solid #B4B4B4;
      border-radius: 8px;
      padding: 8px 16px;
      width: 65%;
    }

    .low-stock-config h3 {
      margin: 8px 0 16px 0;
    }

    .low-stock-config label .email-label {
      color: #5A5A5A;
      line-height: 20px;
    }

    .low-stock-config label .email-input {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .low-stock-config label .email-input input {
      max-width: 600px;
    }
  `]
})
export class LowStockConfigComponent extends AbstractDetailComponent<IPoints> implements OnInit {

  constructor(route: ActivatedRoute,
              router: Router,
              service: PointsService,
              toast: ToastService) {
    super(route, router, toast, service);
  }

  ngOnInit(): void {
  }

  initializeForm(entity: IPoints | undefined) {
  }

}
