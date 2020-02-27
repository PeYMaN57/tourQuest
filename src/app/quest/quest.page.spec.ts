import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QuestPage } from './quest.page';

describe('QuestPage', () => {
  let component: QuestPage;
  let fixture: ComponentFixture<QuestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QuestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
