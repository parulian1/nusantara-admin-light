import {AfterViewInit, Component, OnInit, Input, ViewChild, ViewChildren, QueryList} from '@angular/core';
import {AbstractEditingComponent, moveItemInFormArray} from '@nusantara/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {IOnBoarding, IOnboardingContent} from '@nusantara/models';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {OnboardingContentComponent} from './onboarding-content.component';

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
        Add Record
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
      image: ['', content?.image ? []: [Validators.required]],
      name: [content?.name, [Validators.required, Validators.maxLength(50)]],
      description: [content?.description, [Validators.maxLength(255)]],
      buttonStatus: [content?.buttonStatus ?? false, []],
      buttonText: [content?.buttonText ?? '', []],
      buttonUrl: [content?.buttonUrl ?? '', []],
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
    this.form.controls.map((content, index) => {
      content.value.sortPriority = index;
      let _content = (content as FormGroup);
      console.log('this.contents', this.contents, this.contents.toArray()[index]);
      this.contents.map((contentComponent, _index) => {
        if (_index == index) {
          console.log(`image value`, contentComponent.imagePreviewUrl);
          _content.value.image = contentComponent.imagePreviewUrl;
        }
      });
      // if (!!content.value?.href && !content.value?.image) {
      //   _content.removeControl('image');
      // }
      content = _content;
    });
  }

}
