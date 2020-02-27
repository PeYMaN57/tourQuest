import { Component, OnInit } from '@angular/core';
import  { ActivatedRoute } from   '@angular/router' ; 

@Component({
  selector: 'app-questlist',
  templateUrl: './questlist.page.html',
  styleUrls: ['./questlist.page.scss'],
})
export class QuestlistPage implements OnInit {

  id_cities: any = null;

  constructor(private  route: ActivatedRoute) { }

  ngOnInit() {
    let  id_city = this .route.snapshot.paramMap.get( 'id_city' );
    this.id_cities = id_city;
  }

}
