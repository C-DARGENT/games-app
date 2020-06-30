import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataFileModel } from '@app/models/data-files.model';
import { FileReaderService } from '@app/services/file-reader.service';
import { FileWritterService } from '@app/services/file-writter.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-games-list',
  styleUrls: ['./data-list.component.less'],
  templateUrl: './data-list.component.html'
})
export class DataListComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('inputFileUpload') public inputFileUpload: ElementRef;
  public currentDataIndex: number = 0;
  public filesData: DataFileModel;
  public nbProperty: Array<number>;
  public ngModelArray: Array<string>;
  private _changeEventListenerBind;
  private _copyData: Array<Object>;
  private _destroy$ = new Subject<boolean>();

  constructor(private _fileReaderService: FileReaderService, private _fileWritterService: FileWritterService) {}

  public ngOnInit(): void {
    this._fileReaderService.fileData$.pipe(takeUntil(this._destroy$)).subscribe((data) => {
      if (!data) return;
      this.filesData = data;
      this._copyData = [...data.data];
      this.nbProperty = new Array(data.data[0].title.length);
      /*
        ngModelArray -> allows the user to add a new occurrence
        ngModelArray size is length-1 because the first property is uneditable (equal to 'data-id')
      */
      this.ngModelArray = new Array(data.data[0].title.length - 1); // to associa
    });
  }

  public ngAfterViewInit(): void {
    this._changeEventListenerBind = (evt: any) => {
      this._fileReaderService.getFileData(evt);
    };
    this.inputFileUpload.nativeElement.addEventListener('change', this._changeEventListenerBind);
  }

  public selectSheetData(dataToRender: number): void {
    this.currentDataIndex = dataToRender;
  }

  // sort by Ascending order (a -> z; 0 -> 9)
  public sortData(propIndex: number, dataIndex?: number): void {
    const sheetDataIndex = dataIndex ? dataIndex : this.currentDataIndex;
    this.filesData.data[sheetDataIndex].content.sort((a, b) => {
      if (a[propIndex] > b[propIndex]) {
        return 1;
      }
      if (b[propIndex] > a[propIndex]) {
        return -1;
      }
      return 0;
    });
  }

  public pushNewFileData(): void {
    if (!this._validNgModelArray()) return;
    //Push new data on file model
    this._addNewData();
    //Reset ngModel
    this.ngModelArray = new Array(this.filesData.data[this.currentDataIndex].title.length - 1);
  }

  public updateDataFile(): void {
    this._fileWritterService.export(this._concatFileData(), this.filesData.type);
  }

  // Helper function

  // Remerge title array and content array
  private _concatFileData(): Array<[]> {
    const concatData = [];
    for (let i = 0; i < this.filesData.data.length; i++) {
      console.log(this.filesData.data[i].title);
      // resort data by property id
      this.sortData(0, i);
      concatData.push([[...this.filesData.data[i].title], ...this.filesData.data[i].content]);
    }
    console.log('_concatFileData', concatData);
    return concatData;
  }

  private _validNgModelArray(): boolean {
    for (let index = 0; index < this.ngModelArray.length; index++) {
      if (!this.ngModelArray[index]) {
        return false;
      }
    }
    return true;
  }

  private _addNewData(): void {
    const dataArray: (string | number)[] = [];
    // First data index equal to length number
    for (let index = 0; index < this.ngModelArray.length; index++) {
      dataArray.push(this.ngModelArray[index]);
    }
    dataArray.unshift(this.filesData.data[this.currentDataIndex].content.length + 1);
    this.filesData.data[this.currentDataIndex].content.push(dataArray);
  }

  public ngOnDestroy(): void {
    this.inputFileUpload.nativeElement.removeEventListener('change', this._changeEventListenerBind);
    this._destroy$.next(true);
    this._destroy$.complete();
  }
}
