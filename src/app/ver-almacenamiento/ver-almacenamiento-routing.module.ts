import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerAlmacenamientoPage } from './ver-almacenamiento.page';

const routes: Routes = [
  {
    path: '',
    component: VerAlmacenamientoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerAlmacenamientoPageRoutingModule {}
