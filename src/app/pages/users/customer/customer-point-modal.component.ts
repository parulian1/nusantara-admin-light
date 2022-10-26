import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {NgxSmartModalComponent} from 'ngx-smart-modal';
import {UserPointService} from '@nusantara/services/user-point.service';
import {ICustomer} from '@nusantara/models';
import {IPointHistory} from "@nusantara/models/point-history";

@Component({
  selector: 'nus-customer-point-modal',
  template: `
    <ngx-smart-modal [identifier]="'pointHistory'" #modal [customClass]="'wide-modal'">
      <h2 class="heading-2" i18n>Point History</h2>
      <section class="customer-point-modal__summary">
        <div id="customer-total-point">
          <img src="assets/point-icon.svg" alt="Profile Image">
          <span i18n>{{ pointTotal | number }} Point</span>
        </div>
      </section>
      <section class="customer-point-modal__history">
        <table>
          <thead>
            <tr style="background-color: #F4F4F4;">
              <th class="point-information" i18n>Information</th>
              <th class="point-date" i18n>Date</th>
              <th class="point-amount" i18n>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of pointHistory">
              <td class="point-information">{{ p.info }} #{{ p.orderNumber }}</td>
              <td class="point-date">{{ p.date|date }}</td>
              <td class="point-amount">{{ p.pointValue|number }}</td>
            </tr>
            <tr *ngIf="pointHistory?.length === 0">
              <td colspan="3" style="text-align: center;" i18n>No point history</td>
            </tr>
          </tbody>
        </table>
      </section>
    </ngx-smart-modal>
  `,
  styles: [
    'h2 { padding-bottom: 16px }',
    'p { color : var(--darken-grey); margin-bottom: 16px; }',
    'table { table-layout: fixed }',
    'td { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    `
      .customer-point-modal__summary {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 14px;
        border: 1px solid #B4B4B4;
        box-sizing: border-box;
        border-radius: 4px;
        margin-bottom: 16px;
      }
      .customer-point-modal__summary span{
        font-weight: bold;
        font-size: 16px;
        line-height: 24px;
      }
      #customer-total-point {
        display: flex;
      }
      #customer-total-point img{
        margin-inline-end: 8px;
      }
      .customer-point-modal__history {
        max-height: 50vh;
        overflow: auto;
      }
      .point-information {
        width: 50%;
      }
      .point-date, .point-amount {
        text-align: right;
      }
    `
  ]
})
export class CustomerPointModalComponent implements AfterViewInit {
  @Input() entity?: ICustomer;
  @ViewChild('modal') modal: NgxSmartModalComponent;

  constructor(protected service: UserPointService) {}

  pointTotal: number;
  pointHistory: Array<IPointHistory>;

  ngAfterViewInit(): void {
    this.modal.onOpen.subscribe(() => {
      this.service.fetchByUser(this.entity?.username).subscribe((result) => {
        if (result && result?.total) {
          this.pointTotal = result?.total;
        } else {
          this.pointTotal = 0;
        }
      });
      this.service.fetchHistory(this.entity?.username).subscribe((result) => {
        this.pointHistory = result.entities;
      });
    });
  }

  open() {
    this.modal.open();
  }
}
