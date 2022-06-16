import { Component, OnInit } from '@angular/core';
import { ConfigChatService } from '@nusantara/services';
import { IConfigChat, ProviderChoices } from '@nusantara/models';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'nus-config-chat-service',
  template: `
    <ng-container *ngIf="isLoaded">
      <div>
        <h2 i18n>Chat Service</h2>
        <form [formGroup]="form">
          <div>
            <div>
              <select name="" id="" [formControl]="provider" (change)="onProviderChange($event)">
                <option value="" i18n>-- Select Live Chat --</option>
                <option
                  *ngFor="let provider of providers"
                  [ngValue]="provider.value"
                >
                  {{ provider.name }}
                </option>
              </select>
            </div>

            <div style="margin-top: 0.5rem;">
              <textarea [formControl]="widgetCode"></textarea>
              <p style="margin: 0;" i18n>
                <i>* Input widget code (script) of chat service in here.</i>
              </p>
            </div>
          </div>
        </form>
      </div>
    </ng-container>
  `
})
export class ConfigChatServiceComponent implements OnInit {
  isLoaded = false;
  form: FormGroup;

  chats: IConfigChat[] = [];
  providers: { value: string; name: string }[] = [];

  constructor(private service: ConfigChatService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.providers = [{ name: 'Zendesk', value: ProviderChoices.ZENDESK }];
    this.service.fetchAll().subscribe((chats) => {
      this.isLoaded = true;
      this.chats = chats;
      this.initializeForm(this.chats[0] || null);
    });
  }

  initializeForm(entity?: IConfigChat) {
    this.form = this.fb.group({
      provider: [
        entity?.provider ?? '',
        [Validators.required],
      ],
      widgetCode: [null ?? entity?.widgetCode, [Validators.required]],
      isDefault: [true],
    });
  }

  get provider(): FormControl {
    return this.form?.get('provider') as FormControl;
  }

  get widgetCode(): FormControl {
    return this.form?.get('widgetCode') as FormControl;
  }

  /**
   * easy technic to save /update config,
   * delete all then create new one
   */
  save(): Observable<unknown> {
    return this.service
      .deleteAll()
      .pipe(
        mergeMap(() => {
          // has value mean create one
          if (this.provider.value) {
            return this.service.create(this.form.value);
          } else {
            return of([]);
          }
        }),
      );
  }

  /**
   * whenever user change provider to `-- select live chat --`
   * remove exist widgetCode value
   */
  onProviderChange(ev: any): void {
    if (!ev.target.value) {
      this.widgetCode.setValue('', {onlySelf: true});
    }
  }
}
