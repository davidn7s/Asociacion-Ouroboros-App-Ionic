import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoJuegosPageRoutingModule } from './listado-juegos-routing.module';

import { ListadoJuegosPage } from './listado-juegos.page';
import { PipesModule } from '../pipes/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListadoJuegosPageRoutingModule,
    PipesModule
  ],
  declarations: [ListadoJuegosPage]
})
export class ListadoJuegosPageModule {}
