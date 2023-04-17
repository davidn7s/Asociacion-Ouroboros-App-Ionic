import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { JuegoEvento } from 'src/modelo/JuegoEvento';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';

@Component({
  selector: 'app-juegos-evento',
  templateUrl: './juegos-evento.page.html',
  styleUrls: ['./juegos-evento.page.scss'],
})
export class JuegosEventoPage implements OnInit {


  //============================================================================================================

  //===========
  //|Atributos|
  //===========


   fecha = new Date();
   evento: string =
    'Evento ' + this.fecha.toLocaleDateString().toString();

   juegosEvento: Array<JuegoEvento> = new Array();
   juegosMuestra: Array<JuegoEvento> = new Array();
   textoBuscar: string = '';

   estado: string = 'todo';

  constructor(
    public fireService: FireServiceProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastController: ToastController
  ) { }



  //============================================================================================================

  //=============
  //|Fases Ionic|
  //=============
  ngOnInit() {
    this.getJuegos();
  }

  ionViewWillEnter() {
    this.estado = 'todo';
  }


  //============================================================================================================

  //==========
  //|Firebase|
  //==========

  getJuegos() {
    this.presentLoading().then(() => {
      this.fireService.getJuegosEventoTR().subscribe((resultadoConsulta:any) => {
        if (resultadoConsulta.length == 0) {
          this.presentToast('No hay ningun evento asignado para hoy')
          this.loadingCtrl.dismiss()
        }
        this.juegosEvento = new Array<JuegoEvento>();
        this.juegosMuestra = new Array<JuegoEvento>();
        resultadoConsulta.forEach((datos: any) => {

          this.loadingCtrl.dismiss()
          let juego: JuegoEvento = JuegoEvento.createFromJsonObject(datos.payload.doc.data());
          this.juegosEvento.push(juego);



          this.cambioTipo()

          //Ordenar juegos por id
          this.juegosEvento.sort((a, b) => (a.juego.gameId < b.juego.gameId ? -1 : 1));
          this.juegosMuestra.sort((a, b) => (a.juego.gameId < b.juego.gameId ? -1 : 1));
        });
      });

    });

  } //end getJuegos



  actualizar(juego: JuegoEvento) {
    this.fireService.modificarJuegosEvento(juego);
  }//end actualizar



  //============================================================================================================

  //===============
  //|Otros métodos|
  //===============

  buscar(ev:any) {
    this.textoBuscar = ev.detail.value;
  } //end buscar


  cambioTipo() {
    this.juegosMuestra = new Array();
    if (this.estado !== 'todo') {
      this.juegosEvento.forEach((juego: JuegoEvento) => {
        if (juego.estado.trim() === this.estado.trim())
          this.juegosMuestra.push(juego);
        this.juegosMuestra.sort((a, b) => (a.juego.nombre > b.juego.nombre ? 1 : -1));
      });
    } else {
      this.juegosMuestra = this.juegosEvento;
      this.juegosMuestra.sort((a, b) => (a.juego.nombre > b.juego.nombre ? 1 : -1));
    }
    this.juegosMuestra.sort((a, b) => (a.juego.nombre > b.juego.nombre ? 1 : -1));
  } //end cambioTipo


  async presentLoading() {
    let loading = await this.loadingCtrl.create({
      message: 'Cargando juegos...',
      spinner: 'bubbles',
    });
    return loading.present();
  }//end presentLoading


  opciones(juego: JuegoEvento) {
    if (juego.estado === 'para prestar')
      this.alertCtrl
        .create({
          cssClass: 'app-alert',
          header: 'Opciones',
          buttons: [
            {
              text: 'Prestar',
              handler: () => {
                juego.estado = 'prestado';
                this.actualizar(juego);
              },
            },
            {
              text: 'Cancelar',
              handler: () => { }
            },
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
              text: 'Juego devuelto',
              handler: () => {
                juego.estado = 'para prestar';
                juego.vecesPrestado += 1;
                this.actualizar(juego);
              },
            },
            {
              text: 'Cancelar',
              handler: () => { }
            },
          ],
        })
        .then((res) => {
          res.present();
        });
  } //end opciones


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  } //end Toast


}//end class
