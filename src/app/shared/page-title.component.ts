import {Component, Input, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'nus-page-title',
  template: `
    <header>
      <h1 class="title-1">{{ title }}</h1>
    </header>
  `,
  styles:[
    'header { margin-bottom: 23px; }',
    'header > div { display: flex; }'
  ]
})

export class PageTitleComponent implements OnInit {
  @Input() title: string;

  constructor(private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle('Bhisma Admin - '+this.title);
  }
}
