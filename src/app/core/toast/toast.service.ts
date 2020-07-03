import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ToastLevelEnum } from './toast-level.enum';
import { ToastMessage } from './toast-messsage';

/**
 * Registers messages for display by the Toast service.
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public subject = new Subject<ToastMessage>();

  /**
   * Registers a new toast message for displaying by the toast component.
   *
   * @param message Text to be displayed to the user.
   * @param title Heading text for the message (short!)
   * @param level Theme for the message (defaults to 'info')
   *
   * @see ToastLevelEnum
   * @see ToastMessage
   * @see ToastComponent
   */
  addMessage(message: string, title: string, level: ToastLevelEnum = ToastLevelEnum.info) {
    this.subject.next(
      new ToastMessage(title, message, level)
    );
  }

  /**
   * Convenience method for adding a 'success'-themed message.
   *
   * @see ToastService.addMessage
   */
  addSuccess(message: string, title?: string) {
    const defaultSuccessTitle = 'Success';
    this.addMessage(message, title ?? defaultSuccessTitle, ToastLevelEnum.success);
  }

  /**
   * Convenience method for adding an 'error'-themed message.
   *
   * @see ToastService.addMessage
   */
  addError(message: string, title?: string) {
    const defaultErrorTitle = 'Error';
    this.addMessage(message, title ?? defaultErrorTitle, ToastLevelEnum.error);
  }

}
