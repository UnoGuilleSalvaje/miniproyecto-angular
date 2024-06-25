import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesibilitybuttonComponent } from './accesibilitybutton.component';

describe('AccesibilitybuttonComponent', () => {
  let component: AccesibilitybuttonComponent;
  let fixture: ComponentFixture<AccesibilitybuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccesibilitybuttonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccesibilitybuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
