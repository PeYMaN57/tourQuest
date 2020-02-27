import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { GoogleMaps } from '@ionic-native/google-maps';
import { AndroidExoplayer } from '@ionic-native/android-exoplayer/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

// Base de datos local
import  { DbService } from   './services/db.service' ;
import  { IonicStorageModule } from   '@ionic/storage' ;

// Para leer JSON de internet
import  { HttpService } from   './services/http.service' ;
import  { HttpClientModule } from   '@angular/common/http' ;

// Para bloquear la orientación de la pantalla
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

// Para usar Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import  { AngularFireAuth } from   '@angular/fire/auth' ;


export const  firebaseConfig = {
  apiKey: "XXXXXXXXXX",
  authDomain: "XXXXXXXXXX" ,
  databaseURL: "XXXXXXXXXX",
  projectId: "XXXXXXXXXX",
  storageBucket: "XXXXXXXXXX",
  messagingSenderId: "XXXXXXXXXX"
}



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    YoutubeVideoPlayer,
    GoogleMaps,
    AndroidExoplayer,
    QRScanner,
    DbService,
    ScreenOrientation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HttpService,
    AngularFireAuth
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
