import { Injectable } from '@angular/core';

declare let gtag: (type: 'event', eventName: string, option: object) => void;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor() {
    // This is intentional
  }

  public eventEmitter(
    eventName: string,
    eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null
  ){
    gtag('event', eventName, {
      eventCategory,
      eventLabel,
      eventAction,
      eventValue
    });
  }
}
