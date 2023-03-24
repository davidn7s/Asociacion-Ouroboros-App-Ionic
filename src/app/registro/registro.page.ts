import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/modelo/Usuario';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { FirebaseAuthService } from 'src/providers/api-service/firebase-auth-service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  usuario: Usuario = new Usuario();
  contrasenna: string = '';
  repetirContrasenna: string = '';

  showPassword = false;
  passwordToggleIcon = 'eye'

  constructor(
    private firebaseService: FireServiceProvider,
    private fireAuth: FirebaseAuthService,
    private menu: MenuController,
    private toastCtrl:ToastController,
    private router:Router,
    private loadingCtrl:LoadingController
  ) { }


  //======================================================================================================================================

  //=============
  //|Fases Ionic|
  //=============

  ngOnInit() {
  }//end ngOnInit

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

  insertar() {
    this.pantallaCarga();
    this.fireAuth
      .loginUser(this.usuario.email, this.contrasenna)
      .then((usuario: Usuario) => {
        this.presentToast(
          'Error, email ya registrado, no se ha podido registrarse el usuario'
        );
        this.cerrarCarga();
      })
      .catch((error: string) => {
        this.firebaseService
          .insertarUsuario(this.usuario)
          .then(() => {
            this.fireAuth
              .registerUser(this.usuario.email, this.contrasenna)
              .then((data) => {
                this.cerrarCarga();
                this.presentToast('Registro completado');
                this.router.navigate(['usuarios'])
              })
              .catch((error) => {
                this.cerrarCarga();
                this.firebaseService.eliminarUsuario(this.usuario, false);
              });
          })
          .catch((error: string) => {});
      });
  }//end insertar




  //======================================================================================================================================

  //========
  //|Toasts|
  //========

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 6000,
    });
    toast.present();
  } //end Toast


  //======================================================================================================================================

  //===============
  //|Otros métodos|
  //===============

  deshabilitado() {
    if (this.usuario.nombre == '') {
      return true;
    }
    if (this.usuario.nombre.length < 3) {
      return true;
    }
    if (this.usuario.apellidos == '') {
      return true;
    }
    if (this.usuario.apellidos.length < 3) {
      return true;
    }
    if (this.usuario.email == '') {
      return true;
    }
    if (this.usuario.cargo == '') {
      return true;
    }
    if (this.contrasenna == '') {
      return true;
    }
    if (this.repetirContrasenna == '') {
      return true;
    }
    if (this.contrasenna != this.repetirContrasenna) {
      return true;
    }//end deshabilitar



    return false;
  } // end deshabilitado

  togglePassword() {
    this.showPassword = !this.showPassword;

    if (this.passwordToggleIcon == 'eye')
      this.passwordToggleIcon = 'eye-off'
    else
      this.passwordToggleIcon = 'eye'
  }//end togglePassword


  
  async pantallaCarga() {
    const loading = await this.loadingCtrl.create({
      message: 'Registrando usuario ...',
      duration: 20000,
      spinner: 'bubbles',
      translucent: true,
    });
    await loading.present();
  }//end pantallaCarga

  async cerrarCarga() {
    return await this.loadingCtrl.dismiss();
  }//end cerrarCarga

}//end class
