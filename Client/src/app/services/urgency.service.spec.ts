import { TestBed } from '@angular/core/testing';

import { UrgencyService } from './urgency.service';

describe('UrgencyService', () => {
  let service: UrgencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrgencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
