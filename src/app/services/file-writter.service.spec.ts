import { TestBed } from '@angular/core/testing';

import { FileWritterService } from './file-writter.service';

describe('FileWritterService', () => {
  let service: FileWritterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileWritterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
