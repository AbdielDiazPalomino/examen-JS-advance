import { TestBed } from '@angular/core/testing';

import { Reniec } from './reniec';

describe('Reniec', () => {
  let service: Reniec;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Reniec);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
