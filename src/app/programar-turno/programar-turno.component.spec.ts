import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramarTurnoComponent } from './programar-turno.component';

describe('ProgramarTurnoComponent', () => {
  let component: ProgramarTurnoComponent;
  let fixture: ComponentFixture<ProgramarTurnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramarTurnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramarTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
