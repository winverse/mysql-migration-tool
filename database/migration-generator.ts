import fs from 'fs';
import path from 'path';

import { ColumnDetail, SchemaDetail, DiffData } from '../types';
import timestamp from '../lib/timestamp';
import getSchemaDir from '../lib/schema-dir';
import getMigrationDir from '../lib/migration-dir';
import query from './query/query';
import findDiff from '../lib/find-diff';

interface StringKeyOfObject {
  [key: string]: string
}

class MigrationGenerator {
  private databaseName: string = '';
  private metaTableName: string = '';
  private isDev = process.env.NODE_ENV !== 'production';

  private constructor(databaseName: string, metaTableName: string) {
    this.databaseName = databaseName;
    this.metaTableName = metaTableName;
  }

  static setDatabaseName (databaseName: string, metaTableName: string) {
    return new MigrationGenerator(databaseName, metaTableName);
  }

  private async getTableNames(): Promise<string[]> {
    try {
      const rows = await query('SHOW TABLES');
      const tableNames = rows.map((row: StringKeyOfObject) => row[`Tables_in_${this.databaseName}`]);
      return tableNames;
    } catch (err) {
      throw new Error(err as string);
    }
  }

  private async getTableSchema(tableName: string): Promise<SchemaDetail> {
    try { 
      const rows: ColumnDetail[] = await query(`DESC ${tableName}`);
      return { tableName, columns: rows }
    } catch (err) {
      throw new Error(err as string);
    }
  }

  private getLastSchemaData (): SchemaDetail[] | void {
    const dir = getSchemaDir();
    const lastSchema = fs.readdirSync(dir).filter((file) => path.extname(file) === '.json').pop();
    if (!lastSchema) return;
    const lastSchemaData = fs.readFileSync(`${dir}/${lastSchema}`, 'utf8');
    return JSON.parse(lastSchemaData);
  }

  private createMigrationContext (diff: DiffData[]): string {
    if (this.isDev) {
      return `const up = ${JSON.stringify(diff, null, 4)};\n\nexport default up;`
    }
    return `const up = ${JSON.stringify(diff, null, 4)};\n\nmodule.exports = up;`
  }

  private writeFiles (diff: DiffData[], findedSchema: SchemaDetail[], filename: string): void {
    const schemaDirPath = getSchemaDir();
    const migrationDirPath = getMigrationDir();
    const ext = this.isDev ? '.ts' : '.js';
    fs.writeFileSync(`${schemaDirPath}/${filename}.json`, JSON.stringify(findedSchema, null, 4), 'utf8');
    const context = this.createMigrationContext(diff);
    fs.writeFileSync(`${migrationDirPath}/${filename}${ext}`, context, 'utf8');
  }

  private async migrateRecord (filename: string) {
    try {
      const rawQuery = `INSERT INTO \`${this.databaseName}\`.\`${this.metaTableName}\` 
        (name) VALUE ('${filename}');
      `;
      await query(rawQuery); 
    } catch (err) {
      throw new Error(err as string);
    }
  }

  public async schemaTracker(): Promise<{ filename: string; isDiff: boolean }> {
    const tableNames = await this.getTableNames();
    const presentSchema = await Promise.all(tableNames.map(this.getTableSchema));
    const filename = `${timestamp()}`
    const lastSchemaData = this.getLastSchemaData();

    let isDiff = true;
    if (!lastSchemaData) {
      // 초기화
      const diff = await findDiff([], presentSchema);
      this.writeFiles(diff, presentSchema, filename);
    } else {
      const diff = await findDiff(lastSchemaData, presentSchema);
      // 이전 내용과 비교해 다를경우에만 새로 생성
      if (diff.length > 0) {
        this.writeFiles(diff, presentSchema, filename);
      } else {
        isDiff = false;
      }
    }

    await this.migrateRecord(`${filename}.ts`);

    return { filename, isDiff };
  }
}

export default MigrationGenerator;