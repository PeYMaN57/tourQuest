import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

// Para añadir quests a la lista del usuario
import  { DbService } from   '../services/db.service' ;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(public actionSheetController: ActionSheetController, private  db: DbService) { }

  ngOnInit() {
  }



  // Guarda el ID del quest seleccionado en la base de datos
  guardarSitio(id_quest) {
    const  quest_id = {
      id: id_quest,
      nombre: "Quest añadido."
    };
    
    this.db.addQuests(quest_id).then((res) => {
      console.log( 'Se ha introducido correctamente en la BD' );
    }, (err) =>  {  console.log( 'Error al meter en la BD'  + err); });
  }
    

// Abre la hoja de acciones
  async presentActionSheet(id) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Quests',
      buttons: [{
        text: 'Add',
        handler: () => {
          console.log('Add clicked id: ' + id);
          this.guardarSitio(id);
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked id: ' + id);
        }
      }]
    });
    await actionSheet.present();
  }

  addToMyQuests (id) {
    this.presentActionSheet(id);
    //alert(a);
  }



}
