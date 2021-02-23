import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { drf } from '@nusantara/models';


@Component({
  selector: 'nus-social-media-host',
  template: `
    <tr [formGroup]="form">
      <td>
        <select formControlName="href" data-qa="types" [formControl]="type">
          <option [ngValue]="null">---</option>
          <option *ngFor="let type of socialMediaTypes" [ngValue]="type.value">
            {{ type.displayName }}
          </option>
        </select>
      </td>
      <td>
        <input type="url" [formControl]="url" data-qa="url" placeholder="https://...">
      </td>
      <td>
        <button (click)="remove.emit()" type="button" class="remove-button" data-qa="remove-button">
          <i class="material-icons">remove_circle_outline</i>
        </button>
      </td>
    </tr>
  `,
  styles: [
    ':host { display: contents; }',
    'td > select { width: 100%; }'
  ]
})
export class SocialMediaHostComponent implements OnInit, AfterViewInit {

  @Input() socialMediaTypes: drf.IChoice[];
  @Input() form: FormGroup;
  @Output() remove = new EventEmitter<void>();

  constructor(public route: ActivatedRoute,
              public router: Router) {
  }

  get type(): FormControl { return this.form.get('type') as FormControl; }
  get url(): FormControl { return this.form.get('url') as FormControl; }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

}
