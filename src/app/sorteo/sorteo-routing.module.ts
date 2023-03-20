import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SorteoPage } from './sorteo.page';

const routes: Routes = [
  {
    path: '',
    component: SorteoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SorteoPageRoutingModule {}
