import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractDetailComponent, moveItemInFormArray, ToastService } from '@nusantara/core';
import { drf, IOnBoarding, IOnboardingContent, OnBoardingTypeEnum } from '@nusantara/models';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OnboardingService } from "@nusantara/services";
import { OnboardingContentHostComponent } from "@nusantara/pages/cms/onboarding";

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
        <select formControlName="type">
          <option [ngValue]="null">---</option>
          <option *ngFor="let typeChoice of typeChoices" [ngValue]="typeChoice.value">
            {{ typeChoice.displayName }}
          </option>
        </select>
        <nus-field-errors [control]="type"></nus-field-errors>
      </label>

      <label>
        <span>Display On/Off</span>
        <input type="checkbox" [formControl]="isActive">
        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>


      <nus-onboarding-content-host [form]="contents" [entity]="entity"></nus-onboarding-content-host>


      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>

  `,
})
export class OnboardingComponent extends AbstractDetailComponent<IOnBoarding> implements OnInit {
  entity: IOnBoarding;
  typeChoices: drf.IChoice[] = [];
  contentsValue: IOnboardingContent[];

  @ViewChild(OnboardingContentHostComponent) contentHost!: OnboardingContentHostComponent;

  constructor(service: OnboardingService,
              public fb: FormBuilder,
              toast: ToastService,
              route: ActivatedRoute,
              router: Router) {
    super(route, router, toast, service);
  }


  get name(): FormControl { return this.form.get('name') as FormControl; }
  get type(): FormControl { return this.form.get('type') as FormControl; }
  get isActive(): FormControl { return this.form.get('isActive') as FormControl; }
  get href(): FormControl { return this.form.get('href') as FormControl; }
  get contents(): FormArray { return this.form.get('contents') as FormArray; }

  ngOnInit() {
    this.route.data.subscribe((data: { entity: IOnBoarding, typeChoices: drf.IChoice[] }) => {
      this.typeChoices = data.typeChoices;
    });
    super.ngOnInit();
  }

  initializeForm(entity?: IOnBoarding) {
    this.entity = entity;
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required]],
      href: [entity?.href, []],
      type: [entity?.type ?? OnBoardingTypeEnum.reseller, [Validators.required]],
      isActive: [entity?.isActive ?? true, []],
      contents: this.fb.array([], [Validators.required]),
    });
  }

  initializeSubViewForms(entity?: IOnBoarding) {
    for (const content of entity?.contents ?? []) {
      this.contentHost.addContent(content);
    }

  }

  save() {
    console.log(`contentHost Value`, this.contentHost.getValue());
    // this.contents.patchValue(this.contentHost.getValue());
    super.save();
  }


}
