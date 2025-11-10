import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoletaComponent } from './boleta';

describe('Boleta', () => {
  let component: BoletaComponent;
  let fixture: ComponentFixture<BoletaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoletaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
