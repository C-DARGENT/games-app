import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FileReaderService } from '@app/services/file-reader.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-games-list',
  styleUrls: ['./games-list.component.less'],
  templateUrl: './games-list.component.html'
})
export class GamesListComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('inputFileUpload') public inputFileUpload: ElementRef;
  public filesData: Array<Object>;
  private _changeEventListenerBind;
  private _destroy$ = new Subject<boolean>();

  constructor(private _fileReaderService: FileReaderService) {}

  public ngOnInit(): void {
    this._fileReaderService.fileData$.pipe(takeUntil(this._destroy$)).subscribe((data) => {
      this.filesData = data;
      console.log(data);
    });
  }

  public ngAfterViewInit(): void {
    this._changeEventListenerBind = (evt: any) => {
      this._fileReaderService.getFileData(evt);
    };
    this.inputFileUpload.nativeElement.addEventListener('change', this._changeEventListenerBind);
  }

  public ngOnDestroy(): void {
    this.inputFileUpload.nativeElement.removeEventListener('change', this._changeEventListenerBind);
    this._destroy$.next(true);
    this._destroy$.complete();
  }
}
