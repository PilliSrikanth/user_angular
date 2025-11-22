import { TestBed } from '@angular/core/testing';

import { HostelPageService } from './hostel-page.service';

describe('HostelPageService', () => {
  let service: HostelPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HostelPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
