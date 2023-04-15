import { TestBed } from '@angular/core/testing';

import { GradeCalcService } from './grade-calc.service';

describe('GradeCalcService', () => {
  let service: GradeCalcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GradeCalcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
