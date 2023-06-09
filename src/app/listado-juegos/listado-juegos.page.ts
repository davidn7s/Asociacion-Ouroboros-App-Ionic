import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { Juego } from 'src/modelo/Juego';
import { Usuario } from 'src/modelo/Usuario';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { AnnadirJuegoPage } from '../annadir-juego/annadir-juego.page';
import { AppComponent } from '../app.component';
import { GlobalMethodsService } from '../global-methods.service';

@Component({
  selector: 'app-listado-juegos',
  templateUrl: './listado-juegos.page.html',
  styleUrls: ['./listado-juegos.page.scss'],
})
export class ListadoJuegosPage implements OnInit {

  //============================================================================================================

  //===========
  //|Atributos|
  //===========


  juegos: Array<Juego> = new Array();
  textoBuscar: string = '';
  globalUsu: Usuario = new Usuario();

  private archivo = new Audio('../../assets/audio/alert.wav')

  constructor(
    public fireService: FireServiceProvider,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private appComponent: AppComponent,
    private globalVar: GlobalMethodsService
  ) { }


  //============================================================================================================

  //=============
  //|Fases Ionic|
  //=============
  ionViewWillEnter() {
    this.appComponent.getGlobalUsu();
    this.globalUsu = this.globalVar.usuGlobal;
  }

  ngOnInit() {
    this.getJuegos();
  }//end ngOnInit



  //============================================================================================================

  //===========
  //|Firebase|
  //===========

  getJuegos() {
    this.presentLoading().then(() => {
      this.fireService.getJuegosTR().subscribe((resultadoConsulta: any) => {

        if (resultadoConsulta.length == 0) {
          this.loadingCtrl.dismiss()
        }


        this.juegos = new Array<Juego>();
        resultadoConsulta.forEach((datos: any) => {
          let juego: Juego = Juego.createFromJsonObject(datos.payload.doc.data());
          this.juegos.push(juego);


          //Ordenar juegos por id
          this.juegos.sort((a, b) => (a.gameId < b.gameId ? -1 : 1));
          
        });
        
      });
      this.loadingCtrl.dismiss();
    });

  } //end getJuegos


  borrarJuego(juego: Juego) {
    this.fireService.getAlmacenamientoById(juego.almacenamiento)
      .then((data) => {
        data.juegos.splice(data.juegos.indexOf(juego.gameId), 1);
        this.fireService.modificarAlmacen(data).then(() => {

          this.fireService
            .eliminarJuego(juego)
            .then(() => {
            })
            .catch((error) => {
              console.log(error)
            })

        }).catch((error: string) => {
          console.log(error)
        })
      }).catch((error: string) => {
        console.log(error);
      })
  } //end borrarJuego



  //============================================================================================================

  //==================
  //|Ventanas Modales|
  //==================

  async modificarJuego(juego: Juego) {
    if (juego.gameId == null) {
      juego = new Juego();
      juego.gameId = ''
    }
    let ultimo: Juego = this.juegos[this.juegos.length - 1];

    const modal = await this.modalCtrl.create({
      component: AnnadirJuegoPage,
      componentProps: {
        juegoJson: JSON.stringify(juego),
        ultimoId: JSON.stringify(ultimo.gameId),
      },
    });
    return await modal.present();
  } //end ventanaModalMod

  annadirJuego() {
    this.modificarJuego(new Juego())
  }//end annadirJuego



  //============================================================================================================

  //===============
  //|Otros Métodos|
  //===============
  confirmar(juego: Juego) {
    this.audio();
    this.alertCtrl
      .create({
        cssClass: 'app-alert',
        header: '¿Estas seguro de borrar ' + juego.nombre + '?',
        buttons: [
          {
            text: 'Borrar',
            handler: () => {
              this.borrarJuego(juego);
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
  } //end_confirmar


  buscar(ev: any) {
    this.textoBuscar = ev.detail.value;
  } //end buscar

  async presentLoading() {
    let loading = await this.loadingCtrl.create({
      message: 'Cargando juegos...',
      spinner: 'bubbles',
      cssClass: 'loader-css-class',
    });
    return loading.present();
  }//end presentLoading

  audio() {
    this.archivo.play();
  }//end audio

}
