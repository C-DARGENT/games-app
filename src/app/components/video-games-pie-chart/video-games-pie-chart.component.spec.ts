import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoGamesPieChartComponent } from './video-games-pie-chart.component';

describe('VideoGamesPieChartComponent', () => {
  let component: VideoGamesPieChartComponent;
  let fixture: ComponentFixture<VideoGamesPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoGamesPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoGamesPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
