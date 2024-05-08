import { TestBed } from '@angular/core/testing';

import { EstanciasService } from './estancias.service';

describe('EstanciasService', () => {
  let service: EstanciasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstanciasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
