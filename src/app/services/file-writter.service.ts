import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class FileWritterService {
  //fs writter service
  public export(data: Array<[]>, sheetNames: string[], fileName: string): void {
    const name = fileName ? fileName : 'app-list.xlsx';
    /** Generate workbook */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    /** Push worksheet data */
    for (let index = 0; index < data.length; index++) {
      /* Generate worksheet */
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data[index]);

      /* Add the worksheet */
      XLSX.utils.book_append_sheet(wb, ws, sheetNames[index]);
    }

    /* save to file */
    XLSX.writeFile(wb, name);
  }
}
