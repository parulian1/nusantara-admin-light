import { Component, OnInit } from '@angular/core';

import { ToastService } from './toast.service';
import { Status, ToastMessage } from './toast-messsage';

@Component({
  selector: 'nus-toast',
  template: `
    <ul>
      <li *ngFor="let msg of displayedMessages" [ngClass]="[msg.level, msg.status]">
        <div>
          <span>
            <i class="material-icons" *ngIf="msg.level === 'error'">error</i>
            <i class="material-icons" *ngIf="msg.level === 'success'">done_all</i>
            {{msg.title}}
          </span>
          <button (click)="msg.dismiss()">
            <i class="material-icons">highlight_off</i>
          </button>
        </div>
        <div [innerHtml]="msg.message"></div>
      </li>
    </ul>
  `,
  styles: [`
    ul { list-style-type: none; transition: all .4s; }

    /* Level Colors */
    li.success { border-left: solid 5px var(--success); }
    li.error { border-left: solid 5px var(--error); }
    li.info { border-left: solid 5px var(--info); }

    li.success div:first-child > span { color: var(--success); }
    li.error div:first-child > span { color: var(--error); }
    li.error div:first-child > span > i { font-size: 1em; }

    li.active { opacity: 1; }
    li.removing { opacity: 0; }
    li.removed { opacity: 0; }

    li {
      opacity: 0;
      margin: 15px;
      background-color: white;
      box-shadow: 0 0 8px -1px rgba(0,0,0,0.44);
      padding: 10px;
      transition: all .4s;
      min-width: 350px;
    }
    div:first-child {
      font-weight: bold;
      margin-bottom: 5px;
      display: flex;
    }
    div:first-child :last-child {
      margin-left: auto;
      background: none;
      border: none;
      padding: 0;
    }
  `]
})
export class ToastComponent implements OnInit {

  constructor(private service: ToastService) { }

  public displayedMessages: Array<ToastMessage> = [];

  ngOnInit() {
    this.service.subject.subscribe((message) => {
      this.displayedMessages.push(message);
      message.statusSubject.subscribe((status) => {
        if (status === Status.removed) {
          const msgIndex = this.displayedMessages.indexOf(message);
          this.displayedMessages.splice(msgIndex, 1);
        }
      });
    });
  }
}
