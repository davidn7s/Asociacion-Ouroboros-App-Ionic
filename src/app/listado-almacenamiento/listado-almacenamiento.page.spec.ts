import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListadoAlmacenamientoPage } from './listado-almacenamiento.page';

describe('ListadoAlmacenamientoPage', () => {
  let component: ListadoAlmacenamientoPage;
  let fixture: ComponentFixture<ListadoAlmacenamientoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoAlmacenamientoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoAlmacenamientoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
