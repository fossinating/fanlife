import { TestBed } from '@angular/core/testing';

import { PlayernameService } from './playername.service';

describe('PlayernameService', () => {
  let service: PlayernameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayernameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
