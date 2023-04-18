import { Component, OnInit } from '@angular/core';
import { Navigation, Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Usuario } from 'src/modelo/Usuario';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { GlobalMethodsService } from '../global-methods.service';
import { ModificarUsuarioPage } from '../modificar-usuario/modificar-usuario.page';
import { NativeAudio } from '@capacitor-community/native-audio'

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  //======================================================================================================================================

  //===========
  //|Atributos|
  //===========

  usuarios: Array<Usuario> = new Array();
  usuariosMuestra: Array<Usuario> = new Array();
  textoBuscar: string = '';
  tipo: string = 'todo';

  private globalUsu: Usuario = new Usuario();

  constructor(
    private modalController: ModalController,
    private fireService: FireServiceProvider,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private globalVariable: GlobalMethodsService,
    private router:Router
  ) {} //end constructor

  //======================================================================================================================================

  //=============
  //|Fases Ionic|
  //=============

  ngOnInit() {
     //Carga del audio
     NativeAudio.preload({
      assetId: "alerta",
      assetPath: "../../assets/audio/alert.wav",
      audioChannelNum: 1,
      isUrl: false
    });


    this.globalUsu=this.globalVariable.usuGlobal
    this.getUsuarios();
  } //end ngOnInit

  //======================================================================================================================================

  //==========
  //|Firebase|
  //==========

  getUsuarios() {
    this.presentLoading().then(()=>{
      this.fireService.getUsuariosTR().subscribe((resultadoConsulta:any) => {
        this.usuariosMuestra = new Array<Usuario>();
        this.usuarios = new Array<Usuario>();
        this.loadingCtrl.dismiss()
        resultadoConsulta.forEach((datos: any) => {
          let usuario: Usuario = Usuario.createFromJsonObject(
            datos.payload.doc.data()
          );
          this.usuarios.push(usuario);
         
  
          //Ordenar usuarios alfabéticamente
          this.usuarios.sort(this.ordenar);
          this.usuariosMuestra.sort(this.ordenar);
  
          this.cambioTipo()
          this.loadingCtrl.dismiss()
        });
      });
    })
   
  } //end getUsuarios

  borrarUsuario(usuario: Usuario) {
    this.fireService
      .eliminarUsuario(usuario,true)
      .then(() => {})
      .catch((error: string) => {});
  } //end borrarUsuario

  //======================================================================================================================================

  //================
  //|Alerts Dialogs|
  //================

  opciones(usuario: Usuario) {
    this.alertCtrl
      .create({
        cssClass:'app-alert',
        header:'Opciones',
        buttons: [
          {text:'Cambiar administrador',
          handler:()=>{
            if(!usuario.gestor)
            usuario.gestor=true
          else
            usuario.gestor=false

          this.fireService.modificarUsuario(usuario)

          }},
          {text:'Cambiar estado',
          handler:()=>{
            if(!usuario.estado)
              usuario.estado=true
            else
              usuario.estado=false

            this.fireService.modificarUsuario(usuario)
            
          }},
         
          {
            text: 'Modificar',
            handler: () => {
              this.ventanaModal(usuario);
            },
          },

          {
            text: 'Borrar',
            handler: () => {
              if (usuario.id != this.globalUsu.id) 
                this.confirmar(usuario);
              else
                this.presentToast(
                  'Estas autenticado con este mismo usuario, no puede ser borrado'
                );
            },
          },

          {text:'Cancelar'}
        ],
      })
      .then((res) => {
        res.present();
      });
  } //end opciones

  confirmar(usuario: Usuario) {
    this.audio();
    this.alertCtrl
      .create({
        cssClass:'app-alert',
        header: '¿Estas seguro de borrar la usuario?',
        buttons: [
          {
            text: 'Borrar',
            handler: () => {
              this.borrarUsuario(usuario);
            },
          },
          {
            text: 'Cancelar',
            handler: () => {},
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  } //end confirmar

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

  //==================
  //|Ventanas modales|
  //==================


  async ventanaModal(usuario: Usuario) {
    const modal = await this.modalController.create({
      component: ModificarUsuarioPage,
      componentProps: {
        usuarioJson: JSON.stringify(usuario),
        propio: JSON.stringify(false),
      },
    });

    let mensaje = '';
    mensaje +=
      '<strong>Usuario:</strong> ' +
      usuario.nombre.charAt(0).toUpperCase() +
      usuario.nombre.slice(1) +
      ' ' +
      usuario.apellidos.charAt(0).toUpperCase() +
      usuario.apellidos.slice(1);

    this.presentToast(mensaje);

    modal.onDidDismiss().then(() => {
      this.getUsuarios();
      this.textoBuscar = '';
    });
    return await modal.present();
  } //end ventanaModal  

  //======================================================================================================================================

  //===============
  //|Otros métodos|
  //===============

  ordenar(a:any, b:any) {
    return a.nombre.localeCompare(b.nombre);
  } //end ordenar

  cambioTipo() {
    this.usuariosMuestra = new Array();
    if (this.tipo !== 'todo') {
      if (this.tipo === 'true') {
        this.usuarios.forEach((usuario: Usuario) => {
          if (usuario.gestor) this.usuariosMuestra.push(usuario);
        });
      } else {
        this.usuarios.forEach((usuario: Usuario) => {
          if (!usuario.gestor) this.usuariosMuestra.push(usuario);
        });
      }
    } else {
      this.usuariosMuestra = this.usuarios;
    }
    this.usuariosMuestra.sort((a, b) =>
      a.nombre.localeCompare(b.nombre) ? 1 : -1
    );
  } //end cambioTipo

  buscar(ev:any) {
    this.textoBuscar = ev.detail.value;
  } //end buscar

  async presentLoading() {
    let loading = await this.loadingCtrl.create({
      message: 'Cargando usuarios...',
      spinner: 'bubbles',
    });
    return loading.present();
  }//end presentLoading

  registrarUsu(){
    this.router.navigate(['/registro'])
  }

  
  audio() {

    //Cojo la duración del audio
    let duracion!: number;

    NativeAudio.getDuration({
      assetId: 'alerta'
    })
      .then(result => {
        duracion = result.duration;
      })


    //Ejecuto el audio
    NativeAudio.play({
      assetId: 'alerta',
      time: duracion
    });
  }//end audio

} //end class
