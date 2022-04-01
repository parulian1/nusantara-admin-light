import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IHrefEntity } from '@nusantara/models/base';
import { AuthService } from '@nusantara/auth';


@Component({
  selector: 'nus-dashboard',
  template: `
    <iframe
      #metabase
      frameborder="0"
      width="100%"
      allowtransparency *ngIf="allowToShow">
    </iframe>
  `,
  styles: [`iframe { min-height: 950px; }`]
})
export class DashboardComponent implements AfterViewInit {

  @ViewChild('metabase') metabaseIframe: ElementRef;

  constructor(protected route: ActivatedRoute, public authService: AuthService) { }

  ngAfterViewInit(): void {
    if (this.allowToShow) {
      this.route.data.subscribe((data: { dashboard: IHrefEntity }) => {
        const metabase = this.metabaseIframe.nativeElement as HTMLIFrameElement;
        metabase.src = data.dashboard.href.replace('&titled=true', '&titled=false');
      });
    }
  }

  get allowToShow(): boolean {
    if (!!this.authService.tokenPayload.is_superuser) {
      return true;
    }
    const otherGroupBesideFulfillment = this.authService.tokenPayload.groups.filter((group) => {
      return group.toLowerCase().indexOf('fulfillment') === -1;
    });
    return !!otherGroupBesideFulfillment;
  }
}
