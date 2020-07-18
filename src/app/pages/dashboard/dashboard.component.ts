import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { IHrefEntity } from '@nusantara/models/base';


@Component({
  selector: 'nus-dashboard',
  template: `
    <h1>Dashboard</h1>
<!--    <script src="https://reports.bhisma.cloud/app/iframeResizer.js"></script>-->
    <!--      onload="iFrameResize({}, this)"-->
    <iframe
      #metabase
      frameborder="0"
      width="100%"
      allowtransparency>
    </iframe>



  `,
  styles: [`iframe { min-height: 950px; }`]
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('metabase') metabaseIframe: ElementRef;

  constructor(protected route: ActivatedRoute) { }

  ngOnInit(): void {



  }

  ngAfterViewInit(): void {

    this.route.data.subscribe((data: { dashboard: IHrefEntity }) => {
      const metabase = this.metabaseIframe.nativeElement as HTMLIFrameElement;
      metabase.src = data.dashboard.href.replace('&titled=true', '&titled=false');
      // metabase.contentDocument.onresize = () => {
      //   console.log('loaded iframe', metabase.contentDocument.body.scrollHeight.toString(10));
      //   metabase.height = metabase.contentDocument.body.scrollHeight.toString(10);
      // };
    });


  }

}
