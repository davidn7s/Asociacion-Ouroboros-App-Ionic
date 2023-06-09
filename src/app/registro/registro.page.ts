import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/modelo/Usuario';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { FirebaseAuthService } from 'src/providers/api-service/firebase-auth-service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  //======================================================================================================================================

  //===========
  //|Atributos|
  //===========

  validations_form!: FormGroup;
  matching_passwords_group!: FormGroup;

  validation_messages: any;

  usuario: Usuario = new Usuario();
  contrasenna: string = '';
  repetirContrasenna: string = '';

  showPassword = false;
  passwordToggleIcon = 'eye'

  private archivo = new Audio('../../assets/audio/error.mp3')

  constructor(
    private firebaseService: FireServiceProvider,
    private fireAuth: FirebaseAuthService,
    private menu: MenuController,
    private toastCtrl: ToastController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder
  ) {
    this.validation_messages = {
      nombre: [{ type: 'required', message: 'El nombre es obligatorio.' }],
      apellidos: [
        { type: 'required', message: 'Los apellidos son obligatorios.' },
      ],
      email: [
        { type: 'required', message: 'El correo electronico es obligatorio.' },
        { type: 'pattern', message: 'Introduzca un correo electrónico válido.' },
      ],

      cargo: [
        { type: 'required', message: 'El cargo es obligatorio.' }
      ],
      password: [
        { type: 'required', message: 'La contraseña es obligatoria' },
        {
          type: 'minlength',
          message: 'La contraseña debe ser miníma de 8 caracteres.',
        },
        {
          type: 'pattern',
          message: 'Tu contraseña tiene que contener al menos una mayuscula, una minúscula y un número.',
        },
      ],
      confirmPassword: [
        { type: 'required', message: 'Es necesario confirmar la contraseña.' },
      ],
      matching_passwords: [
        { type: 'confirmPassword', message: 'Las contraseñas no coinciden.' },
      ],
    };

  }


  //======================================================================================================================================

  //=============
  //|Fases Ionic|
  //=============

  ngOnInit() {

    this.matching_passwords_group = new FormGroup(
      {
        password: new FormControl(
          '',
          Validators.compose([
            Validators.minLength(8),
            Validators.pattern(
              '^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$'
            ),
            Validators.required,
          ])
        ),
        confirmPassword: new FormControl('', Validators.required),
      },
      (formGroup: any) => {
        return this.confirmPassword(formGroup);
      }
    );

    this.validations_form = this.formBuilder.group({
      nombre: new FormControl(
        '',
        Validators.compose([
          Validators.minLength(3),
          Validators.required,
        ])
      ),
      apellidos: new FormControl(
        '',
        Validators.compose([
          Validators.minLength(3),
          Validators.required,
        ])
      ),
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9_.+-]+[@]{1}[a-zA-Z0-9-]+[.]{1}[a-zA-Z]+$'
          ),
        ])
      ),
      cargo: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3)
        ])
      ),
      matching_passwords: this.matching_passwords_group,
    });
  }//end ngOnInit

  ionViewWillEnter() {
    this.menu.enable(false);
  } //end ionViewWillEnter

  ionViewWillLeave() {
    this.menu.enable(true);
  } //end ionViewWillLeave




  //======================================================================================================================================

  //==========
  //|Firebase|
  //==========

  insertar(usuario: Usuario, contrasenna: string) {
    this.pantallaCarga().then(() => {
      this.fireAuth
        .loginUser(usuario.email, contrasenna)
        .then((usuario: Usuario) => {
          this.audio();
          this.presentToast(
            'Error, email ya registrado, no se ha podido registrar el usuario'
          );
          this.loadingCtrl.dismiss();
        })
        .catch((error: string) => {
          this.firebaseService
            .insertarUsuario(usuario)
            .then(() => {
              this.fireAuth
                .registerUser(usuario.email, contrasenna)
                .then((data) => {
                  this.loadingCtrl.dismiss();
                  this.presentToast('Registro completado');
                  this.router.navigate(['usuarios'])
                })
                .catch((error) => {
                  this.loadingCtrl.dismiss();
                  console.log(error)
                  this.firebaseService.eliminarUsuario(usuario, false);
                  this.audio();
                  this.presentToast(
                    'Error, email ya registrado, no se ha podido registrar el usuario'
                  );
                });
            })
            .catch((error: string) => { });
        });
    });

  }//end insertar




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

  //===============
  //|Otros métodos|
  //===============

  onSubmit(values: any) {
    let usuario = new Usuario();
    usuario.nombre = values.nombre;
    usuario.apellidos = values.apellidos;
    usuario.email = values.email;
    usuario.cargo = values.cargo;
    this.insertar(usuario, values.matching_passwords.password);
  } //end onSubmit



  confirmPassword(fg: FormGroup) {
    if (fg.controls['password'].value != fg.controls['confirmPassword'].value)
      return { confirmPassword: true };
    else return null;
  } //end confirmPassword


  togglePassword() {
    this.showPassword = !this.showPassword;

    if (this.passwordToggleIcon == 'eye')
      this.passwordToggleIcon = 'eye-off'
    else
      this.passwordToggleIcon = 'eye'
  }//end togglePassword



  async pantallaCarga() {
    const loading = await this.loadingCtrl.create({
      message: 'Realizando login ...',
      spinner: 'bubbles',
      cssClass:'loader-css-class',
      translucent: true,
    });
    return loading.present();
  }//end pantallaCarga



  audio() {
    this.archivo.play()
  }//end audio

}//end class
