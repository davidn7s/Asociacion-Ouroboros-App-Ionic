import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/modelo/Usuario';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { FirebaseAuthService } from 'src/providers/api-service/firebase-auth-service';
import { GlobalMethodsService } from '../global-methods.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  //============================================================================================================

  //===========
  //|Atributos|
  //===========

  correo!: string;
  contrasenna!: string;
  control: boolean = false
  showPassword = false;
  passwordToggleIcon = 'eye'
  private archivo = new Audio('../../assets/audio/error.mp3')
  private listData = []


  constructor(
    public fireAuth: FirebaseAuthService,
    private globalVar: GlobalMethodsService,
    private toastController: ToastController,
    private router: Router,
    private fireService: FireServiceProvider,
    private loadingController: LoadingController,
    public alertCtrl: AlertController,
    private dataService: DataService) {
      this.loadData();
  }

  //============================================================================================================

  //=============
  //|Fases Ionic|
  //=============

  ngOnInit() {
  }





  //============================================================================================================

  //==========
  //|Firebase|
  //==========

  login() {
    this.pantallaCarga().then(() => {
      this.fireAuth.loginUser(this.correo, this.contrasenna)
        .then(() => {
          this.presentToast("Login Correcto!!!")

          if (this.control) {
            this.addData()
           }

          this.fireService
            .getUsuarioByEmail(this.correo)
            .then((data: Usuario) => {
              this.loadingController.dismiss()
              this.globalVar.usuGlobal = data;
              this.router.navigate(['/home']);
            })
            .catch((error: any) => {
              this.loadingController.dismiss()
              this.audio();
              this.presentToast('Ha ocurrido un error inesperado');
            });


        }).catch((error: string) => {
          console.log(error)
          this.audio();
          this.presentToast("Error, el correo electronico o la contraseña son incorrectos")
          this.loadingController.dismiss();
        })
    })

  }//end login



  async loadData(){
    this.dataService.getData().subscribe(res=>{
      
      this.listData=res
    })
  }//end loadData


  async addData(){
    await this.dataService.addData(('email '+this.correo))
    await this.dataService.addData(('contra '+this.contrasenna))
    this.loadData()
  }//end addData



  //============================================================================================================

  //===============
  //|Otros Métodos|
  //===============

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }//end Toast



  async pantallaCarga() {
    const loading = await this.loadingController.create({
      message: 'Realizando login ...',
      spinner: 'bubbles',
      cssClass:'loader-css-class',
      translucent: true,
    });
    return loading.present();
  }//end pantallaCarga



  togglePassword() {
    this.showPassword = !this.showPassword;

    if (this.passwordToggleIcon == 'eye')
      this.passwordToggleIcon = 'eye-off'
    else
      this.passwordToggleIcon = 'eye'
  }//end togglePassword


  deshabilitado() {
    if (this.correo == null)
      return true;
    if (this.correo == '')
      return true;
    if (!/^[a-zA-Z0-9_.+-]+[@]{1}[a-zA-Z0-9-]+[.]{1}[a-zA-Z]+$/.test(this.correo))
      return true;
    if (this.contrasenna == null)
      return true;
    if (this.contrasenna == '')
      return true
    if (this.contrasenna.length < 6)
      return true;

    return false;
  }//end deshabilitar


  recordar(correo: any) {
    this.presentToast('Se le ha enviado correo electrónico para recuperar su contraseña,' +
      '<strong> puede estar en la carpeta de spam</strong>')
    this.fireAuth.resetPassword(correo)
  }

  reset() {
    this.alertCtrl
      .create({
        cssClass: 'app-alert',
        header:
          'Introduzca el correo electronico para recuperar la contraseña',
        inputs: [
          {
            name: 'mail',
            type: 'email',
            placeholder: 'Correo Electrónico',
          }
        ],
        buttons: [

          {
            text: 'Cancelar',
            handler: () => {
              console.log('Cancelar');
            },
          },
          {
            text: 'Aceptar',
            handler: (data: any) => {
              this.recordar(data['mail'])

            },
          }
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  audio() {
    this.archivo.play()
  }//end audio

}
