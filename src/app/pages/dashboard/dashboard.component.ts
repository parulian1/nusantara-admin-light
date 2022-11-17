import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IHrefEntity } from '@nusantara/models/base';
import { AuthService } from '@nusantara/auth';
import {Title} from "@angular/platform-browser";


@Component({
  selector: 'nus-dashboard',
  template: `
    <ng-container *ngIf="!!allowToShow">
      <iframe
        #metabase
        frameborder="0"
        width="100%"
        allowtransparency>
      </iframe>
    </ng-container>
  `,
  styles: [`iframe { min-height: 950px; }`]
})
export class DashboardComponent implements AfterViewInit, OnInit {

  @ViewChild('metabase') metabaseIframe: ElementRef;

  constructor(protected route: ActivatedRoute, public authService: AuthService, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Bhisma Admin - Dashboard');
  }

  ngAfterViewInit(): void {
    if (!!this.allowToShow) {
      this.route.data.subscribe((data: { dashboard: IHrefEntity }) => {
        const metabase = this.metabaseIframe.nativeElement as HTMLIFrameElement;
        metabase.src = data.dashboard.href.replace('&titled=true', '&titled=false');
      });
    }
  }

  get allowToShow(): boolean {
    if (!!this.authService?.tokenPayload?.is_superuser) {
      return true;
    }
    const otherGroupBesideFulfillment = this.authService?.tokenPayload?.groups.filter((group) => {
      return group.toLowerCase().indexOf('fulfillment') === -1;
    }) ?? [];
    return otherGroupBesideFulfillment.length > 0;
  }
}
