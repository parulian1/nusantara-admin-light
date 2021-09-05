import {Component, OnInit} from '@angular/core';
import {AbstractListComponent, IResultResponse, ToastLevelEnum, ToastService} from '@nusantara/core';
import { ICompanyStory } from '@nusantara/models';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {forkJoin} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {CompanyStoryService} from '@nusantara/services';

@Component({
  selector: 'nus-company-story-list-ordering',
  template: `
    <nus-list-header
      title="Company Story List (Ordering)"
      [canSearch]="false"
      [canAddNew]="false"
      description="Static content for pages such as 'About-Us'" i18n-title>
    </nus-list-header>

    <table>
      <thead>
      <tr>
        <th i18n>Stories Title</th>
        <th i18n>Images</th>
        <th i18n>Status</th>
      </tr>
      </thead>
      <tbody cdkDropList (cdkDropListDropped)="drop($event)">
      <tr *ngFor="let entity of entities" cdkDrag>
        <td>
          <div style="display: flex; align-items: center;">
            <i class="material-icons">swap_vert</i>
            &nbsp;
            <a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a>
          </div>
        </td>
        <td>{{ entity.image ? 'Yes': 'No' }}</td>
        <td>
          <span class="badge" [ngClass]="{success: entity.isActive, error: !entity.isActive}">
            {{ entity.isActive ? 'Active' : 'Not Active' }}
          </span>
        </td>
      </tr>
      </tbody>
    </table>

    <div style="margin-top: 1.5rem;">
      <button type="submit" class="control" (click)="onSave()" i18n>
        Save
      </button>
      &nbsp;
      <button type="button" class="control secondary" (click)="onCancel()" i18n>
        Cancel
      </button>
    </div>
  `,
  styles: [``]
})
export class CompanyStoryListOrderingComponent implements OnInit {
  entities: ICompanyStory[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private service: CompanyStoryService,
    public toast: ToastService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((data: { companyStories: ICompanyStory[] }) => {
      this.entities = data.companyStories;
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.entities, event.previousIndex, event.currentIndex);
  }

  onSave(): void {
    forkJoin(this.entities.map((entity, index) => {
      return this.service.save({ href: entity.href, priority: index } as any);
    })).subscribe(() => {
      this.onSaveSuccess();
    }, error => this.onSaveFail(error));
  }

  onCancel(): void {
    this.router.navigate(['/cms/company-story/']);
  }

  protected onSaveSuccess() {
    this.toast?.addMessage(`reordering was successfully.`, 'Reordering', ToastLevelEnum.success);
    this.router.navigate(['/cms/company-story'], {relativeTo: this.route});
  }
  protected onSaveFail(error: HttpErrorResponse): void {
    console.log('error', error);
  }
}
