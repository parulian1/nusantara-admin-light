import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogResult } from '@nusantara/core';

@Component({
  selector: 'nus-note-dialog',
  template: `
    <ngx-smart-modal identifier="noteModal" #noteModal [formGroup]="form">
      <h2 class="heading-2" i18n>Reason</h2>
      <p class="body-2">Write other reasons in notes</p>
      <form #modalForm>
        <textarea class="note-input" [formControl]="note" placeholder="Input Note"></textarea>
      </form>
      <div class="action">
        <button class="control" [disabled]="!form.valid" (click)="submit()" type="button" i18n>Save</button>
        <button class="control secondary ghost" (click)="cancel()" type="button" i18n>Cancel</button>
      </div>
    </ngx-smart-modal>
  `,
  styles: [
    'h2 { margin-bottom: 11px; }',
    'p { color: var(--darken-grey); }',
    '.note-input { max-width: 450px; }',
    'div.action { display: flex; justify-content: space-between; padding-top: 32px;}',
    'button { width: 100% }',
    'button:not(:first-of-type) { margin-left: 5px; }',
  ],
})
export class NoteDialogComponent implements OnInit {
  @ViewChild('modalForm') formView: ElementRef<HTMLFormElement>;
  @ViewChild('noteModal') noteModal: NgxSmartModalComponent;

  form: FormGroup;
  result: DialogResult = DialogResult.Cancelled;
  stockRecordIndex: number;

  constructor( protected fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      note: ['', [Validators.required]],
    });
  }

  get note(): FormControl {
    return this.form.get('note') as FormControl;
  }

  resetNote() {
    this.note.reset();
  }

  open() {
    this.noteModal.open();
  }

  get onClose(): EventEmitter<any> {
    return this.noteModal.onClose;
  }

  submit() {
    this.result = DialogResult.OK;
    this.noteModal.close();
  }

  cancel() {
    this.result = DialogResult.Cancelled;
    this.noteModal.close();
  }
}
