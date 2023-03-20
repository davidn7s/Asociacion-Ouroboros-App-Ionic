import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { Participante } from 'src/modelo/Participante';


@Component({
  selector: 'app-annadir',
  templateUrl: './annadir.page.html',
  styleUrls: ['./annadir.page.scss'],
})
export class AnnadirPage implements OnInit {

  //============================================================================================================

  //===========
  //|Atributos|
  //===========

  @Input() participanteJson:any;

  validations_form!: FormGroup;

  private participante: Participante = new Participante();

  constructor(public firebaseService: FireServiceProvider,
    public modalCtrl: ModalController,
    public formBuilder: FormBuilder,
    private toastController: ToastController) { }

  //============================================================================================================

  //=============
  //|Fases Ionic|
  //=============

  ngOnInit() {
    this.participante = Participante.createFromJsonObject(JSON.parse(this.participanteJson));


    this.validations_form = this.formBuilder.group({
      nombre: new FormControl(
        this.participante.nombre,
        Validators.compose([
          Validators.minLength(3),
          Validators.required,
        ])
      ),
      apellidos: new FormControl(
        this.participante.apellidos,
        Validators.compose([Validators.minLength(3), Validators.required])
      ),
      puntos: new FormControl(
        this.participante.puntos,
        Validators.compose([Validators.required, Validators.min(1)])
      )

    });
  }//end ngOnInit

  onSubmit(values:any) {
    this.participante.nombre = values.nombre;
    this.participante.apellidos = values.apellidos;
    this.participante.puntos = values.puntos;
    this.subirParticipacion();

  }//end onSubmit


  //============================================================================================================

  //==========
  //|Firebase|
  //==========
  
  subirParticipacion() {

    if (this.participante.id != null) {
      this.firebaseService.modificarParticipante(this.participante)
        .then(() => {

        }).catch((error: string) => {
          console.log(error)
        })
    } else {

      this.firebaseService.insertarParticipante(this.participante)
        .then(() => {

        }).catch((error: string) => {
          console.log(error)
        })
    }

    this.closeModal();
  }//end subirParticipacion


  //============================================================================================================

  //==================
  //|Ventanas modales|
  //==================
  closeModal() {
    this.modalCtrl.dismiss();
  }//end closeModal

}
