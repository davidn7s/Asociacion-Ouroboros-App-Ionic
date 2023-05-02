import { Component } from '@angular/core';
import { Usuario } from 'src/modelo/Usuario';
import { AppComponent } from '../app.component';
import { GlobalMethodsService } from '../global-methods.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  //============================================================================================================

  //===========
  //|Atributos|
  //===========
  globalUsu: Usuario = new Usuario();

  constructor(private appComponent: AppComponent, private globalVar: GlobalMethodsService,) { }



  //============================================================================================================

  //=============
  //|Fases Ionic|
  //=============
  ionViewWillEnter() {
    //Hacer que el menú lateral refresque que usuario es el logueado
    this.appComponent.getGlobalUsu();
    
    this.globalUsu = this.globalVar.usuGlobal;
  }




}
