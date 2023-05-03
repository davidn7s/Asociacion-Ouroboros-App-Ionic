import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GlobalMethodsService } from './global-methods.service';
import { Usuario } from 'src/modelo/Usuario';
import { FirebaseAuthService } from 'src/providers/api-service/firebase-auth-service';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { Router } from '@angular/router';
import { DataService } from './services/data.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  navigate: any;
  usuarioGlobal: Usuario = new Usuario();

  
  constructor(private dataService: DataService, private loadingController: LoadingController, private toastController: ToastController, private router: Router, private platform: Platform, private modalCtrl: ModalController, private globalVar: GlobalMethodsService, private fireAuth: FirebaseAuthService, private fireService: FireServiceProvider) {
    this.dataService.init();
    this.sideMenu();
    this.initializeApp();
  }//end constructor


  ngOnInit(): void {
    this.loadData()
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

    if (this.usuarioGlobal.gestor){
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
          title:"Eventos",
          url: "/ver-eventos",
          icon: "calendar"
        },
        {
          title: "Usuarios",
          url: "/usuarios",
          icon: "person"
        }
      ]
    }else if (this.usuarioGlobal.id != undefined && this.usuarioGlobal.estado){
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
      ]
    }else if(this.usuarioGlobal.id != undefined && !this.usuarioGlobal.estado){
      this.navigate =
      [
        {
          title: "Home",
          url: "/home",
          icon: "home"
        },
        {
          title: "Juegos",
          url: "/listado-juegos",
          icon: "game-controller"
        },
        {
          title: "Almacenamiento",
          url: "/listado-almacenamiento",
          icon: "logo-dropbox"
        },
      ]
    }else{
      this.navigate =
      [
        {
          title: "Home",
          url: "/home",
          icon: "home"
        }]
    }
  }//end sideMenu

  //Método para volver a recoger el usuario global y reinicializar el menú lateral
  getGlobalUsu() {
    this.usuarioGlobal = this.globalVar.usuGlobal;
    this.sideMenu();
  } //end getGlobalUsu




  async loadData(){
    this.dataService.getData().subscribe(res=>{
      console.log(res)
      try{
      let correo=res[0].split(' ')
      let contra=res[1].split(' ')
      this.realizarLogin(correo[1],contra[1])
    }catch(e){
    }
  })
  }//end loadData


  realizarLogin(correo:string,contra:string){
    this.pantallaCarga().then(()=>{
      this.fireAuth.loginUser(correo, contra)
      .then(() => {
        this.presentToast("Login Correcto!!!")
  
  
        this.fireService
          .getUsuarioByEmail(correo)
          .then((data: Usuario) => {
            this.loadingController.dismiss()
            this.globalVar.usuGlobal = data;
            this.usuarioGlobal = data
            this.getGlobalUsu()
            this.router.navigate(['/juegos-evento']);
          })
          .catch((error) => {
            this.loadingController.dismiss()
            this.presentToast('Ha ocurrido un error inesperado');
          });
  
  
      }).catch((error: string) => {
        console.log(error)
        this.loadingController.dismiss()
        this.presentToast("Error, no se ha podido recuperar los datos")
        this.dataService.removeItem()
        this.dataService.getData().subscribe(res=>{
        })
      })
    })
   
  }


  async remove(){
    this.dataService.removeItem()
    this.sideMenu();
    this.dataService.getData().subscribe(res=>{
      window.location.replace("/home");
    })
  }//end remove


  //============================================================================================================

  //==================
  //|Ventanas Modales|
  //==================

  update() {
    this.router.navigateByUrl('modificar-usuario-propio')
  } //end ventanaModal

}
