import { Component, OnInit } from '@angular/core';
import  { ActivatedRoute } from   '@angular/router' ;
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import {Platform} from '@ionic/angular';
import { GoogleMaps, GoogleMap, Environment } from '@ionic-native/google-maps/ngx';
import { AndroidExoplayer } from '@ionic-native/android-exoplayer/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { NavController } from '@ionic/angular';
import * as L from 'leaflet';


@Component({
  selector: 'app-quest',
  templateUrl: './quest.page.html',
  styleUrls: ['./quest.page.scss'],
})
export class QuestPage implements OnInit {

  id_quests: any = null;
  map: GoogleMap;
  response_qr: any = null;

  // Mapa de leaflet local
  map_leaflet : any;

  constructor(private route: ActivatedRoute, private youtube: YoutubeVideoPlayer, private platform: Platform, 
    private exoPlayer: AndroidExoplayer, public qrScanCtrl: QRScanner, private navCtrl: NavController) { }

  async ngOnInit() {
    let  id_quest = this .route.snapshot.paramMap.get( 'id_quest' );
    this.id_quests = id_quest;

    await this.platform.ready();
    await this.loadMap();


  // Configuración del mapa Leaflet local
  /*this.map_leaflet = L.map('mapa_leaflet').
    setView([ 28.1281521, -15.4489039],
    15);*/

    this.map_leaflet = L.map('mapa_leaflet', {
      center: [28.1281521, -15.4489039],
      zoom: 15,
      zoomControl: true
  });

  //L.tileLayer('assets/leaflet/mapa/{z}/{x}/{y}.png', { maxZoom: 15 }).addTo(this.map_leaflet);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map_leaflet);
  

  L.marker([ 28.127567,-15.4469402], {draggable: false}).addTo(this.map_leaflet);

  }

  openMyVideo(id){
    this.youtube.openVideo(id);
  }


  loadMap() {

    // This code is necessary for browser
    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': 'XXXXXXXXXX',
      'API_KEY_FOR_BROWSER_DEBUG': 'XXXXXXXXXX'
    });

    this.map = GoogleMaps.create('map_canvas');

  }



async escanearCodigo () {
  // Optionally request the permission early
this.qrScanCtrl.prepare()
.then((status: QRScannerStatus) => {
   if (status.authorized) {
     // camera permission was granted

     // NUEVO
     this.qrScanCtrl.show();
     document.getElementsByTagName("body")[0].style.opacity = "0";

     // start scanning
     let scanSub = this.qrScanCtrl.scan().subscribe((text: string) => {
       console.log('Scanned something', text);

       // NUEVO
       this.response_qr = text;
       // alert(text);
      document.getElementsByTagName("body")[0].style.opacity = "1";

       this.qrScanCtrl.hide(); // hide camera preview
       scanSub.unsubscribe(); // stop scanning

       // Nuevo
       this.qrScanCtrl.destroy();
       //////////////////////////////////////////
       this.navCtrl.pop();
     });

   } else if (status.denied) {
     // camera permission was permanently denied
     // you must use QRScanner.openSettings() method to guide the user to the settings page
     // then they can grant the permission from there
   } else {
     // permission was denied, but not permanently. You can ask for permission again at a later time.
   }
})
.catch((e: any) => console.log('Error is', e));
}


}
