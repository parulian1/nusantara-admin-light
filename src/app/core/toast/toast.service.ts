import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ToastLevelEnum } from './toast-level.enum';
import { ToastMessage } from './toast-messsage';

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
}
