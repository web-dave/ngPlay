import { TestBed } from '@angular/core/testing';

import { KarpatenhundService } from './karpatenhund.service';

describe('KarpatenhundService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KarpatenhundService = TestBed.get(KarpatenhundService);
    expect(service).toBeTruthy();
  });
});
