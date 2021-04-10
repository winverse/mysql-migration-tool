export interface ColumnDetail {
  Field: string;
  Type: string;
  Null: 'NO' | 'YES';
  Key: string;
  Default: null | string | number;
  Extra: 'auto_increment'
}

export interface SchemaDetail {
  tableName: string;
  columns: ColumnDetail[]
}

export interface DiffData {
  targetTable: string;
  type: string;
  query: string
  ddl: string | Promise<string>;
}