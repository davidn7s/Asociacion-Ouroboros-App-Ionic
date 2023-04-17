import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JuegosEventoPage } from './juegos-evento.page';

const routes: Routes = [
  {
    path: '',
    component: JuegosEventoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JuegosEventoPageRoutingModule {}
