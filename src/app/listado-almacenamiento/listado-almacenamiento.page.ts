import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { Almacenamiento } from 'src/modelo/Almacenamiento';
import { Juego } from 'src/modelo/Juego';
import { JuegoEvento } from 'src/modelo/JuegoEvento';
import { Usuario } from 'src/modelo/Usuario';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { AppComponent } from '../app.component';
import { GlobalMethodsService } from '../global-methods.service';
import { VerAlmacenamientoPage } from '../ver-almacenamiento/ver-almacenamiento.page';
import { NativeAudio } from '@capacitor-community/native-audio';

@Component({
  selector: 'app-listado-almacenamiento',
  templateUrl: './listado-almacenamiento.page.html',
  styleUrls: ['./listado-almacenamiento.page.scss'],
})
export class ListadoAlmacenamientoPage implements OnInit {

  //============================================================================================================

  //===========
  //|Atributos|
  //===========

  almacenamientoArray: Array<Almacenamiento> = new Array();
  juegosEvento: Array<JuegoEvento> = new Array();
  juegosEventoId:Array<JuegoEvento> = new Array();
  private globalUsu: Usuario = new Usuario();
  deshabilitados:any=[];

  constructor(
    public fireService: FireServiceProvider,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    private appComponent: AppComponent,
    private globalVar: GlobalMethodsService
  ) { }


  //============================================================================================================

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

  }

  ionViewDidEnter() {
    this.getAlmacenamiento();
  }

  ionViewWillEnter() {
    //this.appComponent.getGlobalUsu();
    this.globalUsu = this.globalVar.usuGlobal;
  }

  ionViewWillLeave() {
    NativeAudio.unload({
      assetId: 'alerta',
    });
  } //end ionViewWillLeave

  //============================================================================================================

  //==========
  //|Firebase|
  //==========

  getAlmacenamiento() {
    this.presentLoading().then(() => {
      this.almacenamientoArray = new Array();
      this.fireService.getAlmacenamiento().then((data: any) => {
        this.almacenamientoArray = data;
        //Ordenar almacenamientos por id
        this.almacenamientoArray.sort((a, b) =>
          a.id.localeCompare(b.id)
        );

        this.loadingCtrl.dismiss()
      });
    });

  } //end getAlmacenamiento


  borrarAlmacenamiento(almacenamiento: Almacenamiento) {
    this.fireService
      .eliminarAlmacenamiento(almacenamiento)
      .then(() => {
        console.log('Almacenamiento borrado');
      })
      .catch((error: string) => {
        console.log(error);
      });
  } //end borrarAlmacenamiento

  annadirJuego(almacenamiento: Almacenamiento, evento:any) {
    evento.target.disabled=true
    this.deshabilitados.push(evento.target)
    let juego = new Juego();
    juego.nombre = '--' + almacenamiento.ubicacion + '--';
    let juegoEvento: JuegoEvento = new JuegoEvento();
    juegoEvento.juego = juego;
    juegoEvento.id = juego.gameId;
    juegoEvento.estado = 'para prestar';
    juegoEvento.vecesPrestado = 0;
    this.juegosEvento.push(juegoEvento);

    almacenamiento.juegos.forEach((juego) => {
      this.fireService.getJueboById(juego)
        .then((data: Juego) => {
          let juegoEvento: JuegoEvento = new JuegoEvento();

          juegoEvento.juego = data;
          juegoEvento.id = data.gameId;
          juegoEvento.estado = 'para prestar';
          juegoEvento.vecesPrestado = 0;
          this.juegosEvento.push(juegoEvento);
        }).catch((error: string) => {
          console.log(error)
        })

    });
  } //end annadirJuego

  quitarJuego(juego: Juego) {
    this.juegosEvento.forEach((data, index) => {
      if (data.juego == juego) this.juegosEvento.splice(index, 1);
    });
  } //end quitarJuegos




  //============================================================================================================

  //==================
  //|Ventanas Modales|
  //==================



  async ventanaModalVer(almacenamiento: Almacenamiento) {
    const modal = await this.modalCtrl.create({
      component: VerAlmacenamientoPage,
      componentProps: {
        almacenamientoJson: JSON.stringify(almacenamiento),
      },
    });
    return await modal.present();
  } //end ventanaModalMod 



  //============================================================================================================

  //===============
  //|Otros Métodos|
  //===============

  async presentLoading() {
    let loading = await this.loadingCtrl.create({
      message: 'Cargando almacenamiento...',
      spinner: 'bubbles',
    });
    return loading.present();
  } //end presentLoading


  opciones(almacenamiento: Almacenamiento) {

    if (this.globalUsu.gestor)
      this.alertCtrl
        .create({
          cssClass: 'app-alert',
          header: 'Opciones',
          buttons: [
            {
              text: 'Ver almacenamientos',
              handler: () => {
                this.ventanaModalVer(almacenamiento);
              },
            },
            {
              text: 'Borrar',
              handler: () => {
                this.confirmar(almacenamiento);
              },
            },
            {
              text: 'Modificar',
              handler: () => {
              },
            },
            {
              text: 'Cancelar',
              handler: () => { }
            }
          ],
        })
        .then((res) => {
          res.present();
        });
    else
      this.alertCtrl
        .create({
          cssClass: 'app-alert',
          header: 'Opciones',
          buttons: [
            {
              text: 'Cancelar',
              handler: () => { }
            },
            {
              text: 'Ver almacenamientos',
              handler: () => {
                this.ventanaModalVer(almacenamiento);
              },
            },

          ],
        })
        .then((res) => {
          res.present();
        });

  } //end opciones 

  confirmar(almacenamiento: Almacenamiento) {
    this.audio();
    this.alertCtrl
      .create({
        cssClass: 'app-alert',
        header: '¿Estas seguro de borrar la ' + almacenamiento.ubicacion + '?',
        buttons: [
          {
            text: 'Borrar',
            handler: () => {
              this.borrarAlmacenamiento(almacenamiento);
            },
          },
          {
            text: 'Cancelar',
            handler: () => {
              console.log('Cancelar');
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  } //end confirmar

  confirmarJuego(juego: Juego) {
    this.audio();
    this.alertCtrl
      .create({
        cssClass: 'app-alert',
        header: '¿Estas seguro de borrar ' + juego.nombre + '?',
        buttons: [
          {
            text: 'Borrar',
            handler: () => {
              this.quitarJuego(juego);
            },
          },
          {
            text: 'Cancelar',
            handler: () => {
              console.log('Cancelar');
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  } //end confirmar



  //AÑADIR CANTIDAD DEL JUEGO
  aceptar() {
    this.juegosEvento.forEach((data, index) => {
      this.almacenamientoArray.forEach((data2, index2) => {
        if (data.juego.nombre == '--' + data2.ubicacion + '--'){
          this.juegosEvento.splice(index, 1);
        }
          
      });
    });

    this.juegosEvento.forEach((data:JuegoEvento)=>{
      let idOriginal=data.juego.gameId
      for(let inx=0; inx<data.juego.cantidad;inx++){
        let juegoNuevo=data
        juegoNuevo.juego.gameId=idOriginal+"."+inx;
        this.juegosEventoId.push(juegoNuevo);
      }
    })

    this.juegosEvento.concat(this.juegosEventoId);


    this.annadirFecha(this.juegosEvento)

    this.juegosEvento = new Array();
  } //end aceptar

  annadirFecha(juegos: any) {
    this.alertCtrl
      .create({
        cssClass: 'app-alert',
        header:
          '¿Qué día será el evento?',
        inputs: [
          {
            name: 'dia',
            value: new Date(),
            type: 'date',
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
            text: 'Añadir',
            handler: (data: any) => {
              let fecha: Date = new Date()
              fecha = data['dia']
              fecha = new Date(fecha)
              juegos.forEach((data: any) => {
                this.fireService.insertarJuegosEventos(data, fecha);
              });


            },
          }
        ],
      })
      .then((res) => {
        res.present();
      });
  }


  //CONTROLAR EVENTOS
  eventoNombre(fecha: any) {
    this.alertCtrl
      .create({
        cssClass: 'app-alert',
        header:
          '¿Cuál es el evento?',
        inputs: [
          {
            name: 'nombre',
            type: 'text',
            placeholder: 'Nombre del evento',

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
            text: 'Añadir',
            handler: (data: any) => {

              //CONTROLAR QUE YA EXISTA EL EVENTO Y NO REPETIR FECHAS


            },
          }
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  deshabilitar() {
    if (this.juegosEvento.length > 0) return false;
    return true;
  } //end deshabilitar


  borrarTodo() {
    this.juegosEvento = new Array();
    for(let inx=0; inx<this.deshabilitados.length;inx++){
      this.deshabilitados[inx].disabled=false;
    }
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