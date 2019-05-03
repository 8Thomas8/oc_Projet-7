import { TestBed } from '@angular/core/testing';

import { MapCenterService } from './map-center.service';

describe('MapCenterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapCenterService = TestBed.get(MapCenterService);
    expect(service).toBeTruthy();
  });
});
