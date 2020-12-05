import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDataListComponent } from './import-data-list.component';

describe('ImportDataListComponent', () => {
  let component: ImportDataListComponent;
  let fixture: ComponentFixture<ImportDataListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportDataListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
