import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Participante } from 'src/modelo/Participante';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { AnnadirPage } from '../annadir/annadir.page';
import { SortearPage } from '../sortear/sortear.page';

@Component({
  selector: 'app-sorteo',
  templateUrl: './sorteo.page.html',
  styleUrls: ['./sorteo.page.scss'],
})
export class SorteoPage implements OnInit {
  //======================================================================================================================================

  //===========
  //|Atributos|
  //===========

  fechaActual!: string;
  participantes: Array<Participante> = new Array();
  participantesSortear: Array<string> = new Array();
  contadorTot: number = 0;
  contador: number = 0;
  textoBuscar: string = '';

  constructor(
    public modalCtrl: ModalController,
    public fireService: FireServiceProvider,
    public alertCtrl: AlertController
  ) { }

  //======================================================================================================================================

  //=============
  //|Fases Ionic|
  //=============

  ngOnInit() {
    let fecha = new Date();
    this.fechaActual = fecha.toLocaleDateString();

    this.getParticipantes();
  }

  ionViewWillEnter() {
    this.contadorTot = 0;
    this.contador = 0;
  }

  //======================================================================================================================================

  //==========
  //|Firebase|
  //==========

  getParticipantes() {

    this.fireService.getParticipantesTR().subscribe((resultadoConsulta: any) => {


      this.contador = 0;
      this.contadorTot = 0;

      this.participantes = new Array<Participante>();
      this.participantesSortear = new Array<string>();
      
      resultadoConsulta.forEach((datos: any) => {
        let participante: Participante = Participante.createFromJsonObject(
          datos.payload.doc.data()
        );
        this.participantes.push(participante);

        for (let inx = 0; inx < participante.puntos; inx++)
          this.participantesSortear.push(
            participante.nombre + ' ' + participante.apellidos
          );

        this.contadorTot += participante.puntos;
        this.contador++;


        //Ordenar participantes alfabéticamente
        this.participantes.sort(this.ordenar);
      });
    });
  } //end getParticipantes a tiempo real

  borrarParticipante(participante: Participante) {
    this.fireService
      .eliminarParticipante(participante)
      .then(() => {
        console.log('Participante borrado');
      })
      .catch((error: string) => {
        console.log(error);
      });
  } //end borrarParticipante

  update(participante: Participante) {
    this.fireService.modificarParticipante(participante)
      .then(() => {

      }).catch((error: string) => {
        console.log(error)
      })
  }//end update

  ordenar(a: any, b: any) {
    return a.nombre.localeCompare(b.nombre);
  } //end ordenar

  //======================================================================================================================================

  //================
  //|Alerts Dialogs|
  //================

  opciones(participante: Participante) {
    this.alertCtrl
      .create({
        cssClass: 'app-alert',
        header: 'Opciones',
        buttons: [
          {
            text: 'Añadir',
            handler: () => {
              this.annadir(participante)
            },
          },

          {
            text: 'Modificar',
            handler: () => {
              this.ventanaModalMod(participante);
            },
          },
          {
            text: 'Borrar',
            handler: () => {
              this.confirmar(participante);
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

  confirmar(participante: Participante) {
    this.alertCtrl
      .create({
        cssClass: 'app-alert',
        header:
          '¿Estas seguro de borrar a ' +
          participante.nombre +
          ' ' +
          participante.apellidos +
          '?',
        buttons: [
          {
            text: 'Borrar',
            handler: () => {
              this.borrarParticipante(participante);
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


  annadir(participante: Participante) {
    this.alertCtrl
      .create({
        cssClass: 'app-alert',
        header:
          '¿Cuantos puntos quieres añadir a ' +
          participante.nombre +
          ' ' +
          participante.apellidos +
          '?',
        inputs: [
          {
            name: 'annadido',
            value: 1,
            type: 'number',
            placeholder: 'Puntos a añadir',
            min: 1
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
              participante.puntos += parseInt(data['annadido'])
              this.update(participante);
            },
          }
        ],
      })
      .then((res) => {
        res.present();
      });
  } //end annadir



  //======================================================================================================================================

  //==================
  //|Ventanas modales|
  //==================

  sortear() {
    this.ventanaModalSort();
  }
  annadirP() {
    this.ventanaModalMod(new Participante());
  }

  async ventanaModalMod(participante: Participante) {
    if (participante.id == null) participante = new Participante();

    const modal = await this.modalCtrl.create({
      component: AnnadirPage,
      componentProps: {
        participanteJson: JSON.stringify(participante),
      },
    });
    return await modal.present();
  } //end ventanaModalMod

  async ventanaModalSort() {
    const modal = await this.modalCtrl.create({
      component: SortearPage,
      componentProps: {
        participantesJson: JSON.stringify(this.participantesSortear),
        personas: JSON.stringify(this.contador)
      },
    });
    return await modal.present();
  } //end ventanaModalSort


  //======================================================================================================================================

  //===============
  //|Otros Métodos|
  //===============


  buscar(ev: any) {
    this.textoBuscar = ev.detail.value;
  }//end buscar
}
