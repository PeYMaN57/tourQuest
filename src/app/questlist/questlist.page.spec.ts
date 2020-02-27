import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QuestlistPage } from './questlist.page';

describe('QuestlistPage', () => {
  let component: QuestlistPage;
  let fixture: ComponentFixture<QuestlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestlistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QuestlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
