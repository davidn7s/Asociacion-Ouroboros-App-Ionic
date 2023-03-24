import { Injectable } from '@angular/core';
import { AngularFirestore, fromCollectionRef } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AlertController, ToastController } from '@ionic/angular';
import { Almacenamiento } from 'src/modelo/Almacenamiento';
import { Juego } from 'src/modelo/Juego';
import { Participante } from 'src/modelo/Participante';
import { Usuario } from 'src/modelo/Usuario';

@Injectable()
export class FireServiceProvider {
  constructor(
    private angularFirestore: AngularFirestore,
    private afStorage: AngularFireStorage,
    private toastController: ToastController,
  ) { }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  } //end Toast

  //=============
  //| Ficheros  |
  //=============

  uploadPdfDocument(file: File, name: string): Promise<string> {
    var promise: Promise<string> = new Promise<string>((resolve, reject) => {
      //Se comprueba que el tipo del fichero pertenece a un tipo pdf
      if (file.type !== 'application/pdf') {
        reject('El fichero no es de tipo pdf');
      }
      //se calcula el path dentro del storage de firebase
      //se guarda dentro de una carpeta avatar
      //el nombre del fichero es igual al id del usuario precedido de la hora dada por getTime
      const fileStoragePath = `repertorio/${name}`;

      // Image reference
      const pdfRef = this.afStorage.ref(fileStoragePath);

      // File upload task
      this.afStorage
        .upload(fileStoragePath, file)
        .then((data:any) => {
          pdfRef.getDownloadURL().subscribe((resp) => {
            resolve(resp);
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
    return promise;
  } //end uploadPdfDocument

  uploadImage(file: File, name: string): Promise<string> {
    var promise: Promise<string> = new Promise<string>((resolve, reject) => {
      //Se comprueba que el tipo del fichero pertenece a un tipo imagen
      if (file.type.split('/')[0] !== 'image') {
        reject('El fichero no es de tipo imagen');
      }
      //se calcula el path dentro del storage de firebase
      const fileStoragePath = `GamesImages/${name}`;

      // Image reference
      const imageRef = this.afStorage.ref(fileStoragePath);

      // File upload task
      this.afStorage
        .upload(fileStoragePath, file)
        .then((data) => {
          imageRef.getDownloadURL().subscribe((resp) => {
            resolve(resp);
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
    return promise;
  } //end_uploadImage

  removeFile(fileUrl: string): Promise<string> {
    var promise: Promise<string> = new Promise<string>((resolve, reject) => {
      var imageRef = this.afStorage.refFromURL(fileUrl);

      imageRef.delete().subscribe(
        (resp) => {
          resolve(resp);
        },

        (error) => {
          reject(error);
        }
      );
    });

    return promise;
  } //end_uploadImage

  //======================================================================================

  //====================
  //| Objetos firebase |
  //====================

  //============
  //| Getters |
  //============
  getUsuarios(): Promise<Usuario[]> {
    let promise = new Promise<Usuario[]>((resolve, reject) => {
      const usuariosRef = this.angularFirestore.collection('Usuarios');
      const snapshot = usuariosRef
        .get()
        .toPromise()
        .then((data: any) => {
          let usuarios = new Array<Usuario>();
          data.forEach((element:any) => {
            let usuarioJson = element.data();
            let usuario = Usuario.createFromJsonObject(usuarioJson);
            usuarios.push(usuario);
          });
          resolve(usuarios);
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  }

/*  getAlmacenamiento(): Promise<Almacenamiento[]> {
    let promise = new Promise<Almacenamiento[]>((resolve, reject) => {
      const usuariosRef = this.angularFirestore.collection('Almacenamiento');
      const snapshot = usuariosRef
        .get()
        .toPromise()
        .then((data: any) => {
          let almacenamiento = new Array<Almacenamiento>();
          data.forEach((element) => {
            let usuarioJson = element.data();
            let a = Almacenamiento.createFromJsonObject(usuarioJson);
            almacenamiento.push(a);
          });
          resolve(almacenamiento);
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  }
*/
  //======================================================================================

  //==============
  //| Getters By |
  //==============

  getUsuarioByEmail(email:string): Promise<Usuario> {
    let promise = new Promise<Usuario>((resolve, reject) => {
      const usuariosRef = this.angularFirestore.collection('Usuarios').ref;
      usuariosRef
        .where('email', '==', email)
        .get()
        .then((data: any) => {
          let usuario = new Usuario();
          data.forEach((element:any) => {
            let usuarioJson = element.data();
            usuario = Usuario.createFromJsonObject(usuarioJson);
          });
          resolve(usuario);
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  } //end get usuarios

  getUsuarioById(id:any): Promise<Usuario> {
    let promise = new Promise<Usuario>((resolve, reject) => {
      const usuariosRef = this.angularFirestore.collection('Usuarios').ref;
      usuariosRef
        .where('id', '==', id)
        .get()
        .then((data: any) => {
          let usuario = new Usuario();
          data.forEach((element:any) => {
            let usuarioJson = element.data();
            usuario = Usuario.createFromJsonObject(usuarioJson);
          });
          resolve(usuario);
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  } //end get usuarios

  //======================================================================================

  //==============
  //| Getters TR |
  //==============

  getUsuariosTR(): any {
    return this.angularFirestore.collection('Usuarios').snapshotChanges();
  }

  getParticipantesTR(): any {
    //Nombre coleccion por fecha de evento
    let fecha = new Date();
    let nombre:string=`Participantes-${fecha.getDate()}.${fecha.getMonth()+1}.${fecha.getFullYear()}`

    return this.angularFirestore.collection(nombre).snapshotChanges();
  }

  getJuegosEventoTR(): any {
    //Nombre coleccion por fecha de evento
    let fecha = new Date();
    let nombre:string=`Juegos-${fecha.getDate()}.${fecha.getMonth()+1}.${fecha.getFullYear()}`

    this.angularFirestore.collection(nombre).snapshotChanges().subscribe((res)=>{
    })

    return this.angularFirestore.collection(nombre).snapshotChanges();
  }

  getJuegosTR(): any {
    return this.angularFirestore.collection('ListaJuegos').snapshotChanges();
  }

  //======================================================================================

  //===========
  //| Deletes |
  //===========

  
  eliminarUsuario(usuario: Usuario, valor: boolean): Promise<Boolean> {
    let promise = new Promise<Boolean>((resolve, reject) => {
      this.angularFirestore.collection('Usuarios').doc(usuario.id).delete().then(
        (data: any) => {
          if (valor) {
            this.presentToast(usuario.nombre + ' ' + usuario.apellidos + ' ha sido eliminado')


            //Email para eliminar de la autenticación de Firebase
            let usu = {
              emailBorrar: usuario.email,
              fechaBorrado: new Date()
            }
            this.angularFirestore.collection('UsuariosBorrados').add(usu)

          }
          resolve(true);
        }
      )
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  }//end_eliminar_usuario

  eliminarJuego(juego: Juego): Promise<Boolean> {
    let image = juego.imagen;
    let promise = new Promise<Boolean>((resolve, reject) => {
      this.angularFirestore
        .collection('ListaJuegos')
        .doc(juego.gameId)
        .delete()
        .then((data: any) => {
          resolve(true);
          this.removeFile(image);
          this.presentToast(
            juego.nombre + ' con ID: ' + juego.gameId + ' ha sido eliminado'
          );
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  } //end_eliminar_juego

  eliminarAlmacenamiento(almacenamiento: Almacenamiento): Promise<Boolean> {
    let promise = new Promise<Boolean>((resolve, reject) => {
      this.angularFirestore
        .collection('Almacenamiento')
        .doc(almacenamiento.id)
        .delete()
        .then((data: any) => {
          resolve(true);
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  } //end_eliminar_usuario

  eliminarParticipante(participante: Participante): Promise<Boolean> {
    //Nombre coleccion por fecha de evento
    let fecha = new Date();
    let nombre:string=`Participantes-${fecha.getDate()}.${fecha.getMonth()+1}.${fecha.getFullYear()}`

    let promise = new Promise<Boolean>((resolve, reject) => {
      this.angularFirestore
        .collection(nombre)
        .doc(participante.id)
        .delete()
        .then((data: any) => {
          resolve(true);
          this.presentToast(
            'El participante: ' +
            participante.nombre +
            ' ' +
            participante.apellidos +
            ' ha sido eliminado'
          );
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  } //end_eliminar_usuario

/*
  borrarEvento(evento): Promise<Boolean> {
    let promise = new Promise<Boolean>((resolve, reject) => {
      this.angularFirestore
      .collection('Juegos-29.11.2022')
      .get()
      .toPromise()
      .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    });
    })
      
    return promise;
    
  } //end_eliminar_usuario
  */

  //======================================================================================

  //===========
  //| Updates |
  //===========


  modificarUsuario(nuevosDatosUsuario: Usuario): Promise<Usuario> {
    let promise = new Promise<Usuario>((resolve, reject) => {
      this.angularFirestore
        .collection('Usuarios')
        .doc(nuevosDatosUsuario.id)
        .update(JSON.parse(JSON.stringify(nuevosDatosUsuario)))
        .then(() => {
          resolve(nuevosDatosUsuario);
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  } //end_modificar_usuario

  modificarJuego(nuevosDatosJuego: Juego): Promise<Juego> {
    let promise = new Promise<Juego>((resolve, reject) => {
      this.angularFirestore
        .collection('ListaJuegos')
        .doc(nuevosDatosJuego.gameId)
        .update(JSON.parse(JSON.stringify(nuevosDatosJuego)))
        .then(() => {
          resolve(nuevosDatosJuego);
          this.presentToast(
            'Se ha modificado el juego con id: ' + nuevosDatosJuego.gameId
          );
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  } //end_modificar_juego

  

  modificarParticipante(
    nuevosDatosParticipante: Participante
  ): Promise<Participante> {
    //Nombre coleccion por fecha de evento
    let fecha = new Date();
    let nombre:string=`Participantes-${fecha.getDate()}.${fecha.getMonth()+1}.${fecha.getFullYear()}`

    let promise = new Promise<Participante>((resolve, reject) => {
      this.angularFirestore
        .collection(nombre)
        .doc(nuevosDatosParticipante.id)
        .update(JSON.parse(JSON.stringify(nuevosDatosParticipante)))
        .then(() => {
          resolve(nuevosDatosParticipante);
          this.presentToast(
            'El participante: ' +
            nuevosDatosParticipante.nombre +
            ' ' +
            nuevosDatosParticipante.apellidos +
            ' ha sido actualizado con: ' +
            nuevosDatosParticipante.puntos
          );
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  } //end_modificar_participante


  /*
  modificarJuegosEvento(
    nuevosDatosJuego: JuegoEvento
  ): Promise<JuegoEvento> {
    //Nombre coleccion por fecha de evento
    let fecha = new Date();
    let nombre:string=`Juegos-${fecha.getDate()}.${fecha.getMonth()+1}.${fecha.getFullYear()}`

    let promise = new Promise<JuegoEvento>((resolve, reject) => {
      this.angularFirestore
        .collection(nombre)
        .doc(nuevosDatosJuego.juego.gameId)
        .update(JSON.parse(JSON.stringify(nuevosDatosJuego)))
        .then(() => {
          resolve(nuevosDatosJuego);
          this.presentToast(
            "El juego está " + nuevosDatosJuego.estado
          );
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  } //end_modificar_juevoevento

  */
  //======================================================================================

  //===========
  //| Inserts |
  //===========


  
  insertarUsuario(datosNuevoUsuario: Usuario): Promise<Usuario> {
    let promise = new Promise<Usuario>((resolve, reject) => {
      datosNuevoUsuario.id = this.angularFirestore
        .collection('Usuarios')
        .ref.doc().id;
      this.angularFirestore
        .collection('Usuarios')
        .doc(datosNuevoUsuario.id)
        .set(JSON.parse(JSON.stringify(datosNuevoUsuario)))
        .then(() => {
          resolve(datosNuevoUsuario);
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  } //end_insertarUsuario

  insertarJuego(datosNuevoJuego: Juego): Promise<Juego> {
    let promise = new Promise<Juego>((resolve, reject) => {
      this.angularFirestore
        .collection('ListaJuegos')
        .doc(datosNuevoJuego.gameId)
        .set(JSON.parse(JSON.stringify(datosNuevoJuego)))
        .then(() => {
          resolve(datosNuevoJuego);
          this.presentToast(
            'Nuevo juego añadido: ' +
            datosNuevoJuego.nombre +
            ' ' +
            datosNuevoJuego.editorial
          );
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  } //end_insertarjuego
/*
  insertarJuegosEventos(datosNuevoJuego: JuegoEvento,fecha:Date): Promise<JuegoEvento> {
    //Nombre coleccion por fecha de evento
    let nombre:string=`Juegos-${fecha.getDate()}.${fecha.getMonth()+1}.${fecha.getFullYear()}`

    let promise = new Promise<JuegoEvento>((resolve, reject) => {

      this.angularFirestore
        .collection(nombre)
        .doc(datosNuevoJuego.juego.gameId)
        .set(JSON.parse(JSON.stringify(datosNuevoJuego)))
        .then(() => {
          resolve(datosNuevoJuego);
          this.presentToast(
            'Nuevo juego añadido: ' +
            datosNuevoJuego.juego.nombre +
            ' ' +
            datosNuevoJuego.juego.editorial
          );
        })
        .catch((error: Error) => {
          reject(error.message);
        });


    });
    return promise;
  } //end_insertarjuego
*/

  

  insertarParticipante(
    datosNuevoParticipante: Participante
  ): Promise<Participante> {
    //Nombre coleccion por fecha de evento
    let fecha = new Date();
    let nombre:string=`Participantes-${fecha.getDate()}.${fecha.getMonth()+1}.${fecha.getFullYear()}`

    let promise = new Promise<Participante>((resolve, reject) => {
      datosNuevoParticipante.id = this.angularFirestore
        .collection(nombre)
        .ref.doc().id;
      this.angularFirestore
        .collection(nombre)
        .doc(datosNuevoParticipante.id)
        .set(JSON.parse(JSON.stringify(datosNuevoParticipante)))
        .then(() => {
          resolve(datosNuevoParticipante);
          this.presentToast(
            'Nueva participación creada de: ' +
            datosNuevoParticipante.nombre +
            ' ' +
            datosNuevoParticipante.apellidos
          );
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  } //end_insertarParticipante


  /*
  insertarEvento(evento:Evento):Promise<Evento>{
    //Nombre coleccion por fecha de evento
    let promise = new Promise<Evento>((resolve, reject) => {
      evento.id = this.angularFirestore
        .collection('Eventos')
        .ref.doc().id;
      this.angularFirestore
        .collection('Eventos')
        .doc(evento.id)
        .set(JSON.parse(JSON.stringify(evento)))
        .then(() => {
          resolve(evento);
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  }

  */
} //end_class
