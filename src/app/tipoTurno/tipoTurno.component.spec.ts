import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoTurnoComponent } from './tipoTurno.component';

describe('TipoTurnoComponent', () => {
  let component: TipoTurnoComponent;
  let fixture: ComponentFixture<TipoTurnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoTurnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
