import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnnadirJuegoPage } from './annadir-juego.page';

const routes: Routes = [
  {
    path: '',
    component: AnnadirJuegoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnnadirJuegoPageRoutingModule {}
