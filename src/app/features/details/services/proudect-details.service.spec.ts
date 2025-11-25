import { TestBed } from '@angular/core/testing';

import { ProudectDetailsService } from './proudect-details.service';

describe('ProudectDetailsService', () => {
  let service: ProudectDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProudectDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
