import { Input, Component } from '@angular/core';

/**
 * Use on a detail page to show an H1 with either 'New some-type' or 'Update "my model"'
 */
@Component({
  selector: 'nus-detail-title',
  template: `
    <h1 class="title-1 elipsis">
      <i *ngIf="!!originalName && originalName!='Object'; then updateTitle else newTitle"></i>
      <ng-template #updateTitle>{{ originalName }}</ng-template>
      <ng-template #newTitle>Add {{ typeName }}</ng-template>
    </h1>
  `
})
export class DetailTitleComponent {
  @Input() originalName?: string;
  @Input() typeName: string;
}
