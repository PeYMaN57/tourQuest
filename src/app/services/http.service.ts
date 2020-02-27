import { Injectable } from '@angular/core';

// Paquete para realizar las peticiones al servidor
import  { HttpClient } from   '@angular/common/http' ;

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(public http: HttpClient) { }


  loadQuests() {
    return this.http.get( 'https://randomuser.me/api/?results=6&nat=es&format=json' )
  } 

}
