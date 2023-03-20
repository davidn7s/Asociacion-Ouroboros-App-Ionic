import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SortearPageRoutingModule } from './sortear-routing.module';

import { SortearPage } from './sortear.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SortearPageRoutingModule
  ],
  declarations: [SortearPage]
})
export class SortearPageModule {}
