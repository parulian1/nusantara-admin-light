import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { ToastService, AbstractDetailComponent } from '@nusantara/core';
import { IFlatPage } from '@nusantara/models';
import { FlatPageService } from '@nusantara/services';

@Component({
  selector: 'nus-flat-page',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Page">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span>Title</span>
        <input type="text" [formControl]="title">
        <nus-field-errors [control]="title"></nus-field-errors>
      </label>

      <label>
        <span>URL Path</span>
        <input type="text" [formControl]="url">
        <nus-field-errors [control]="url"></nus-field-errors>
      </label>

      <div>
        <label for="content" class="external"><span>Content</span></label>
        <ckeditor [editor]="Editor"
                  [formControl]="content" id="content"></ckeditor>
        <nus-field-errors [control]="content"></nus-field-errors>
      </div>
      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
  `,
  styles: [
    '.ck-editor__main { min-height: 150px; }',
  ]
})
export class FlatPageComponent extends AbstractDetailComponent<IFlatPage> implements OnInit {

  public Editor = ClassicEditor;

  constructor(public service: FlatPageService,
              public fb: FormBuilder,
              public toast: ToastService,
              public route: ActivatedRoute,
              public router: Router) {
    super();
  }

  get url(): FormControl { return this.form.get('url') as FormControl; }
  get href(): FormControl { return this.form.get('href') as FormControl; }
  get title(): FormControl { return this.form.get('title') as FormControl; }
  get content(): FormControl { return this.form.get('content') as FormControl; }

  initializeForm(entity?: IFlatPage) {
    this.form = this.fb.group({
      title: [entity?.title, [Validators.required]],
      href: [entity?.href],
      url: [entity?.url, [Validators.required]],
      content: [entity?.content, [Validators.required]],
    });
  }

  setOriginalEntityName(entity?: IFlatPage) {
    // overridden because attribute is named 'title' and not 'name' as expected in base class.
    this.originalEntityName = entity.title;
  }
}
