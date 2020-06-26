import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as XLSX from 'xlsx';
type AOA = any[][];

@Injectable({
  providedIn: 'root'
})
export class FileReaderService {
  public fileData$ = new BehaviorSubject<Array<Object>>(null);

  private _fileTypes = [
    '.csv',
    '.xlsx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];

  constructor() {}

  public getFileData(evt: any): void {
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    if (!this._validFileType(target.files[0])) return;

    this._readFile(evt);
  }

  // Helper function

  private _readFile(evt: any): void {
    const target: DataTransfer = <DataTransfer>evt.target;
    const dataFiles = [];

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const workBook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      console.log(' workBook.SheetNames', workBook.SheetNames);
      for (const workSheetname of workBook.SheetNames) {
        console.log(workSheetname);
        const workSheet: XLSX.WorkSheet = workBook.Sheets[workSheetname];
        dataFiles.push({ [workSheetname]: <AOA>XLSX.utils.sheet_to_json(workSheet, { header: 1 }) });
      }

      /* save data */

      console.log(dataFiles);
      this.fileData$.next(dataFiles);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  private _validFileType(file): boolean {
    if (!file || (!file.type && !file.name)) return false;
    const typeCheck = file.type ? file.type : `.${file.name.split('.').pop()}`;
    for (const type of this._fileTypes) {
      if (type === typeCheck) {
        return true;
      }
    }
    return false;
  }
}
