import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataFileModel, DataModel } from '@app/models/data-files.model';
import { FileReaderService } from '@app/services/file-reader.service';
import { FileWritterService } from '@app/services/file-writter.service';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-data-list',
  styleUrls: ['./data-list.component.less'],
  templateUrl: './data-list.component.html'
})
export class DataListComponent implements AfterViewInit, OnInit, OnDestroy {
  @Output() public fileDataContent = new EventEmitter<Array<Array<any>>>();
  @ViewChild('inputFileUpload') public inputFileUpload: ElementRef;
  public currentDataIndex: number = 0;
  public ngModelDataType: string;
  public editViewIndex: number;
  public filesData: DataFileModel;
  public fileFormGroup: FormGroup;
  public isAscendingSort: boolean = true;
  public isEdition: boolean;
  public nbProperty: Array<number>;
  public ngModelArray: Array<string>; // add new line data information
  public ngUpdateArray: Array<any>; // edit line data information
  public sortIndex: number;
  private _inputChangeEventListenerBind;
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
      this.fileDataContent.emit(data.data[this.currentDataIndex].content);
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
    this._inputChangeEventListenerBind = (evt: any) => {
      this._fileReaderService.getFileData(evt);
    };
    this.inputFileUpload.nativeElement.addEventListener('change', this._inputChangeEventListenerBind);
  }

  public get currentSheetData(): DataModel {
    return this.filesData.data[this.currentDataIndex];
  }

  public createDataType(): void {
    ($('#addNewDataTypeModal') as any).modal('hide');
    const title = _.cloneDeep(this.filesData.data[0].title);
    this.filesData.type.push(this.ngModelDataType);
    this.filesData.data.push({ title, content: new Array() });
    this.ngModelDataType = null;
  }

  public isSortIconActive(sortTitle: number, ascendingOrder: boolean): boolean {
    return this.sortIndex === sortTitle && this.isAscendingSort === ascendingOrder;
  }

  public renderEditDataView(dataIndex: number): void {
    this.editViewIndex = dataIndex;
    this.isEdition = true;
  }

  public editionFinished(): void {
    this.editViewIndex = null;
    this.isEdition = false;
  }

  public selectSheetData(dataToRender: number): void {
    this.currentDataIndex = dataToRender;
    this.fileDataContent.emit(this.filesData.data[this.currentDataIndex].content);
    this.editViewIndex = null;
    this.isEdition = false;
  }

  public theadSort(isFirstProp: boolean, index: number): void {
    if (isFirstProp) return;
    // prevent sort first line property (== data id) because we reset data id
    if (!this.sortIndex && this.sortIndex !== 0) {
      this.sortIndex = 0;
    } else {
      // SortIndex exist
      if (this.sortIndex === index) {
        // same index so inverse isAscending order
        this.isAscendingSort = !this.isAscendingSort;
      } else {
        this.sortIndex = index;
        this.isAscendingSort = true;
      }
    }
    this.sortData(index, this.isAscendingSort);
    this._updateLineDataId();
  }

  // sort by Ascending order (a -> z; 0 -> 9)
  public sortData(propIndex: number, ascendingSortOrder: boolean, dataIndex?: number): void {
    // not authorize sort when wwe are on edit Mode
    if (this.editViewIndex) return;
    const sheetDataIndex = dataIndex ? dataIndex : this.currentDataIndex;
    this.filesData.data[sheetDataIndex].content.sort((a, b) => {
      if (a[propIndex] > b[propIndex]) {
        return ascendingSortOrder ? 1 : -1;
      }
      if (b[propIndex] > a[propIndex]) {
        return ascendingSortOrder ? -1 : 1;
      }
      return 0;
    });
  }

  public removeData(dataIndex: number): void {
    this.filesData.data[this.currentDataIndex].content.splice(dataIndex, 1);
    this.sortData(0, true);
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

  private _updateLineDataId(): void {
    for (let index = 0; index < this.filesData.data[this.currentDataIndex].content.length; index++) {
      // set first proprety (== id) of the index line data
      this.filesData.data[this.currentDataIndex].content[index][0] = index + 1;
    }
  }

  // Remerge title array and content array
  private _concatFileData(): Array<[]> {
    const concatData = [];
    for (let i = 0; i < this.filesData.data.length; i++) {
      // resort data by property id
      this.sortData(0, true, i);
      concatData.push([[...this.filesData.data[i].title], ...this.filesData.data[i].content]);
    }
    return concatData;
  }

  public ngOnDestroy(): void {
    this.inputFileUpload.nativeElement.removeEventListener('change', this._inputChangeEventListenerBind);
    this._destroy$.next(true);
    this._destroy$.complete();
  }
}
