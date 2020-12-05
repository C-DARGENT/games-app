import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-games-list',
  styleUrls: ['./games-list.page.less'],
  templateUrl: './games-list.page.html'
})
export class GamesListPage {
  public data : Array<Array<any>>
  public firstCardFullScreen: boolean = true;
  public secondCardFullScreen: boolean = false;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}


  public onFirstCardChange(toggle: boolean): void {
    this.firstCardFullScreen = toggle;
    if(toggle){
      this.secondCardFullScreen = false;
    }
    this._changeDetectorRef.detectChanges();
  }

  public onSecondCardChange(toggle: boolean): void {
    this.secondCardFullScreen = toggle;
    if(toggle) {
      this.firstCardFullScreen = false;
    }
    this._changeDetectorRef.detectChanges();
  }

  public getFilesData(filesData: Array<Array<any>>): void {
    if (!filesData || !filesData.length) return;
   this.data = filesData
  }
}
