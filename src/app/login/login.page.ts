import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/modelo/Usuario';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { FirebaseAuthService } from 'src/providers/api-service/firebase-auth-service';
import { GlobalMethodsService } from '../global-methods.service'; 
import { NativeAudio } from '@capacitor-community/native-audio';

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
  private listData = []
  
  constructor(
    public fireAuth: FirebaseAuthService, 
    private globalVar: GlobalMethodsService, 
    private toastController: ToastController, 
    private router: Router, 
    private fireService: FireServiceProvider, 
    private loadingController: LoadingController,
    public alertCtrl: AlertController) {
  }

  //============================================================================================================

  //=============
  //|Fases Ionic|
  //=============

  ngOnInit() {
        //Carga del audio
        NativeAudio.preload({
          assetId: "error",
          assetPath: "../../assets/audio/error.mp3",
          audioChannelNum: 1,
          isUrl: false
        });

  }

  ionViewWillLeave() {
    NativeAudio.unload({
      assetId: 'error',
    });
  } //end ionViewWillLeave

  



  //============================================================================================================

  //==========
  //|Firebase|
  //==========

  login() {
    this.pantallaCarga().then(()=>{
      this.fireAuth.loginUser(this.correo, this.contrasenna)
      .then(() => {
        this.presentToast("Login Correcto!!!")


        this.fireService
          .getUsuarioByEmail(this.correo)
          .then((data: Usuario) => {
            this.loadingController.dismiss()
            this.globalVar.usuGlobal = data;
            this.router.navigate(['/home']);
          })
          .catch((error:any) => {
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


  recordar(correo:any) {
    this.presentToast('Se le ha enviado correo electrónico para recuperar su contraseña,'+
    '<strong> puede estar en la carpeta de spam</strong>')
    this.fireAuth.resetPassword(correo)
  }

  reset(){
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

      //Cojo la duración del audio
      let duracion!: number;
        
  
      NativeAudio.getDuration({
        assetId: 'error'
      })
        .then(result => {
          duracion = result.duration;
        })
  
  
      //Ejecuto el audio
      NativeAudio.play({
        assetId: 'error',
        time: duracion
      });
    }//end audio


}
