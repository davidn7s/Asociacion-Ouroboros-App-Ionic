import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Almacenamiento } from 'src/modelo/Almacenamiento';
import { Juego } from 'src/modelo/Juego';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';

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
  juegos:Array<Juego>= new Array<Juego>();
  textoBuscar: string = '';


  constructor(public modalCtrl: ModalController,public fireService: FireServiceProvider) { }

  //======================================================================================================================================

  //=============
  //|Fases Ionic|
  //=============

  ngOnInit() {
    this.almacenamiento = Almacenamiento.createFromJsonObject(JSON.parse(this.almacenamientoJson));
    this.almacenamiento.juegos.forEach((id)=>{
      this.fireService.getJuegoById(id).then((juego)=>{
        this.juegos.push(juego)
      })
    })
  }

  //======================================================================================================================================

  //==================
  //|Ventanas Modales|
  //==================

  closeModal() {
    this.modalCtrl.dismiss();
  }

  
  buscar(ev:any) {
    this.textoBuscar = ev.detail.value;
  } //end buscar
  
}
