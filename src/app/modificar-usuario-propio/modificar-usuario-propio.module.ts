import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarUsuarioPropioPageRoutingModule } from './modificar-usuario-propio-routing.module';

import { ModificarUsuarioPropioPage } from './modificar-usuario-propio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarUsuarioPropioPageRoutingModule
  ],
  declarations: [ModificarUsuarioPropioPage]
})
export class ModificarUsuarioPropioPageModule {}
