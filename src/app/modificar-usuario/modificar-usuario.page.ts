import { Component, Input, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { Usuario } from 'src/modelo/Usuario';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { AppComponent } from '../app.component';
import { GlobalMethodsService } from '../global-methods.service';

@Component({
  selector: 'app-modificar-usuario',
  templateUrl: './modificar-usuario.page.html',
  styleUrls: ['./modificar-usuario.page.scss'],
})
export class ModificarUsuarioPage implements OnInit {
  //======================================================================================================================================

  //===========
  //|Atributos|
  //===========

  @Input() usuarioJson: any;
  @Input() propio: any;

  usuario!: Usuario;
  private globalUsu: Usuario = new Usuario();
  private gestor: boolean = false;
  private propioC: boolean = false;

  constructor(
    private firebaseService: FireServiceProvider,
    private modalCtrl: ModalController,
    private menu: MenuController,
    private globalVariable: GlobalMethodsService
  ) { } //end constructor

  //======================================================================================================================================

  //=============
  //|Fases Ionic|
  //=============

  ngOnInit() {
    this.globalUsu = this.globalVariable.usuGlobal;
    this.usuario = Usuario.createFromJsonObject(JSON.parse(this.usuarioJson));
    this.propioC = JSON.parse(this.propio);
  } //end ngOnInit

  ionViewWillEnter() {
    this.menu.enable(false);
  } //end ionViewWillEnter

  ionViewWillLeave() {
    this.menu.enable(true);
  } //end ionViewWillLeave

  //======================================================================================================================================

  //==========
  //|Firebase|
  //==========

  modificar() {

    this.firebaseService
      .modificarUsuario(this.usuario)
      .then(() => { })
      .catch((error: string) => { });


    if (this.propioC) {
      this.globalVariable.usuGlobal = this.usuario;
    }


    this.closeModal();
  } //end modificar

  //======================================================================================================================================

  //==================
  //|Ventanas modales|
  //==================

  closeModal() {
    this.modalCtrl.dismiss();
  } //end closeModal

  //======================================================================================================================================

  //===============
  //|Otros métodos|
  //===============

  deshabilitado() {
    if (this.usuario.nombre == null) {
      return true;
    }
    if (this.usuario.nombre == '') {
      return true;
    }
    if (this.usuario.nombre.length < 3) {
      return true;
    }
    if (this.usuario.apellidos == null) {
      return true;
    }
    if (this.usuario.apellidos == '') {
      return true;
    }
    if (this.usuario.apellidos.length < 3) {
      return true;
    }
    if (this.usuario.email == null) {
      return true;
    }
    if (this.usuario.email == '') {
      return true;
    }
    if(this.usuario.cargo==null){
      return true;
    }
    if(this.usuario.cargo==''){
      return true;
    }

    return false;
  } // end deshabilitado

}//end class
