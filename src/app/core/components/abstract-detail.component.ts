import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ToastService } from '@nusantara/core';
import { ToastLevelEnum } from '@nusantara/core/toast/toast-level.enum';

/**
 * Base class for components that display a create/edit form
 * for a single entity.
 */
export abstract class AbstractDetailComponent {

  route: ActivatedRoute;
  router: Router;
  form: FormGroup;
  service: any;
  toast: ToastService;
  originalEntityName: string;
  entityTypeName: string;

  /**
   * Navigates
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

  /**
   *
   */
  save() {
    this.service.save(this.form.value).subscribe(
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
   */
  protected onSaveSuccess() {
    this.toast.addMessage(`"${this.form.get('name').value}" was saved successfully.`, 'Saved', ToastLevelEnum.success);
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
