import { Injectable } from '@angular/core';
import { AngularFirestore, fromCollectionRef } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AlertController, ToastController } from '@ionic/angular';
import { Almacenamiento } from 'src/modelo/Almacenamiento';
import { Juego } from 'src/modelo/Juego';
import { JuegoEvento } from 'src/modelo/JuegoEvento';
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
          data.forEach((element: any) => {
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

    getAlmacenamiento(): Promise<Almacenamiento[]> {
      let promise = new Promise<Almacenamiento[]>((resolve, reject) => {
        const usuariosRef = this.angularFirestore.collection('Almacenamiento');
        const snapshot = usuariosRef
          .get()
          .toPromise()
          .then((data: any) => {
            let almacenamiento = new Array<Almacenamiento>();
            data.forEach((element:any) => {
              let almacenamientoJson = element.data();
              let a = Almacenamiento.createFromJsonObject(almacenamientoJson);
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
  
  //======================================================================================

  //==============
  //| Getters By |
  //==============

  getUsuarioByEmail(email: string): Promise<Usuario> {
    let promise = new Promise<Usuario>((resolve, reject) => {
      const usuariosRef = this.angularFirestore.collection('Usuarios').ref;
      usuariosRef
        .where('email', '==', email)
        .get()
        .then((data: any) => {
          let usuario = new Usuario();
          data.forEach((element: any) => {
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

  getUsuarioById(id: any): Promise<Usuario> {
    let promise = new Promise<Usuario>((resolve, reject) => {
      const usuariosRef = this.angularFirestore.collection('Usuarios').ref;
      usuariosRef
        .where('id', '==', id)
        .get()
        .then((data: any) => {
          let usuario = new Usuario();
          data.forEach((element: any) => {
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


  getJuegoById(id: string): Promise<Juego> {
    let promise = new Promise<Juego>((resolve, reject) => {
      const juegosRef = this.angularFirestore.collection('ListaJuegos').ref;
      juegosRef
        .where('gameId', '==', id)
        .get()
        .then((data: any) => {
          let juego = new Juego();
          data.forEach((element: any) => {
            let juegoJson = element.data();
            juego = Juego.createFromJsonObject(juegoJson);
            
          });
          resolve(juego);
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  } //end get usuarios

  getAlmacenamientoById(id: string): Promise<Almacenamiento> {
    let promise = new Promise<Almacenamiento>((resolve, reject) => {
      const almacenamientoRef = this.angularFirestore.collection('Almacenamiento').ref;
      almacenamientoRef
        .where('id', '==', id)
        .get()
        .then((data: any) => {
          let almacenamiento = new Almacenamiento();
          data.forEach((element: any) => {
            let almacenamientoJson = element.data();
            almacenamiento = Almacenamiento.createFromJsonObject(almacenamientoJson);
            
          });
          resolve(almacenamiento);
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
    let nombre: string = `Participantes-${fecha.getDate()}.${fecha.getMonth() + 1}.${fecha.getFullYear()}`

    return this.angularFirestore.collection(nombre).snapshotChanges();
  }

  getJuegosEventoTR(): any {
    //Nombre coleccion por fecha de evento
    let fecha = new Date();
    let nombre: string = `Juegos-${fecha.getDate()}.${fecha.getMonth() + 1}.${fecha.getFullYear()}`

    this.angularFirestore.collection(nombre).snapshotChanges().subscribe((res) => {
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
          
          if(juego.imagen!=""){
            this.removeFile(image);
          }
          
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
    let nombre: string = `Participantes-${fecha.getDate()}.${fecha.getMonth() + 1}.${fecha.getFullYear()}`

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

  modificarAlmacen(nuevosDatosAlmacen: Almacenamiento): Promise<Almacenamiento> {
    let promise = new Promise<Almacenamiento>((resolve, reject) => {
      this.angularFirestore
        .collection('Almacenamiento')
        .doc(nuevosDatosAlmacen.id)
        .update(JSON.parse(JSON.stringify(nuevosDatosAlmacen)))
        .then(() => {
          resolve(nuevosDatosAlmacen);
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
    let nombre: string = `Participantes-${fecha.getDate()}.${fecha.getMonth() + 1}.${fecha.getFullYear()}`

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



  modificarJuegosEvento(nuevosDatosJuego: JuegoEvento): Promise<JuegoEvento> {
    //Nombre coleccion por fecha de evento
    let fecha = new Date();
    let nombre: string = `Juegos-${fecha.getDate()}.${fecha.getMonth() + 1}.${fecha.getFullYear()}`

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
  



  insertarParticipante(
    datosNuevoParticipante: Participante
  ): Promise<Participante> {
    //Nombre coleccion por fecha de evento
    let fecha = new Date();
    let nombre: string = `Participantes-${fecha.getDate()}.${fecha.getMonth() + 1}.${fecha.getFullYear()}`

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



  insertarAlmacen(datosNuevoAlmacen: Almacenamiento): Promise<Almacenamiento> {
    let promise = new Promise<Almacenamiento>((resolve, reject) => {
      this.angularFirestore
        .collection('Almacenamiento')
        .doc(datosNuevoAlmacen.id)
        .set(JSON.parse(JSON.stringify(datosNuevoAlmacen)))
        .then(() => {
          resolve(datosNuevoAlmacen);
          this.presentToast(
            'Nuevo almacén añadido: ' +
            datosNuevoAlmacen.ubicacion
          );
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  } //end_insertarjuego


} //end_class
