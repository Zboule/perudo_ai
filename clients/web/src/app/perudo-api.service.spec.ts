import { TestBed } from '@angular/core/testing';

import { PerudoApiService } from './perudo-api.service';

describe('PerudoApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PerudoApiService = TestBed.get(PerudoApiService);
    expect(service).toBeTruthy();
  });
});
