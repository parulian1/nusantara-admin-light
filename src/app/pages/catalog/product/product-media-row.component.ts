import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { IChoiceFieldChoice } from '@nusantara/core';

/**
 * A single media object (youtube video or image) configured for a
 * product.
 *
 * This in intended for displaying as a row within a table.
 *
 * @see IProduct
 */
@Component({
  selector: 'nus-product-media-row',
  template: `
    <tr [formGroup]="form">
      <td>
        <select formControlName="type">
          <option *ngFor="let mt of this.mediaTypes" [ngValue]="mt.value">
            {{ mt.displayName }}
          </option>
        </select>
      </td>
      <td *ngIf="type.value === 'image'">
        <input type="file" formControlName="image">
      </td>
      <td *ngIf="type.value === 'you_tube'">
        <input type="text" formControlName="youtubeVideoId">
      </td>
      <td><button (click)="remove.emit()" type="button"></button></td>
    </tr>
  `,
  styles: [':host { display: contents; }' ]
})
export class ProductMediaRowComponent {

  @Input() mediaTypes: Array<IChoiceFieldChoice>;
  @Input() form: FormGroup;
  @Output() remove: EventEmitter<void> = new EventEmitter();

  get type(): FormControl { return this.form.get('type') as FormControl; }
  get youtubeVideoId(): FormControl { return this.form.get('youtubeVideoId') as FormControl; }
  get image(): FormControl { return this.form.get('image') as FormControl; }

}
