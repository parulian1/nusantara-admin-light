import { Component } from '@angular/core';
import { AbstractListComponent } from '@nusantara/core';
import { ICompanyStory } from '@nusantara/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'nus-company-story-list',
  template: `
    <nus-list-header
      title="Company Story"
      [canSearch]="false"
      description="Static content for pages such as 'About-Us'" i18n-title>
    </nus-list-header>

    <div style="margin-bottom: 1rem;">
      <a class="control" [routerLink]="['ordering']" style="padding: 0.5rem 1rem;" i18n>
        Reordering
      </a>
    </div>

    <table>
      <thead>
      <tr>
        <th i18n>Stories Title</th>
        <th i18n>Images</th>
        <th i18n>Status</th>
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
  `,

})
export class CompanyStoryListComponent extends AbstractListComponent<ICompanyStory> {
  constructor(route: ActivatedRoute) { super(route); }
}
