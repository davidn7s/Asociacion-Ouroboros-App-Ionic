import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { GlobalMethodsService } from './global-methods.service';
//import { Usuario } from 'src/modelo/Usuario';
import { FirebaseAuthService } from 'src/providers/api-service/firebase-auth-service';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { Router } from '@angular/router';
//import { DataService } from './services/data.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  navigate: any;
  //private usuarioGlobal: Usuario = new Usuario();


  constructor(
    private loadingController: LoadingController, private toastController: ToastController, private router: Router, private platform: Platform, private modalCtrl: ModalController, private fireAuth: FirebaseAuthService, private fireService: FireServiceProvider) {
    // this.dataService.init();
    this.sideMenu();
    this.initializeApp();
  }//end constructor


  ngOnInit(): void {

  }//end ngOnInit

  async pantallaCarga() {
    const loading = await this.loadingController.create({
      message: 'Realizando login ...',
      spinner: 'bubbles',
    });
    return loading.present();
  }//end pantallaCarga


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }//end Toast

  initializeApp() {
    this.platform.ready().then(() => {
      SplashScreen.hide();
    });
  }//end initializeApp

  sideMenu() {
    //Nombre coleccion por fecha de evento
    let fecha = new Date();
    let nombre: string = "Evento " + fecha.toLocaleDateString().toString();


    this.navigate =
      [
        {
          title: "Home",
          url: "/home",
          icon: "home"
        },
        {
          title: "Sorteo",
          url: "/sorteo",
          icon: "dice"
        },
        {
          title: "Juegos",
          url: "/listado-juegos",
          icon: "game-controller"
        },
        {
          title: nombre,
          url: "juegos-evento",
          icon: "extension-puzzle"
        },
        {
          title: "Almacenamiento",
          url: "/listado-almacenamiento",
          icon: "logo-dropbox"
        },
        {
          title: "Eventos",
          url: "/ver-eventos",
          icon: "calendar"
        },
        {
          title: "Usuarios",
          url: "/usuarios",
          icon: "person"
        }


      ]
  }//end sideMenu



}
