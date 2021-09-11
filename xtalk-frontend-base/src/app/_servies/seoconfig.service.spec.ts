import { TestBed } from '@angular/core/testing';

import { SeoConfigService } from './seoconfig.service';

describe('SeoconfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SeoConfigService = TestBed.get(SeoConfigService);
    expect(service).toBeTruthy();
  });
});
