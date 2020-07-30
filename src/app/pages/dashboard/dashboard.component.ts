import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IHrefEntity } from '@nusantara/models/base';


@Component({
  selector: 'nus-dashboard',
  template: `
    <h1>Dashboard</h1>
    <iframe
      #metabase
      frameborder="0"
      width="100%"
      allowtransparency>
    </iframe>
  `,
  styles: [`iframe { min-height: 950px; }`]
})
export class DashboardComponent implements AfterViewInit {

  @ViewChild('metabase') metabaseIframe: ElementRef;

  constructor(protected route: ActivatedRoute) { }

  ngAfterViewInit(): void {
    this.route.data.subscribe((data: { dashboard: IHrefEntity }) => {
      const metabase = this.metabaseIframe.nativeElement as HTMLIFrameElement;
      metabase.src = data.dashboard.href.replace('&titled=true', '&titled=false');
    });
  }
}
