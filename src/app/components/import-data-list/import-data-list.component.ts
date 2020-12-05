import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FileReaderService } from '@app/services/file-reader.service';

@Component({
  selector: 'app-import-data-list',
  styleUrls: ['./import-data-list.component.less'],
  templateUrl: './import-data-list.component.html',
})
export class ImportDataListComponent implements AfterViewInit, OnDestroy {
  @ViewChild('inputFileUpload') public inputFileUpload: ElementRef;
  public filesData: any;

  private _inputChangeEventListenerBind: (evt:any)=> void;
  constructor(private _fileReaderService: FileReaderService) { }

  public ngAfterViewInit(): void {
    this._inputChangeEventListenerBind = (evt: any) => {
      this._fileReaderService.getFileData(evt);
    };
    this.inputFileUpload.nativeElement.addEventListener('change', this._inputChangeEventListenerBind);
  }

  public ngOnDestroy(): void {
    this.inputFileUpload.nativeElement.removeEventListener('change', this._inputChangeEventListenerBind);
  }
}
