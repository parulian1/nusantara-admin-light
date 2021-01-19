import { Component, OnInit } from '@angular/core';
import { AbstractDetailComponent, moveItemInFormArray, ToastService } from '@nusantara/core';
import { IOnBoarding, IOnboardingContent } from '@nusantara/models';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IOnboardingService } from "@nusantara/services";
import { CdkDragDrop } from "@angular/cdk/drag-drop";

@Component({
  selector: 'nus-onboarding',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Onboarding">
    </nus-detail-title>
    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()">
      <label>
        <span>Title</span>
        <input type="text" [formControl]="name">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span>Display At</span>
        <input type="text" [formControl]="type">
        <nus-field-errors [control]="type"></nus-field-errors>
      </label>

      <label>
        <span>Display On/Off</span>
        <input type="checkbox" [formControl]="isActive">
        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>

      <ng-container cdkDropList [cdkDropListData]="entity?.contents" class="example-list"
                    (cdkDropListDropped)="drop($event)">
        <nus-onboarding-content
          *ngFor="let content_control of contents.controls; let i=index"
          [form]="content_control"
          (remove)="contents.removeAt(i)">
        </nus-onboarding-content>
      </ng-container>


      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
  `,
  styles: ['']
})
export class OnboardingComponent extends AbstractDetailComponent<IOnBoarding> implements OnInit {
  imagePreviewUrl: string;
  entity: IOnBoarding;

  constructor(service: IOnboardingService,
              public fb: FormBuilder,
              toast: ToastService,
              route: ActivatedRoute,
              router: Router) {
    super(route, router, toast, service);
  }


  get name(): FormControl { return this.form.get('buttonText') as FormControl; }
  get type(): FormControl { return this.form.get('buttonUrl') as FormControl; }
  get isActive(): FormControl { return this.form.get('buttonStatus') as FormControl; }
  get href(): FormControl { return this.form.get('href') as FormControl; }
  get contents(): FormArray { return this.form.get('contents') as FormArray; }

  initializeForm(entity?: IOnBoarding) {
    this.entity = entity;
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required]],
      href: [entity?.href],
      type: [entity?.type],
      isActive: [entity?.isActive ?? true],
      contents: this.fb.array([], [Validators.required]),
    });
    for (const content of entity?.contents ?? []) {
      this.addContent(content);
    }
  }

  addContent(content?: IOnboardingContent) {
    const form = this.fb.group({
      href: [content?.href ?? '', [Validators.required]],
      image: [content?.image, [Validators.required]],
      name: [content?.name, [Validators.required, Validators.maxLength(50)]],
      description: [content?.description, [Validators.maxLength(255)]],
      buttonStatus: [content?.buttonStatus ?? false, []],
      buttonText: [content?.buttonText ?? '', []],
      buttonUrl: [content.buttonUrl ?? '', []],
      sortPriority: [content?.sortPriority, []],

    });
    this.contents.push(form);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInFormArray(
      this.contents,
      event.previousIndex,
      event.currentIndex
    );
  }

  save() {
    super.save();
  }
}
