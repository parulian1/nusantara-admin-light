import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ElementRef, OnInit, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastLevelEnum, ToastService } from '@nusantara/core/toast';
import { IResultResponse } from '@nusantara/core/responses';
import { AbstractEditingComponent } from './abstract-editing.component';

/**
 * Base class for components that display a create/edit form
 * for a single entity.
 */
@Directive()
export abstract class AbstractDetailComponent<T> extends AbstractEditingComponent implements OnInit, AfterViewInit {

  route: ActivatedRoute;
  router: Router;
  formView: ElementRef<HTMLFormElement>;

  service: any;
  toast: ToastService;
  originalEntityName: string;
  entityTypeName: string;
  nonFieldErrors: Array<string> = [];

  ngOnInit() {
    this.route.data.subscribe((data: {entity: T}) => {
      this.initializeForm(data.entity);
      this.setOriginalEntityName(data.entity);
    });
  }

  ngAfterViewInit(): void {
    this.route.data.subscribe((data: {entity: T}) => {
      this.initializeSubViewForms(data.entity);
    });
  }

  /**
   * Initializes the value of 'form'.
   *
   * @param entity Typically the object passed in data.entity key of route data.
   */
  abstract initializeForm(entity?: T);

  /**
   * If a view contains subviews that are resolved through @ViewChild or @ViewChildren,
   * then this method can be overridden to initialize their data (similar
   * to initializeForm, but ensuring that the queries have resolved.
   */
  initializeSubViewForms(entity?: T) { }

  /**
   * Sets the 'originalEntityName' property (typically used
   * in the header when displaying a component that is being
   * edited).
   *
   * @param entity Typically the object passed in data.entity key of route data.
   */
  setOriginalEntityName(entity?: T) {
    if (!!entity && entity.hasOwnProperty('name')) {
      // tslint:disable:no-string-literal
      this.originalEntityName = entity['name'];
    }
  }

  /**
   * Navigates to the direct parent of the current component.  This will typically be the 'list' component
   * for a given 'detail' type component.
   *
   * @param warnOnDirty if 'true', a pop-up will be shown to the user if there are any data changes, letting them cancel.
   */
  navigateToParent(warnOnDirty = false) {
    if (warnOnDirty && this.form?.dirty) {
      const leavePage = confirm('Your changes will be lost.  Do you want to continue?');
      if (!leavePage) {
        return;
      }
    }
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  getFormValue() {
    return this.form.value;
  }

  save() {
    this.service.save(this.getFormValue()).subscribe(
      resp => {
        if (resp.success) {
          this.onSaveSuccess(resp);
        } else {
          this.onSaveError(resp);
        }
      }
    );
    this.form.disable();
  }

  /**
   * Similar to the save method, but posts form/multi-part data instead of json
   * to this API.
   */
  saveAsForm() {
    if (!this.formView) {
      throw Error('formView is null');
    }

    // const formData = new FormData(this.formView.nativeElement);
    const formData = this.transformToFormData(this.form.value);
    this.form.disable();

    this.service.save(formData).subscribe(
      resp => {
        if (resp.success) {
          this.onSaveSuccess(resp);
        } else {
          this.onSaveError(resp);
        }
    });
  }

  /**
   * Transform form (FormGroup) value to FormData instance
   */
  transformToFormData(result: any): FormData {
    const formData = new FormData();
    Object.keys(result).forEach(key => {
      if (result[key]) {
        if (Array.isArray(result[key]) && result[key].length === 0) {
          // ignore it
          // todo: handling like this because `sourceMappings`, ([]) cannot handling properly
        } else {
          formData.append(key, result[key]);
        }
      }
    });
    return formData;
  }

  /**
   * Called when a save successfully completes.
   * By default, shows a toast notification to the user that their save was successful,
   * and navigates back to the parent component URL.
   */
  protected onSaveSuccess(result: IResultResponse<T>) {
    this.form.enable();
    this.toast?.addMessage(`"${this.form.get('name')?.value ?? 'data'}" was saved successfully.`, 'Saved', ToastLevelEnum.success);
    this.navigateToParent(false);
  }

  /**
   * Called when a save fails.
   */
  protected onSaveError(error: any) {
    this.form.enable();
    let errorMessage = error.toString();
    if (error instanceof HttpErrorResponse) {
      errorMessage = error.message;
    }
    this.toast?.addError(errorMessage, 'Failed to Save');
  }

  delete() {
    this.service.delete(this.form.value).subscribe(
      resp => {
        if (resp.success) {
          this.onDeleteSuccess();
        } else {
          this.onDeleteError(resp);
        }
      },
      (err) => this.onDeleteError(err)
    );
    this.form.disable();
  }

  protected onDeleteSuccess() {
    this.form.enable();
    this.toast?.addMessage(`"${this.form.get('name').value}" was deleted successfully.`, 'Deleted', ToastLevelEnum.success);
    this.navigateToParent(false);
  }

  protected onDeleteError(error: any) {
    this.form.enable();
    this.toast?.addError(error.toString(), 'Failed to Save');
  }
}
