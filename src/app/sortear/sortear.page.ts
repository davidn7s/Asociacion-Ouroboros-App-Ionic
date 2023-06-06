import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-sortear',
  templateUrl: './sortear.page.html',
  styleUrls: ['./sortear.page.scss'],
})
export class SortearPage implements OnInit {

  //======================================================================================================================================

  //===========
  //|Atributos|
  //===========
  @Input() participantesJson: any;
  @Input() personas: any;

  participantesSortear: Array<string> = new Array();
  escogidos: Array<string> = new Array();
  cantidad: number = 1;
  tope: number = 0;


  constructor(public modalCtrl: ModalController) { }


  //======================================================================================================================================

  //=============
  //|Fases Ionic|
  //=============
  ngOnInit() {
    JSON.parse(this.participantesJson).forEach((item: any) => {
      this.participantesSortear.push(item);
    })

    this.tope = JSON.parse(this.personas);
  } //end ngOnInit



  //============================================================================================================

  //==================
  //|Ventanas Modales|
  //==================

  closeModal() {
    this.modalCtrl.dismiss();
  } //end closeModal


  //============================================================================================================

  //===============
  //|Otros Métodos|
  //===============

  sortear() {
    this.escogidos = new Array();
    let existe = false;



    if(this.cantidad>this.tope){
      this.cantidad=this.tope;
    }

    for (let inx = 0; inx < this.cantidad; inx++) {

      existe = false

      while (!existe) {
        let escogido = Math.floor(Math.random() * this.participantesSortear.length);
        let participante: string = this.participantesSortear[escogido];
        if (!this.escogidos.includes(participante)) {
          this.escogidos.push(participante);
          while (this.participantesSortear.includes(participante)) {
            this.participantesSortear.splice(this.participantesSortear.indexOf(participante), 1);
          }
          existe = true;
        }
      }

    }

  }//end sortear


  deshabilitar() {
    if (this.participantesSortear.length > 0) {
      return false
    } else {
      return true
    }
  }//end deshabilitar



  controlSortear(ev: any){
    if(this.cantidad>this.tope){
      this.cantidad=this.tope;
    }else if (this.cantidad <= 0) {
      this.cantidad = 1;
    }
  }//end controlSortear
}
