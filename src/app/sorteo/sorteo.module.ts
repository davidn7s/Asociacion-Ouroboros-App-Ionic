import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SorteoPageRoutingModule } from './sorteo-routing.module';

import { SorteoPage } from './sorteo.page';
import { PipesModule } from '../pipes/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SorteoPageRoutingModule,
    PipesModule
    
  ],
  declarations: [SorteoPage]
})
export class SorteoPageModule {}
