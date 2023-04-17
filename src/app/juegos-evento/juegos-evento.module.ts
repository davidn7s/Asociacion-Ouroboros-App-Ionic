import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JuegosEventoPageRoutingModule } from './juegos-evento-routing.module';

import { JuegosEventoPage } from './juegos-evento.page';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JuegosEventoPageRoutingModule,
    PipesModule
  ],
  declarations: [JuegosEventoPage]
})
export class JuegosEventoPageModule {}
