import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnaEstanciaComponent } from './una-estancia.component';

describe('UnaEstanciaComponent', () => {
  let component: UnaEstanciaComponent;
  let fixture: ComponentFixture<UnaEstanciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnaEstanciaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnaEstanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
