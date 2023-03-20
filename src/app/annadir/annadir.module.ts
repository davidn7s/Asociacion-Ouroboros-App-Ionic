import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnnadirPageRoutingModule } from './annadir-routing.module';

import { AnnadirPage } from './annadir.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnnadirPageRoutingModule,ReactiveFormsModule  ],
  declarations: [AnnadirPage]
})
export class AnnadirPageModule {}
