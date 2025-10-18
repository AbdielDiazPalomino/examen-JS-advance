import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionComponent } from './administracion';

describe('Administracion', () => {
  let component: AdministracionComponent;
  let fixture: ComponentFixture<AdministracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministracionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
