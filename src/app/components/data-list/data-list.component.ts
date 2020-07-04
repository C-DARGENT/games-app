import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataFileModel } from '@app/models/data-files.model';
import { FileReaderService } from '@app/services/file-reader.service';
import { FileWritterService } from '@app/services/file-writter.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-games-list',
  styleUrls: ['./data-list.component.less'],
  templateUrl: './data-list.component.html'
})
export class DataListComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('inputFileUpload') public inputFileUpload: ElementRef;
  public currentDataIndex: number = 0;
  public editViewIndex: number;
  public filesData: DataFileModel;
  public fileFormGroup: FormGroup;
  public isEdition: boolean;
  public nbProperty: Array<number>;
  public ngModelArray: Array<string>;
  public ngUpdateArray: Array<any>;
  private _changeEventListenerBind;
  private _copyData: Array<Object>;
  private _destroy$ = new Subject<boolean>();

  constructor(
    private _fileReaderService: FileReaderService,
    private _fileWritterService: FileWritterService,
    private _fb: FormBuilder
  ) {
    this.fileFormGroup = this._fb.group({ fileName: ['', Validators.required] });
  }

  public ngOnInit(): void {
    this._fileReaderService.fileData$.pipe(takeUntil(this._destroy$)).subscribe((data) => {
      if (!data) return;
      // New data so reset data index
      this.currentDataIndex = 0;

      this.filesData = data;
      this.fileFormGroup.controls['fileName'].setValue(data.name);
      this._copyData = [...data.data];
      this.nbProperty = new Array(data.data[0].title.length);
      /*
        ngModelArray -> allows the user to add a new occurrence
        ngModelArray size is length-1 because the first property is uneditable (equal to 'data-id')
      */
      this.ngModelArray = new Array(data.data[0].title.length - 1); // to associa
      this.ngUpdateArray = new Array(data.data[0].title.length - 1); // to associa
    });
  }

  public ngAfterViewInit(): void {
    this._changeEventListenerBind = (evt: any) => {
      this._fileReaderService.getFileData(evt);
    };
    this.inputFileUpload.nativeElement.addEventListener('change', this._changeEventListenerBind);
  }

  public renderEditDataView(dataIndex: number): void {
    this.editViewIndex = dataIndex;
    this.isEdition = true;
    this._setEditionData(dataIndex);
  }

  public confirmEdition(dataIndex: number): void {
    this._setEditionData(dataIndex, true);
    this.editViewIndex = null;
    this.isEdition = false;
  }

  public cancelEdition(): void {
    this.editViewIndex = null;
    this.isEdition = false;
    // Reinit edit array
    this.ngUpdateArray = new Array(this.filesData.data[this.currentDataIndex].title.length - 1);
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

  // Add new data
  public pushNewFileData(): void {
    if (!this._validNgModelArray()) return;
    // Push new data on file model
    this._addNewData();
    // Reset ngModel
    this.ngModelArray = new Array(this.filesData.data[this.currentDataIndex].title.length - 1);
  }

  public removeData(dataIndex: number): void {
    this.filesData.data[this.currentDataIndex].content.splice(dataIndex, 1);
    this.sortData(0);
    // reset right data index
    this.filesData.data[this.currentDataIndex].content.forEach((element, index) => {
      element[0] = index + 1;
    });
  }

  public updateDataFile(): void {
    this._fileWritterService.export(
      this._concatFileData(),
      this.filesData.type,
      this.fileFormGroup.controls['fileName'].value
    );
  }

  // Helper function

  // Remerge title array and content array
  private _concatFileData(): Array<[]> {
    const concatData = [];
    for (let i = 0; i < this.filesData.data.length; i++) {
      // resort data by property id
      this.sortData(0, i);
      concatData.push([[...this.filesData.data[i].title], ...this.filesData.data[i].content]);
    }
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

  private _setEditionData(dataIndex: number, confirmEdition?: boolean): void {
    let i = 0;
    while (i < this.ngUpdateArray.length) {
      if (confirmEdition) {
        // save new prop values on data list variable
        this.filesData.data[this.currentDataIndex].content[dataIndex][i + 1] = this.ngUpdateArray[i];
      } else {
        // set current prop data value on update array
        this.ngUpdateArray[i] = this.filesData.data[this.currentDataIndex].content[dataIndex][i + 1];
      }
      i++;
    }
  }

  public ngOnDestroy(): void {
    this.inputFileUpload.nativeElement.removeEventListener('change', this._changeEventListenerBind);
    this._destroy$.next(true);
    this._destroy$.complete();
  }
}
