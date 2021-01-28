import {Component, OnInit} from '@angular/core';
import {FormControl, Validators, FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import * as ClassicEditor from '@gdnnusantara/ckeditor5-build/build/ckeditor';


import {ToastService, AbstractDetailComponent} from '@nusantara/core';
import {IFlatPage} from '@nusantara/models';
import {FlatPageService} from '@nusantara/services';
import {getLastUrlString} from '@nusantara/core/helpers';

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
        <ckeditor [editor]="Editor" [config]="editorConfig"
                  [formControl]="content" id="content"></ckeditor>
        <nus-field-errors [control]="content"></nus-field-errors>
      </div>
      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()"
        [hideDelete]=hideDelete>
      </nus-detail-actions>
    </form>
  `,
  styles: [
    '.ck-editor__main { min-height: 150px; }'
  ]
})
export class FlatPageComponent extends AbstractDetailComponent<IFlatPage> implements OnInit {
  public DEFAULT_PAGES_PATH = ['kebijakan-privasi', 'syarat-dan-ketentuan'];
  public hideDelete = false;

  public Editor = ClassicEditor;

  editorConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'alignment',
        'indent',
        'outdent',
        '|',
        'imageUpload',
        'imageInsert',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        'undo',
        'redo',
        '|',
        'code',
        'codeBlock',
        'htmlEmbed',
        'fontColor',
        'fontSize',
        'fontFamily',
        'highlight',
        'horizontalLine'
      ]
    },
    language: 'en',
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
        'imageStyle:full',
        'linkImage',
        'imageResize'
      ],
      styles: [
        'full',
        'alignLeft', 'alignCenter', 'alignRight'
      ],
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableCellProperties',
        'tableProperties'
      ]
    },
    licenseKey: ''
  };

  constructor(service: FlatPageService,
              public fb: FormBuilder,
              toast: ToastService,
              route: ActivatedRoute,
              router: Router) {
    super(route, router, toast, service);
  }

  get url(): FormControl {
    return this.form.get('url') as FormControl;
  }

  get href(): FormControl {
    return this.form.get('href') as FormControl;
  }

  get title(): FormControl {
    return this.form.get('title') as FormControl;
  }

  get content(): FormControl {
    return this.form.get('content') as FormControl;
  }

  initializeForm(entity?: IFlatPage) {
    this.form = this.fb.group({
      title: [entity?.title, [Validators.required]],
      href: [entity?.href],
      url: [entity?.url, [Validators.required]],
      content: [entity?.content, [Validators.required]]
    });

    this.disableDeleteBtn();
    this.disableUrlInput();
  }

  setOriginalEntityName(entity?: IFlatPage) {
    // overridden because attribute is named 'title' and not 'name' as expected in base class.
    if (entity) {
      this.originalEntityName = entity.title;
    }
  }

  disableDeleteBtn() {
    const url = getLastUrlString(this.router.url);
    if (this.DEFAULT_PAGES_PATH.includes(url)) {
      this.hideDelete = true;
    }
  }

  disableUrlInput() {
    const url = getLastUrlString(this.router.url);
    if (this.DEFAULT_PAGES_PATH.includes(url)) {
      this.form.get('url').disable();
    }
  }
}
