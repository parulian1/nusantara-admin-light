import { ToastLevelEnum } from './toast-level.enum';
import { Subject } from 'rxjs';

export enum Status {
  adding = 'adding',
  active = 'active',
  removing = 'removing',
  removed = 'removed'
}

export class ToastMessage {

  private internalStatus = Status.adding;
  statusSubject = new Subject<Status>();

  private transitionDelay = 400;
  private ttl = 15_000;

  ttlTimerId: number;

  constructor(public title: string,
              public message: string,
              public level: ToastLevelEnum) {

    /* Add a slight delay until we are in the 'active' status so CSS will fade-in. */
    setTimeout(() => { this.status = Status.active; }, this.transitionDelay);

    this.ttlTimerId = setTimeout(() => {
      this.dismiss();
    }, this.ttl);
  }

  get status(): Status {
    return this.internalStatus;
  }
  set status(value) {
    this.internalStatus = value;
    this.statusSubject.next(this.status);
  }

  dismiss() {
    if (this.ttlTimerId) {
      clearTimeout(this.ttlTimerId);
    }
    this.status = Status.removing;
    this.ttlTimerId = setTimeout(() => {
      this.status = Status.removed;
    }, this.transitionDelay);
  }

}
