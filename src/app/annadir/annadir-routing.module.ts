import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnnadirPage } from './annadir.page';

const routes: Routes = [
  {
    path: '',
    component: AnnadirPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnnadirPageRoutingModule {}
