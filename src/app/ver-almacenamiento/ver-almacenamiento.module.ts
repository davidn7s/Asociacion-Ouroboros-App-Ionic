import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerAlmacenamientoPageRoutingModule } from './ver-almacenamiento-routing.module';

import { VerAlmacenamientoPage } from './ver-almacenamiento.page';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerAlmacenamientoPageRoutingModule,
    PipesModule
  ],
  declarations: [VerAlmacenamientoPage]
})
export class VerAlmacenamientoPageModule {}
