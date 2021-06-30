import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractDetailComponent, ToastService } from '@nusantara/core';
import { drf, IOnBoarding, IOnboardingContent, OnBoardingTypeEnum } from '@nusantara/models';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OnboardingService } from '@nusantara/services';
import { OnboardingContentHostComponent } from './onboarding-content-host.component';
import { OnboardingPreviewHostDialogComponent } from './preview';

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

      <label class="checkbox">
        <span>Display On/Off</span>
        <input type="checkbox" [formControl]="isActive">
        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>

      <nus-onboarding-content-host [form]="contents" [entity]="entity"></nus-onboarding-content-host>
      <nus-onboarding-preview-host-dialog [form]="contents" (closeEvent)="closePreview()">
      </nus-onboarding-preview-host-dialog>
      <div class="action-button">
        <button (click)="preview()" type="button" class="preview-btn" [disabled]="!contents.length">
          <i class="material-icons">visibility</i>Preview
        </button>
        <button type="button" (click)="navigateToParent(true)" class="control secondary">
          Cancel
        </button>
        <button type="submit" [disabled]="!form.valid" class="control">
            Save
        </button>
      </div>

    </form>

  `,
  styles: [`
      .preview-btn {
        color: #E7E7E7;
        border: none;
        background: none;
      }
      .preview-btn i {
        margin-right: 12px;
      }
      .preview-btn:hover{
        color: #EA730B;
      }
      .action-button {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 20px;
      }
      .action-button button {
        margin-left: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
  `]
})
export class OnboardingComponent extends AbstractDetailComponent<IOnBoarding> implements OnInit, AfterViewChecked {
  entity: IOnBoarding;
  typeChoices: drf.IChoice[] = [];

  @ViewChild(OnboardingContentHostComponent) contentHost!: OnboardingContentHostComponent;
  @ViewChild(OnboardingPreviewHostDialogComponent) onboardingPreviewHostDialogComponent: OnboardingPreviewHostDialogComponent;

  constructor(service: OnboardingService,
              public fb: FormBuilder,
              toast: ToastService,
              route: ActivatedRoute,
              router: Router,
              private changeDetector: ChangeDetectorRef ) {
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

  ngAfterViewChecked(){
    this.changeDetector.detectChanges();
  }

  initializeForm(entity?: IOnBoarding) {
    this.entity = entity;

    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, Validators.maxLength(100)]],
      href: [entity?.href, []],
      type: [entity?.type ?? OnBoardingTypeEnum.reseller, [Validators.required]],
      isActive: [entity?.isActive ?? true, []],
      contents: this.fb.array([], [Validators.required]),
    });
    this.isActive.markAsTouched();
    for (const content of entity?.contents ?? []) {
      this.addContent(content);
    }
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
    this.contents.push(form);
  }

  save() {
    if (!this.form.invalid) {
      const contentValues = this.contentHost.getValue();
      contentValues.map((value) => {
        if (!value['image'].match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
          delete value['image'];
        }
      });
      this.form.value.contents = contentValues;
      super.save();
    }
  }

  preview() {
    this.onboardingPreviewHostDialogComponent.position = 0;
    this.contentHost.getValue();
    this.onboardingPreviewHostDialogComponent.form = this.contents;
    this.onboardingPreviewHostDialogComponent.open();
  }

  closePreview() {
    this.onboardingPreviewHostDialogComponent.close();
  }

}
