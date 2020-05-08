import { ActivatedRoute, Router } from '@angular/router';

export abstract class AbstractDetailComponent {

  protected route: ActivatedRoute;
  protected router: Router;

  protected navigateToParent() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

}
