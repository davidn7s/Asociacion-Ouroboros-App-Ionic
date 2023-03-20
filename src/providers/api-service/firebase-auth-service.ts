import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable()
export class FirebaseAuthService {

    constructor(public angularFireAuth: AngularFireAuth) {
    }

    registerUser(email: string, password: string): Promise<any> {
        return this.angularFireAuth.createUserWithEmailAndPassword(email, password);
    }

    loginUser(email: string, password: string): Promise<any> {
        return this.angularFireAuth.signInWithEmailAndPassword(email, password);
    }

    logoutUser(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (await this.angularFireAuth.currentUser) {  //antes del logout se comprueba que hay usuario logueado
                this.angularFireAuth.signOut()
                    .then(() => {
                        console.log("LOG Out");
                        resolve(null);
                    }).catch((error) => {
                        reject();
                    });
            }
        })
    }

    userDetails() {
        return this.angularFireAuth.user;
    }

    resetPassword(email:any){
        this.angularFireAuth.sendPasswordResetEmail(email)
    }

}//end_class