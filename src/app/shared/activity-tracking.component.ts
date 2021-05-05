import { Component, Input, OnInit } from '@angular/core';

export interface ActivityTracking {
  date: string;
  time: string;
  status: string;
  description: string;
}
@Component({
  selector: 'nus-activity-tracking',
  template: `
  <div class="timeline">
    <div *ngFor="let item of activityTracking" class="container">
      <div class="content">
          <span class="timestamp">
            <div class="subheading-2">{{ item?.date }}</div>
            <div class="body-2">{{ item?.time }}</div>
          </span>
          <span class="info">
            <div class="subheading-2">{{ item?.status }}</div>
            <div class="body-2">{{ item?.description }}</div>
          </span>
      </div>
    </div>
  </div>
  `,
  styles: [
    `.timeline { 
        position: relative; 
        margin: 0 auto; 
        overflow-y: scroll; 
        max-height: 700px; 
        margin-right: 2px; 
      }`,
    '.container { position: relative; }',
    '.container:not(:last-child) { padding-bottom: 20px; }',
    `.container::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      left: 18%;
      background-color: var(--success);
      top: 0;
      border-radius: 50%;
      z-index: 1;
    }`,
    `.container:not(:last-child)::before {
      content: '';
      position: absolute;
      width: 2px;
      background-color: var(--success);
      top: 0;
      bottom: 0;
      left: 20%;
      margin-left: -3px;
    }`,
    '.content { display: flex; position: relative; }',
    '.info { position: relative; margin-left: 30px; padding-right: 10px; }',
    '.timestamp { text-align: right; padding-right: 16px; position: relative; width: 15%; }',
    '.timestamp div:first-child, .info div:first-child { margin-bottom: 8px; }',
    '.info div { width: 390px; overflow: hidden; text-overflow: ellipsis; }',
    '::-webkit-scrollbar { width: 8px; }',
    '::-webkit-scrollbar-thumb { -webkit-border-radius: 10px; border-radius: 10px; background: var(--grey); }',
  ]
})
export class ActivityTrackingComponent implements OnInit {
  // @Input() activityTracking: Array<ActivityTracking>
  activityTracking: Array<ActivityTracking>

  ngOnInit(){
    this.activityTracking = [
      {
        date: '01/02/2021',
        time: '08:12',
        status: 'Order Received in Shopee',
        description: null
      },
      {
        date: '01/02/2021',
        time: '08:12',
        status: 'Order Created in Nusantara Admin adad a d adadadadada adajdajhdajdhajh ajdadja',
        description: 'Order Created in Nusantara Admin adad a d adadadadada adajdajhdajdhajh ajdadja adajdahj ajdajdhaj jhadjahjd jhjahda jhajdhajd jjhjada jhjhadja jhajhdjahdjahjda jadjahdjahjda jhajdahjd'
      },
      {
        date: '01/02/2021',
        time: '08:12',
        status: 'Order Received in Shopee',
        description: 'Pick up service by SiCepat Halu courier'
      },
      {
        date: '01/02/2021',
        time: '08:12',
        status: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        description: 'Order Created in Nusantara Admin  adadadadadadadadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd a d adadadadada adajdajhdajdhajh ajdadja adajdahj ajdajdhaj jhadjahjd jhjahda jhajdhajd jjhjada jhjhadja jhajhdjahdjahjda jadjahdjahjda jhajdahjd'
      },
      {
        date: '01/02/2021',
        time: '08:12',
        status: 'Order Received in Shopee',
        description: 'Pick up service by SiCepat Halu courier'
      },
      {
        date: '01/02/2021',
        time: '08:12',
        status: 'Order Received in Shopee',
        description: 'Pick up service by SiCepat Halu courier'
      },
      {
        date: '01/02/2021',
        time: '08:12',
        status: 'Order Received in Shopee',
        description: 'Pick up service by SiCepat Halu courier'
      },
      {
        date: '01/02/2021',
        time: '08:12',
        status: 'Order Received in Shopee',
        description: null
      },
      {
        date: '01/02/2021',
        time: '08:12',
        status: 'Order Received in Shopee',
        description: null
      },
    ] 
  }
}
