import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TdEditLineComponent } from './td-edit-line.component';

describe('TdEditLineComponent', () => {
  let component: TdEditLineComponent;
  let fixture: ComponentFixture<TdEditLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TdEditLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TdEditLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
