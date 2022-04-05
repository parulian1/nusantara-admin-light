import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ElementRef, OnInit, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ToastLevelEnum, ToastService } from '@nusantara/core/toast';
import { ErrorResult, IResultResponse } from '@nusantara/core/responses';
import { IHttpFailure } from '@nusantara/models';
import { AbstractEditingComponent } from './abstract-editing.component';
import { convertStringToObject, keysToCamel } from '@nusantara/shared/helpers';
import { isObject } from 'rxjs/internal-compatibility';
import { FormArray, FormGroup } from '@angular/forms';


/**
 * Base class for components that display a create/edit form
 * for a single entity.
 */
@Directive()
export abstract class AbstractDetailComponent<T> extends AbstractEditingComponent implements OnInit, AfterViewInit {

  formView: ElementRef<HTMLFormElement>;
  originalEntityName = 'Object';
  entityTypeName: string;
  nonFieldErrors: Array<string> = [];
  continueSave = true;

  protected constructor(public route: ActivatedRoute, public router: Router,
                        public toast: ToastService, public service: any) {
    super();
  }

  ngOnInit() {
    this.route.data.subscribe((data: { entity: T }) => {
      this.initializeForm(data.entity);
      this.setOriginalEntityName(data.entity);
      this.form.markAllAsTouched();
    });
  }

  ngAfterViewInit(): void {
    this.route.data.subscribe((data: { entity: T }) => {
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
  initializeSubViewForms(entity?: T) {
  }

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

  beforeSave(): void {

  }

  save(headers?: any) {
    this.beforeSave();
    if (this.continueSave) {
      this.continueSave = false;
      this.service.save(this.getFormValue(), headers).pipe(catchError(err => {
        if (err instanceof HttpErrorResponse) {
          return of(new ErrorResult<IHttpFailure>(err.error, err.status));
        } else {
          return of(new ErrorResult<IHttpFailure>({detail: 'Network error.. probably?'}, err.status));
        }
      })).subscribe(
        resp => {
          if (resp.success) {
            this.onSaveSuccess(resp);
          } else {
            this.onSaveError(resp);
          }
        }, error => {},
        () => {
          this.continueSave = true;
        }
      );
    }
  }

  /**
   * Similar to the save method, but posts form/multi-part data instead of json
   * to this API.
   */
  saveAsForm() {
    if (!this.formView) {
      throw Error('formView is null');
    }

    const formData = new FormData(this.formView.nativeElement);

    this.service.save(formData).subscribe(
      resp => {
        if (resp.success) {
          this.onSaveSuccess(resp);
        } else {
          this.onSaveError(resp);
        }
      });
    this.form.disable();
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
    // if (this.form.disabled) this.form.enable();
    let errorMessage = '';
    const errorMessages: string[] = [];

    if (error.errorDetails?.errors) {
      this.setFormErrors(error.errorDetails.errors);
    } else if (error.errorDetails?.detail) {
      errorMessage = error.errorDetails?.detail;
    } else if (error.errorDetails?.message) {
      errorMessage = error.errorDetails.message;
    } else if (isObject(error.errorDetails)) {
      this.getErrors(error.errorDetails, errorMessages);
      errorMessage = errorMessages.length > 0 ? errorMessages[0] : 'Please check your input again.';
      this.setFormErrors(error.errorDetails);
    } else {
      errorMessage = 'Please check your input again.';
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
    const message = this.form.get('name')?.value ?? this.form.get('title')?.value;
    this.toast?.addMessage(`"${message}" was deleted successfully.`, 'Deleted', ToastLevelEnum.success);
    this.navigateToParent(false);
  }

  protected onDeleteError(error: any) {
    this.form.enable();
    if (error.status !== 400) {
      // else than 400 status code i hope using detail attribute as error message
      this.toast?.addError(error.error.detail, 'Failed to Delete');
    } else {
      this.setFormErrors(error.error);
    }
  }

  /**
   * Handle multiple fields errors
   */
  setFormErrors(error: any) {
    let errorMessage: any;
    if (typeof error !== 'object') {
      const errorsString = error.join('\n');
      const errorObject = convertStringToObject(errorsString);
      errorMessage = keysToCamel(errorObject);
    } else {
      errorMessage = error;
    }

    if (isObject(errorMessage)) {
      for (const prop in errorMessage) {
        if (errorMessage.hasOwnProperty(prop) && this.form.controls.hasOwnProperty(prop)) {
            this.form.controls[prop].setErrors({apiError: errorMessage[prop]});
            errorMessage[prop].forEach((_error, index) => {
              Object.keys(errorMessage[prop][index]).forEach((key) => {
                let formArray = this.form.controls[prop] as FormArray;
                Object.keys(errorMessage[prop][index][key]).forEach((bottomError) => {
                  formArray?.controls?.map((control, arrayIndex) => {
                    if (arrayIndex === index) {
                      let childError = errorMessage[prop][index][key][bottomError];
                      const childFormControl = (control as FormGroup).controls;
                      let _control;
                      if (childFormControl[key] instanceof FormArray) {
                        _control = (childFormControl[key] as FormArray).controls[bottomError];
                      } else if (childFormControl[key] instanceof FormGroup) {
                         _control = ((control as FormGroup).controls[key] as FormGroup);
                      } else {
                        _control = childFormControl[key];
                      }
                      if (!!_control) {
                        let apiError = childError;
                        if (childError instanceof Array) {
                          apiError = childError[0];
                        }
                        _control.setErrors({
                          apiError: apiError
                        });
                      }
                      control = _control;
                    }
                  });
                });
              });
            });
        }
      }
    }
  }

  /**
   * Handle error message
   */
  getErrors(errorDetail: object, errorMessages: string[]) {
    Object.keys(errorDetail).forEach((field) => {
      if (errorDetail instanceof Array) {
        errorMessages.push(`${field}: ${errorDetail[field]}`);
      } else if (isObject(errorDetail[field][0])) {
        this.getErrors(errorDetail[field][0], errorMessages);
      } else {
        errorMessages.push(`${field}: ${errorDetail[field][0]}`);
      }
    });
  }

}
