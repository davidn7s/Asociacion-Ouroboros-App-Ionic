import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SortearPage } from './sortear.page';

const routes: Routes = [
  {
    path: '',
    component: SortearPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SortearPageRoutingModule {}
