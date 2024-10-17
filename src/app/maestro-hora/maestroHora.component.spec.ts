import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestroHoraComponent } from './maestroHora.component';

describe('MaestroHoraComponent', () => {
  let component: MaestroHoraComponent;
  let fixture: ComponentFixture<MaestroHoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaestroHoraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaestroHoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
