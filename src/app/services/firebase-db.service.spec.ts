import { TestBed } from '@angular/core/testing';

import { FirebaseDbService } from './firebase-db.service';

describe('FirebaseDbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebaseDbService = TestBed.get(FirebaseDbService);
    expect(service).toBeTruthy();
  });
});
