import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  animations: [       // metadata array
    trigger('toggleClick', [     // trigger block
    transition('true => false', animate('1000ms linear')),  // animation timing
    transition('false => true', animate('1000ms linear')),
    state('true', style({      // final CSS following animation
      opacity: 1
    })),
    state('false', style({
      opacity: 0.25,
      height: '70px',
      overflow: 'hidden',
      background: '#80808040'
    })),
  ])
] ,
  selector: 'app-video-games-pie-chart',
  styleUrls: ['./video-games-pie-chart.component.less'],
  templateUrl: './video-games-pie-chart.component.html'
})
export class VideoGamesPieChartComponent implements AfterViewInit {
  @Input() public set filesData (data: Array<Array<any>>){
    if(!data || !data.length) return;
    this.videoGamesRepartition = [
      this._countFilesDataWithStatus(data, 'NoTested'),
      this._countFilesDataWithStatus(data, 'Tested'),
      this._countFilesDataWithStatus(data, 'Finished')
    ];
    this._filesData = data;
    this._setConfig();
  }
  @Input() public fullScreen: boolean = false;
  @ViewChild('chartjs', { static: true }) chartjs$: ElementRef<HTMLCanvasElement>;
  @Output() public fullScreenEvent = new EventEmitter<boolean>();

  public canvas: any;
  public ctx: any;
  public pieChartInitiate: boolean;
  public videoGamesRepartition: Array<number>; // first data NoTested | Tested | Finished

  private _chartInstance: Chart;
  private _filesData : Array<Array<any>>;

  constructor() {}

  public toogleFullScreen(): void {
    this.fullScreen = !this.fullScreen;
    this.fullScreenEvent.emit(this.fullScreen);
  }

  public ngAfterViewInit(): void {
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    this._setConfig();
  }

  public nextVideoGames(): void {
    const noTestedGames = this._filesData.filter((data)=> data[3] === 'NoTested');
    const index = Math.floor(Math.random()*this._countFilesDataWithStatus(this._filesData,'NoTested'));
    alert(noTestedGames[index][1]);
  }

  private _countFilesDataWithStatus(filesData: Array<Array<any>>, status: 'NoTested' | 'Tested' | 'Finished'): number {
    let count = 0;
    for (const data of filesData) {
      for (const property of data) {
        if (property === status) {
          count++;
          continue;
        }
      }
    }
    return count;
  }

  private _setConfig(): void {
    if (!this.chartjs$) return;

    if (!this._chartInstance) {
      this._chartInstance = new Chart(this.ctx, {
        data: {
          datasets: [
            {
              backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
              borderWidth: 1,
              data: this.videoGamesRepartition,
              label: '# of Votes'
            }
          ],
          labels: ['NoTested', 'Tested', 'Finished']
        },
        options: {
          legend: {
            position: 'bottom'
          },
          responsive: false
        },
        type: 'pie'
      });
    }

    this._chartInstance.data.datasets = [
      {
        backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
        data: this.videoGamesRepartition,
        label: '# of Votes'
      }
    ];
    this._chartInstance.update();
  }

}
