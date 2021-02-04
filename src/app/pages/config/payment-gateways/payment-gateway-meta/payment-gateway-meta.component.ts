import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'nus-payment-gateway-meta',
  template: ``,
  styles: [':host { display: contents; }']
})
export class PaymentGatewayMetaComponent implements OnInit {

  @Input() currentMetaType: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
