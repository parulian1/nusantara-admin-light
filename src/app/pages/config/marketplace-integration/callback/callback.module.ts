import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@nusantara/shared';
import { CallbackRoutingModule } from './callback-routing.module';
import { CallbackComponent } from './callback.component';


@NgModule({
  declarations: [
    CallbackComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CallbackRoutingModule,
    SharedModule,
  ]
})
export class CallbackModule { }
