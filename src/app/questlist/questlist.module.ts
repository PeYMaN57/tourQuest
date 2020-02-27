import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuestlistPageRoutingModule } from './questlist-routing.module';

import { QuestlistPage } from './questlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuestlistPageRoutingModule
  ],
  declarations: [QuestlistPage]
})
export class QuestlistPageModule {}
