import {AfterViewInit, Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {AbstractEditingComponent} from '@nusantara/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'nus-onboarding-content',
  template: `
      <div [formGroup]="form">
        <label>
          <span>Image</span>
          <img *ngIf="imagePreviewUrl" [src]="imagePreviewUrl" alt="Banner Image" class="preview">
          <input type="file" [formControl]="image" (change)="setImagePreview($event)"
                 name="icon" accept="image/*">
          <nus-field-errors [control]="image"></nus-field-errors>
        </label>

        <label>
          <span>Title</span>
          <input type="text" [formControl]="name">
          <nus-field-errors [control]="name"></nus-field-errors>
        </label>

        <label>
          <span>Description</span>
          <textarea [formControl]="description"></textarea>
          <nus-field-errors [control]="description"></nus-field-errors>
        </label>
        <hr/>

        <label>
          <span>Button Status</span>
          <input type="checkbox" [formControl]="buttonStatus">
        </label>

        <label>
          <span>Button Text</span>
          <input type="url" [formControl]="buttonText">
          <nus-field-errors [control]="buttonText"></nus-field-errors>
        </label>

        <label>
          <span>Button Url</span>
          <input type="url" [formControl]="buttonUrl">
          <nus-field-errors [control]="buttonUrl"></nus-field-errors>
        </label>
        <button (click)="remove.emit()" type="button" class="remove-button" data-qa="remove-button">
          <i class="material-icons">remove_circle_outline</i>
        </button>
      </div>
  `,
  styles: ['']
})
export class OnboardingContentComponent extends AbstractEditingComponent implements OnInit, AfterViewInit {
  @Input() form: FormGroup;
  @Output() remove = new EventEmitter<void>();
  imagePreviewUrl: string;

  constructor(public route: ActivatedRoute,
              public router: Router) {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  get buttonText(): FormControl { return this.form.get('buttonText') as FormControl; }
  get buttonUrl(): FormControl { return this.form.get('buttonUrl') as FormControl; }
  get buttonStatus(): FormControl { return this.form.get('buttonStatus') as FormControl; }
  get href(): FormControl { return this.form.get('href') as FormControl; }
  get name(): FormControl { return this.form.get('name') as FormControl; }
  get description(): FormControl { return this.form.get('description') as FormControl; }
  get image(): FormControl { return this.form.get('image') as FormControl; }
  get sortPriority(): FormControl { return this.form.get('sortPriority') as FormControl; }

  setImagePreview(data: Event | string) {
    super.setImagePreview(data, (dataAsUrl) => this.imagePreviewUrl = dataAsUrl);
  }

}
