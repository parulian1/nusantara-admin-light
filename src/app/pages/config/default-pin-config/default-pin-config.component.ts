import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {AbstractDetailComponent, ToastService} from '@nusantara/core';
import {IDefaultPinConfig} from '@nusantara/models/default-pin-config';
import {DefaultPinConfigService} from '@nusantara/services/default-pin-config.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'nus-default-pin-config',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      [typeName]="entityTypeName">
    </nus-detail-title>

    <ul class="non-field-errors" *ngIf="!!nonFieldErrors.length">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>

    <form [formGroup]="form" (ngSubmit)="save()">
      <label class="has-icons-right">
        <span i18n>{{ this.formLabel }} Default PIN (4 digits numeric)</span>
        <input class="input" type="password" maxlength="4" [formControl]="pin" placeholder="Input PIN"/>
        <span class="icon icon-password is-right">
          <i class="material-icons">
            visibility
          </i>
        </span>
      </label>

      <nus-detail-actions
        [component]="this"
        [hideDelete]="true"
        (cancel)="navigateToParent(true)">
      </nus-detail-actions>
    </form>
  `,
  styles: [`
    .has-icons-right {
      position: relative;
    }

    .has-icons-right input {
      padding-right: 2.5em !important;
    }

    .has-icons-right .icon.is-right {
      right: 0;
    }

    .has-icons-right .icon {
      color: rgba(0, 0, 0, 1);
      height: 2.5em;
      pointer-events: none;
      position: absolute;
      width: 2.5em;
      z-index: 4;
    }

    .icon-password .material-icons {
      pointer-events: initial;
      cursor: pointer;
      margin-left: 0.3rem;
      margin-top: 0.5rem;
    }
  `]
})

export class DefaultPinConfigComponent extends AbstractDetailComponent<IDefaultPinConfig> implements OnInit, AfterViewInit {
  entity?: IDefaultPinConfig;
  private show = false;

  passwordField: any;
  controlDiv: any;
  passwordIcon: any;
  icon: any;
  formLabel: string;

  constructor(service: DefaultPinConfigService,
              router: Router,
              route: ActivatedRoute,
              public fb: FormBuilder,
              toast: ToastService,
              private el: ElementRef) {
    super(route, router, toast, service);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((data: { entity: IDefaultPinConfig}) => {
      console.log(data.entity);
      this.entity = data.entity;
    });
    this.formLabel = this.entity.pin ? 'Update' : 'Set';
    this.originalEntityName = 'PIN';
  }

  get pin(): FormControl { return this.form.get('pin') as FormControl; }

  initializeForm(entity?: IDefaultPinConfig) {
    this.entity = entity;
    this.form = this.fb.group({
      href: [entity?.href],
      pin: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(4)]],
    });
  }

  // Start toggle password visibility function
  ngAfterViewInit() {
    this.initialSelector();
    this.initialEvent();
  }

  initialSelector(): void {
    this.controlDiv = this.el.nativeElement;
    this.passwordField = this.controlDiv.querySelector('.input');
    this.passwordIcon = this.controlDiv.querySelector('.icon');
    this.icon = this.passwordIcon.querySelector('i');
  }

  initialEvent(): void {
    this.passwordIcon.addEventListener('click', () => {
      this.passwordField.focus();
      this.toggle();
      this.toggleIcon();
    });
  }

  toggle(): void {
    this.show = !this.show;
    this.passwordField.setAttribute('type',
      this.show ? 'text' : 'password'
    );
  }

  toggleIcon(): void {
    this.icon.innerHTML = this.show ? 'visibility_off' : 'visibility';
  }
  // End toggle password visibility function
}
