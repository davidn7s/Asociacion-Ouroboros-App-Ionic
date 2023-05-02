import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PipesModule } from './pipes/pipes.module';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { FirebaseAuthService } from 'src/providers/api-service/firebase-auth-service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage-angular';
import {Drivers} from '@ionic/storage'
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, 
    IonicModule.forRoot(),
     AppRoutingModule,
     PipesModule,
     HttpClientModule,
     AngularFireModule.initializeApp(environment.firebaseConfig),
     AngularFirestoreModule,
     ReactiveFormsModule,
     IonicStorageModule.forRoot({
      name:'bbdd',
      driverOrder:[CordovaSQLiteDriver._driver,Drivers.IndexedDB,Drivers.LocalStorage]
     })
     ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FireServiceProvider,
    FirebaseAuthService,
    AppComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
