import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
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
  messages: Observable<ToastMessage>;

  addMessage(message: string, title: string, level: ToastLevelEnum = ToastLevelEnum.info) {
    this.subject.next(
      new ToastMessage(title, message, level)
    );
  }

  // convenience method
  addSuccess(message: string, title?: string) {
    const defaultSuccessTitle = 'Success';
    this.addMessage(message, title ?? defaultSuccessTitle, ToastLevelEnum.success);
  }

  // convenience method
  addError(message: string, title?: string) {
    const defaultErrorTitle = 'Error';
    this.addMessage(message, title ?? defaultErrorTitle, ToastLevelEnum.error);
  }

}
