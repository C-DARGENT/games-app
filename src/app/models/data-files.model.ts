export interface DataFileModel {
  data: DataModel[];
  dataType: string[];
  name: string;
}

export interface DataModel {
  title: Array<[]>;
  content: Array<[]>;
}
