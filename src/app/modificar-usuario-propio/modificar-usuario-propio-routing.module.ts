import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarUsuarioPropioPage } from './modificar-usuario-propio.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarUsuarioPropioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarUsuarioPropioPageRoutingModule {}
