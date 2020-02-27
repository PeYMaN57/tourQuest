import { Injectable } from '@angular/core';
import  { Storage } from   '@ionic/storage' ;

@Injectable({
  providedIn: 'root'
})
export class DbService {

  // Definimos un vector
  myQuests: any = [];

  constructor(private storage: Storage ) {
    // Hay que poner esto dentro del constructor para que no se borren todas
    // las entradas de la base de datos local
    this.getQuests().then( res => {
      if (res) {
        this.myQuests = res;
      }
    });
  }

  // Añade quests
  addQuests(quest_id) {
    this.myQuests.push(quest_id);
    return this.storage.set( 'userQuests' , this.myQuests);
  }

  // Obtiene quests
  getQuests() {
    return this.storage.get( 'userQuests' );
  }

  // Borra quests
  delQuests(ind) {
    this.myQuests.splice(ind, 1);
    return this.storage.set( 'userQuests' , this.myQuests);
  } 

}
