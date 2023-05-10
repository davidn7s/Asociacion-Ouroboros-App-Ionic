import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavParams, ToastController } from '@ionic/angular';
import { Almacenamiento } from 'src/modelo/Almacenamiento';
import { Juego } from 'src/modelo/Juego';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';

@Component({
  selector: 'app-annadir-juego',
  templateUrl: './annadir-juego.page.html',
  styleUrls: ['./annadir-juego.page.scss'],
})
export class AnnadirJuegoPage implements OnInit {

  //============================================================================================================

  //===========
  //|Atributos|
  //===========


  @Input() juegoJson: any
  @Input() ultimoId: any;


  validations_form!: FormGroup;

  juego: Juego = new Juego();
  juegoNuevo: Juego = new Juego();
  nuevoId!: string;
  idOriginal!: string;


  imageFile!: File;
  imageFileName!: string;
  lastFileName!: string;


  almacenamientoArray: Array<Almacenamiento> = new Array();


  constructor(private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private firebaseService: FireServiceProvider,
    private toastController: ToastController,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {
  }//end constructor


  //============================================================================================================

  //=============
  //|Fases Ionic|
  //=============
  ngOnInit() {
    this.getAlmacenamiento()
    this.juego = Juego.createFromJsonObject(JSON.parse(this.juegoJson));
    this.lastFileName = this.juego.imagen;
    this.idOriginal = this.juego.gameId;
    this.juegoNuevo = this.juego;

    this.nuevoId = JSON.parse(this.ultimoId);

    let array: string[] = this.nuevoId.split('-');
    let num: number = parseInt(array[1]) + 1;

    if (this.juego.gameId == null || this.juego.gameId == '') {
      if (num < 1000 && num > 100) {
        this.juegoNuevo.gameId = 'BG-0' + num;
      }
      else if (num < 100 && num >= 10) {
        this.juegoNuevo.gameId = 'BG-00' + num;
      }
      else if (num < 10) {
        this.juegoNuevo.gameId = 'BG-000' + num;
      }
      else {
        this.juegoNuevo.gameId = 'BG-' + num;
      }
    }


    this.validations_form = this.formBuilder.group({
      id: new FormControl(
        this.juegoNuevo.gameId,
        Validators.compose([
          Validators.required,
        ])
      ),
      nombre: new FormControl(
        this.juegoNuevo.nombre,
        Validators.compose([
          Validators.required,
        ])
      ),
      editorial: new FormControl(
        this.juegoNuevo.editorial,
        Validators.compose([Validators.required])
      ),
      edadMin: new FormControl(
        this.juegoNuevo.edadMinima,
        Validators.compose([Validators.required, Validators.min(1)])
      ),
      jugadores: new FormControl(
        this.juegoNuevo.jugadores,
        Validators.compose([Validators.required])
      ),
      tiempoJuego: new FormControl(
        this.juegoNuevo.tiempoJuegoMin,
        Validators.compose([Validators.required])
      ),
      cantidad: new FormControl(
        this.juegoNuevo.cantidad,
        Validators.compose([Validators.required, Validators.min(1)])
      ),
      almacen: new FormControl(
        this.juegoNuevo.cantidad,
        Validators.compose([Validators.required])
      ),
      imagen: new FormControl(this.juegoNuevo.imagen),

    });
  }//end ngOnInit


  onSubmit() {
    if (this.validations_form.invalid)
      return;

    let values = this.validations_form.value;

    this.juegoNuevo.gameId = values.id;
    this.juegoNuevo.nombre = values.nombre;
    this.juegoNuevo.editorial = values.editorial;
    this.juegoNuevo.edadMinima = values.edadMin;
    this.juegoNuevo.jugadores = values.jugadores;
    this.juegoNuevo.tiempoJuegoMin = values.tiempoJuego;
    this.juegoNuevo.cantidad = values.cantidad
    this.juegoNuevo.imagen = values.imagen;
    this.subirJuego();
  }//end onSubmit



  //============================================================================================================

  //==========
  //|Firebase|
  //==========
  subirJuego() {
    if (this.idOriginal != null && this.idOriginal != '') {
      this.firebaseService
        .modificarJuego(this.juegoNuevo)
        .then(() => {
          this.closeModal();
        })
        .catch((error: string) => {
          console.log(error);
        });
    } else {
      this.firebaseService
        .insertarJuego(this.juegoNuevo)
        .then(() => {
          console.log('Juego insertado');
          this.closeModal();
        })
        .catch((error: string) => {
          console.log(error);
        });

    }
  } //end subirJuego


  imageOnChange(event: any) {
    this.imageFile = event.target.files.item(0);
    var extension = this.imageFile.name.substr(
      this.imageFile.name.lastIndexOf('.') + 1
    );
    //le pongo al nombre también la extensión del fichero
    this.imageFileName = `${this.juegoNuevo.gameId + '.IMAGE'}.${extension}`;
    this.juegoNuevo.imagen = '';
    if (this.imageFile.type.split('/')[0] === 'image') {
      this.firebaseService
        .uploadImage(this.imageFile, this.imageFileName)
        .then((downloadUrl) => {
          this.firebaseService
            .removeFile(this.lastFileName)
            .then(() => { })
            .catch((error: string) => {
              console.log(error);
            });
          this.juegoNuevo.imagen = downloadUrl;
          this.validations_form.controls['imagen'].setValue(downloadUrl);
          this.lastFileName = downloadUrl;
        })
        .catch((error) => {
          console.log(error);
        });
    } else
      this.presentToast("El fichero no es una imagen");
  } //end imageOnChange

  getAlmacenamiento() {
    this.presentLoading().then(() => {
      this.almacenamientoArray = new Array();
      this.firebaseService.getAlmacenamiento().then((data: any) => {
        this.almacenamientoArray = data;
        //Ordenar almacenamientos por id
        this.almacenamientoArray.sort((a, b) =>
          a.id.localeCompare(b.id)
        );

        this.loadingCtrl.dismiss()
      });
    });

  } //end getAlmacenamiento



  //============================================================================================================

  //==================
  //|Ventanas modales|
  //==================

  closeModal() {
    if (this.idOriginal == null && this.juegoNuevo.nombre === '')
      this.firebaseService
        .removeFile(this.lastFileName)
        .then(() => { console.log('borrado') })
        .catch((error: string) => {
          console.log(error);
        });

    this.modalCtrl.dismiss();
  } //end closeModal



  //============================================================================================================

  //===============
  //|Otros métodos|
  //===============
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  } //end Toast

  async presentLoading() {
    let loading = await this.loadingCtrl.create({
      message: 'Cargando ...',
      spinner: 'bubbles',
      cssClass:'loader-css-class',
    });
    return loading.present();
  } //end presentLoading

}
