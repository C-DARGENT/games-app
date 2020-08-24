import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { DataModel } from '@app/models/data-files.model';

@Component({
  selector: '[app-td-edit-line]',
  styleUrls: ['./td-edit-line.component.less'],
  templateUrl: './td-edit-line.component.html'
})
export class TdEditLineComponent implements OnInit {
  @Input() public isEditionMode: boolean = false;
  @Input() public dataLineInformation: DataModel; // get reference of the object
  // edit property
  @Input() public editIndexData: number;

  @Output() editionFinished = new EventEmitter();

  public ngModelArray: Array<string>;
  public ngForArray: Array<string>; // helper variable

  public ngOnInit(): void {
    this.ngForArray = new Array(this.nbProperty);
    this.ngModelArray = new Array(this.nbProperty - 1); // dont need to edit the data id value

    if (this.isEditionMode) {
      this._setEditionData();
    }
  }

  public get nbProperty(): number {
    return this.dataLineInformation.title.length;
  }

  public get dataIdProperty(): number {
    return this.isEditionMode ? this.editIndexData + 1 : this.dataLineInformation.content.length + 1;
  }

  public confirmEdition(): void {
    this.editionFinished.emit(true);
    this._setEditionData(true);
  }

  public cancelEdition(): void {
    this.editionFinished.emit(true);
  }

  public pushNewLineData(): void {
    if (!this._validNgModelArray()) return;
    // Push new data on file model
    const dataArray: (string | number)[] = [];
    // First data index equal to length number
    for (let index = 0; index < this.ngModelArray.length; index++) {
      dataArray.push(this.ngModelArray[index]);
    }
    // Insert line number
    dataArray.unshift(this.dataLineInformation.content.length + 1);
    this.dataLineInformation.content.push(dataArray);

    // reset modelArray
    this.ngModelArray = new Array(this.nbProperty - 1);
  }

  // Helper Function

  private _validNgModelArray(): boolean {
    for (let index = 0; index < this.ngModelArray.length; index++) {
      if (!this.ngModelArray[index]) {
        return false;
      }
    }
    return true;
  }

  private _setEditionData(confirmEdition?: boolean): void {
    let i = 0;
    while (i < this.ngModelArray.length) {
      if (confirmEdition) {
        // save new prop values on data list variable
        this.dataLineInformation.content[this.editIndexData][i + 1] = this.ngModelArray[i];
      } else {
        // set current prop data value on update array
        this.ngModelArray[i] = this.dataLineInformation.content[this.editIndexData][i + 1];
      }
      i++;
    }
  }
}
