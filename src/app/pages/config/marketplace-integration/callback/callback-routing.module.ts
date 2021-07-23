import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CallbackComponent} from './callback.component';
import { RequireLoggedInGuard } from '@nusantara/auth/guards';

const authRoutes: Routes = [
  {
    path: '',
    component: CallbackComponent,
    canActivate: [RequireLoggedInGuard, ],
  },
  {
    path: 'lazada',
    component: CallbackComponent,
    canActivate: [RequireLoggedInGuard, ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class CallbackRoutingModule { }
