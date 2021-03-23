import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractEditingComponent, moveItemInFormArray } from '@nusantara/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IOnBoarding, IOnboardingContent } from '@nusantara/models';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { OnboardingContentComponent } from './onboarding-content.component';

@Component({
  selector: 'nus-onboarding-content-host',
  template: `
      <div cdkDropList [cdkDropListData]="form" class="example-list"
                    (cdkDropListDropped)="drop($event)">
        <div class="onboarding-content-div" *ngFor="let content_control of form.controls; let i=index" cdkDrag>
          <nus-onboarding-content [form]="content_control"
                                  [entity]="entity?.contents.length > 0 ? entity?.contents[i] : null"
                                  (remove)="form.removeAt(i)" >
          </nus-onboarding-content>
        </div>
      </div>
      <button type="button" (click)="addContent()" class="add-button">
        <i class="material-icons">add</i> Add Record
      </button>
  `,
  styleUrls: ['./onboarding-content-host.css']
})
export class OnboardingContentHostComponent extends AbstractEditingComponent<FormArray> implements OnInit, AfterViewInit {
  @Input() form: FormArray;
  @Input() entity: IOnBoarding;

  @ViewChildren(OnboardingContentComponent) contents!: QueryList<OnboardingContentComponent>;

  constructor(public route: ActivatedRoute,
              public fb: FormBuilder,
              public router: Router) {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  addContent(content?: IOnboardingContent) {
    const form = this.fb.group({
      href: [content?.href ?? '', []],
      image: ['', content?.image ? [] : [Validators.required]],
      name: [content?.name, [Validators.required, Validators.maxLength(100)]],
      description: [content?.description, [Validators.maxLength(255), Validators.required]],
      buttonStatus: [content?.buttonStatus ?? false, []],
      buttonText: [content?.buttonText ?? '', [Validators.maxLength(100)]],
      buttonUrl: [content?.buttonUrl ?? '', [Validators.maxLength(160)]],
      sortPriority: [content?.sortPriority, []],

    });
    this.form.push(form);
  }

  drop(event: CdkDragDrop<FormArray, any>) {
    moveItemInFormArray(
      this.form,
      event.previousIndex,
      event.currentIndex
    );
  }

  getValue() {

    // updated code based on SonarLint issues
    this.form.controls.forEach((value, index) => {
      value.value.sortPriority = index;
      this.contents.forEach((valueComponent, subIndex) => {
        if (subIndex === index) {
          value.value.image = valueComponent.imagePreviewUrl;
        }
      });
    });

    // code that creates issues for SonarLint
    // this.form.controls.map((content, index) => {
    //   content.value.sortPriority = index;
    //   this.contents.map((contentComponent, subIndex) => {
    //     if (subIndex === index) {
    //       content.value.image = contentComponent.imagePreviewUrl;
    //     }
    //   });
    // });
  }

}
