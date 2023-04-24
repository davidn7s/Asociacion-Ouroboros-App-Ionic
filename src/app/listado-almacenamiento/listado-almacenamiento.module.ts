import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoAlmacenamientoPageRoutingModule } from './listado-almacenamiento-routing.module';

import { ListadoAlmacenamientoPage } from './listado-almacenamiento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListadoAlmacenamientoPageRoutingModule
  ],
  declarations: [ListadoAlmacenamientoPage]
})
export class ListadoAlmacenamientoPageModule {}
