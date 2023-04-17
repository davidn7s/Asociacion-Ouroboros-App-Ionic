import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Almacenamiento } from 'src/modelo/Almacenamiento';

@Component({
  selector: 'app-ver-almacenamiento',
  templateUrl: './ver-almacenamiento.page.html',
  styleUrls: ['./ver-almacenamiento.page.scss'],
})
export class VerAlmacenamientoPage implements OnInit {

  //======================================================================================================================================

  //===========
  //|Atributos|
  //===========
  @Input() almacenamientoJson:any;

  almacenamiento: Almacenamiento = new Almacenamiento();

  constructor(public modalCtrl: ModalController) { }

  //======================================================================================================================================

  //=============
  //|Fases Ionic|
  //=============

  ngOnInit() {
    this.almacenamiento = Almacenamiento.createFromJsonObject(JSON.parse(this.almacenamientoJson));
    console.log(this.almacenamiento)
  }

  //======================================================================================================================================

  //==================
  //|Ventanas Modales|
  //==================

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
