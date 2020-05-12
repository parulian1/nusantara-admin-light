import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

export abstract class AbstractDetailComponent {

  route: ActivatedRoute;
  router: Router;
  form: FormGroup;
  service: any;

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
    return !this.form?.get('href');
  }

  abstract delete(): void;


}
