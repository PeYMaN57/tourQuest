import { Component } from '@angular/core';

// Para añadir quests a la lista del usuario
import  { DbService } from   '../services/db.service' ;

// Para cargar datos de un JSON online
import  { HttpService } from   '../services/http.service' ;

// Para cargar los datos de Firebase
import  { FirebaseDbService } from   '../services/firebase-db.service' ;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  // Vector que almacena temporalmente los datos leidos de la BD
  loadedQuests: any = [];

  // JSON online
  onlineQuests: any = [];

  // Vector que almacena los datos leidos de Firebase
  loadedFirebaseQuests: any = [];

  constructor(private db: DbService, private  http: HttpService, public dbFirebase: FirebaseDbService) {}

  getQuestsPage() {
     // Cargamos los datos de la BD
     this.db.getQuests().then(res =>  {
      if (res) {
        this.loadedQuests = [];
        for (let  i = 0; i < res.length; i++) {
          this.loadedQuests.push(res[i]);
        }

      }
    });
  }

  // Cada vez que entramos en la página cargamos los datos de la base de datos
  ionViewWillEnter() {
    this.getQuestsPage();
    this.loadOnlineQuests();
    this.getFirebase();
  }

  deleteQuest(ind) {
    this.db.delQuests(ind).then(() =>  {
      this.getQuestsPage();
    });
  }


  loadOnlineQuests() {
    this.http.loadQuests().subscribe((res) =>  {
      this.onlineQuests = res[ 'results' ];
    }, (error) => { console.error(error); })
  } 



  // Obtener los sitios de Firebase
  getFirebase() {
    this.dbFirebase.getQuests().subscribe(res => {
      this.loadedFirebaseQuests = [];
      res.forEach(data => {
        const questFire: any = data.payload.doc.data();
        questFire.id = data.payload.doc.id;
        this.loadedFirebaseQuests.push(questFire);
      });
    });



 }


}
