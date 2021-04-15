import { Component } from '@angular/core';
import { AbstractListComponent } from '@nusantara/core';
import { ICompanyStory } from '@nusantara/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'nus-company-story-list',
  template: `
    <nus-list-header
      title="Company Story List"
      description="Static content for pages such as 'About-Us'">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <th>Stories Title</th>
        <th>Images</th>
        <th>Status</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        <td>{{ entity.image ? 'Yes': 'No' }}</td>
        <td>
          <span class="badge" [ngClass]="{success: entity.isActive, error: !entity.isActive}">
            {{ entity.isActive ? 'Active' : 'Not Active' }}
          </span>
        </td>
      </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: [``]
})
export class CompanyStoryListComponent extends AbstractListComponent<ICompanyStory> {
  constructor(route: ActivatedRoute) { super(route); }
}
