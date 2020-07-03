import { Subject } from 'rxjs';

import { ToastLevelEnum } from './toast-level.enum';
import { Status } from './toast-status.enum';

/**
 * A notification message that is temporarily to the user.
 *
 * These messages will automatically close themselves after a
 * set period of time (15 seconds), if the user does not dismiss
 * them.
 */
export class ToastMessage {

  private internalStatus = Status.adding;
  statusSubject = new Subject<Status>();

  private transitionDelay = 400; // delay between changing adding->active or removing->removed
  private ttl = 15_000; // time (ms) before the message is automatically dismissed

  ttlTimerId: any;

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

  /**
   * Begins the process of removing this message from the currently-displayed
   * set of toast messages.
   *
   * There is a delay of 400ms from the time this method is called until
   * the hosting component is notified that this object should be removed
   * (to allow for some UI fade-out animation).
   */
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
