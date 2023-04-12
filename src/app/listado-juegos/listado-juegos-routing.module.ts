import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoJuegosPage } from './listado-juegos.page';

const routes: Routes = [
  {
    path: '',
    component: ListadoJuegosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListadoJuegosPageRoutingModule {}
