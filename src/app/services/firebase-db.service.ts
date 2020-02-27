import { Injectable } from '@angular/core';

import  { AngularFirestore  } from   '@angular/fire/firestore' ;


@Injectable({
  providedIn: 'root'
})
export class FirebaseDbService {

  constructor( public asf: AngularFirestore ) { }

  getQuests() {
    return this.asf.collection( 'quests' ).snapshotChanges();
  } 

}
