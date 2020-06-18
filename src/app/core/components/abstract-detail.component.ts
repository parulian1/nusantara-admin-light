import { OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastService } from '@nusantara/core';
import { ToastLevelEnum } from '@nusantara/core/toast/toast-level.enum';

/**
 * Base class for components that display a create/edit form
 * for a single entity.
 */
export abstract class AbstractDetailComponent<T> implements OnInit {

  route: ActivatedRoute;
  router: Router;
  form: FormGroup;
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

  /**
   * Initializes the value of 'form'.
   *
   * @param entity Typically the object passed in data.entity key of route data.
   */
  abstract initializeForm(entity?: T);

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

  get isNew(): boolean {
    return !this.form?.get('href').value;
  }

  getFormValue() {
    return this.form.value;
  }

  save() {
    this.service.save(this.getFormValue()).subscribe(
      resp => {
        if (resp.success) {
          this.onSaveSuccess();
        } else {
          this.onSaveError();
        }
      }
    );
  }

  /**
   * Called when a save successfully completes.
   * By default, shows a toast notification to the user that their save was successful,
   * and navigates back to the parent component URL.
   */
  protected onSaveSuccess() {
    this.toast.addMessage(`"${this.form.get('name')?.value ?? 'data'}" was saved successfully.`, 'Saved', ToastLevelEnum.success);
    this.navigateToParent(false);
  }

  /**
   * Called when a save fails.
   */
  protected onSaveError() {
    // todo: this should really be improved with data from the error response.
    alert('Failed to save');
  }


  delete() {
    this.service.delete(this.form.value).subscribe(
      resp => {
        if (resp.success) {
          this.onDeleteSuccess();
        } else {
          this.onDeleteError();
        }
      }
    );
  }

  protected onDeleteSuccess() {
    this.toast.addMessage(`"${this.form.get('name').value}" was deleted successfully.`, 'Deleted', ToastLevelEnum.success);
    this.navigateToParent(false);
  }

  protected onDeleteError() {
    alert('Error deleting');
  }


}
