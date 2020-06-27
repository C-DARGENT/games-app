import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataFileModel } from '@app/models/data-files.model';
import { FileReaderService } from '@app/services/file-reader.service';
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
  private _changeEventListenerBind;
  private _copyData: Array<Object>;
  private _destroy$ = new Subject<boolean>();

  constructor(private _fileReaderService: FileReaderService) {}

  public ngOnInit(): void {
    this._fileReaderService.fileData$.pipe(takeUntil(this._destroy$)).subscribe((data) => {
      if (!data) return;
      this.filesData = data;
      this._copyData = [...data.data];
      console.log(data);
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

  public ngOnDestroy(): void {
    this.inputFileUpload.nativeElement.removeEventListener('change', this._changeEventListenerBind);
    this._destroy$.next(true);
    this._destroy$.complete();
  }
}
