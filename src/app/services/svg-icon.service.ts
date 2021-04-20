import { Injectable } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

const Icons = {
  ArrowDown: 'arrow-down'
}

const IconSvgs = {
  "arrow-down": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.30453 8.84377L12.0769 12.7502L15.9634 8.97745L17.1226 10.1779L12.0361 15.0898L7.12412 10.0033L8.30453 8.84377Z"/>
  </svg>`,
};

@Injectable({
  providedIn: "root",
})
export class SvgIconService {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}

  public registerIcons(): void {
    this.loadIcons(Object.values(Icons));
  }

  private loadIcons(iconKeys: string[]): void {
    iconKeys.forEach((key) => {
      this.matIconRegistry.addSvgIconLiteral(
        key,
        this.domSanitizer.bypassSecurityTrustHtml(IconSvgs[key])
      );
    });
  }
}
