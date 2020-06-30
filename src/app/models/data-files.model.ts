export interface DataFileModel {
  data: DataModel[];
  type: string[];
  name: string;
}

export interface DataModel {
  title: Array<any[]>;
  content: Array<any[]>;
}
