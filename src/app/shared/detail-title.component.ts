import {Input, Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";

/**
 * Use on a detail page to show an H1 with either 'New some-type' or 'Update "my model"'
 */
@Component({
  selector: 'nus-detail-title',
  template: `
    <h1 class="title-1" [ngClass]="{'elipsis' : isLink}">
      <i *ngIf="!!originalName && originalName!=='Object'; then updateTitle else newTitle"></i>
      <ng-template #updateTitle>{{ originalName }}</ng-template>
      <ng-template #newTitle>Add {{ typeName }}</ng-template>
    </h1>
  `
})
export class DetailTitleComponent implements OnInit{
  @Input() originalName?: string;
  @Input() typeName: string;
  @Input() isLink:boolean;

  constructor(private titleService: Title) {
  }

  ngOnInit() {
    let title = 'Add '+this.typeName;
    if(!!this.originalName && this.originalName!=='Object') {
      title = this.originalName;
    }
    this.titleService.setTitle('Bhisma Admin - '+title);
  }
}
