import { Component } from '@angular/core';

import { environment } from '@env/environment';

/**
 * Very simple component -- shows a copyright notice and the current app version.
 */
@Component({
  selector: 'nus-copyright-notice',
  template: `
    <div>© 2016-{{ currentYear }}, PT Gramedia Digital Nusantara</div>
    <div>Bhisma E-Commerce Admin ({{ currentVersion }})</div>
  `,
  styles: [
    ':host { text-align: center; font-size: .8em; color: var(--nav-background)}',
  ]
})
export class CopyrightNoticeComponent {

  constructor() { }

  get currentYear(): number { return (new Date()).getFullYear(); }

  get currentVersion(): string {
    let ver = `v${environment.appVersion}`;
    if (!environment.production) {
      ver += '-dev';
    }
    return ver;
  }
}
