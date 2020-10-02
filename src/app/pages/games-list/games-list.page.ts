import { AfterViewInit, Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-games-list',
  styleUrls: ['./games-list.page.less'],
  templateUrl: './games-list.page.html'
})
export class GamesListPage implements AfterViewInit, OnInit {
  @ViewChild('chartjs', { static: true }) chartjs$: ElementRef<HTMLCanvasElement>;
  public canvas: any;
  public ctx: any;
  public pieChartInitiate: boolean;
  public videoGamesRepartition: Array<number>; // first data NoTested | Tested | Finished
  protected _chartInstance: Chart;

  constructor(private cd: ChangeDetectorRef) {}

  public ngOnInit(): void {}

  public ngAfterViewInit(): void {
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    this._setConfig();
  }

  public getFilesData(filesData: Array<Array<any>>): void {
    if (!filesData || !filesData.length) return;
    this.videoGamesRepartition = [
      this._countFilesDataWithStatus(filesData, 'NoTested'),
      this._countFilesDataWithStatus(filesData, 'Tested'),
      this._countFilesDataWithStatus(filesData, 'Finished')
    ];
    console.log(this.videoGamesRepartition);
    this._setConfig();
  }

  // Helper function

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
