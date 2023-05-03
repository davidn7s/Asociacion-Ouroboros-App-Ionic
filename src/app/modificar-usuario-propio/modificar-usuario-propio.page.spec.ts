import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModificarUsuarioPropioPage } from './modificar-usuario-propio.page';

describe('ModificarUsuarioPropioPage', () => {
  let component: ModificarUsuarioPropioPage;
  let fixture: ComponentFixture<ModificarUsuarioPropioPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificarUsuarioPropioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarUsuarioPropioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
