import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionListComponent } from '@nusantara/pages/promotion/promotion';

const routes: Routes = [
  {
    path: 'promotions',
    children: [
      {
        path: '',
        component: PromotionListComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule { }
