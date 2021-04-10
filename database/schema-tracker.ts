import fs from 'fs';
import path from 'path';

import { ColumnDetail, SchemaDetail, DiffData } from '../types';
import timestamp from '../lib/timestamp';
import getSchemaDir from '../lib/schema-dir';
import getMigrationDir from '../lib/migration-dir';
import { DATABASE_NAME, isDev } from './config';
import customQuery from './query/custom-query';
import findDiff from '../lib/find-diff';

interface StringKeyOfObject {
  [key: string]: string
}

async function getTableNames(): Promise<string[]> {
  try {
    const rows = await customQuery('SHOW TABLES');
    const tableNames = rows.map((row: StringKeyOfObject) => row[`Tables_in_${DATABASE_NAME}`]);
    return tableNames;
  } catch (err) {
    throw new Error(err);
  }
}

async function getTableSchema(tableName: string): Promise<SchemaDetail> {
  try { 
    const rows: ColumnDetail[] = await customQuery(`DESC ${tableName}`);
    return { tableName, columns: rows }
  } catch (err) {
    throw new Error(err);
  }
}

function getLastSchemaData (): SchemaDetail[] | void {
  const dir = getSchemaDir();
  const lastSchema = fs.readdirSync(dir).filter((file) => path.extname(file) === '.json').pop();
  if (!lastSchema) return;
  const lastSchemaData = fs.readFileSync(`${dir}/${lastSchema}`, 'utf8');
  return JSON.parse(lastSchemaData);
}

function createMigrationContext (diff: DiffData[]): string {
  if (isDev) {
    return `const up = ${JSON.stringify(diff, null, 4)};\n\nexport default up;`
  }
  return `const up = ${JSON.stringify(diff, null, 4)};\n\nmodule.exports = up;`
}

function writeFiles (diff: DiffData[], findedSchema: SchemaDetail[], filename: string): void {
  const schemaDirPath = getSchemaDir();
  const migrationDirPath = getMigrationDir();
  const ext = isDev ? '.ts' : '.js';
  fs.writeFileSync(`${schemaDirPath}/${filename}.json`, JSON.stringify(findedSchema, null, 4), 'utf8');
  const context = createMigrationContext(diff);
  fs.writeFileSync(`${migrationDirPath}/${filename}${ext}`, context, 'utf8');
}

async function schemaTracker(): Promise<{ filename: string; isDiff: boolean }> {
  const tableNames = await getTableNames();
  const findedSchema = await Promise.all(tableNames.map(getTableSchema));
  const filename = `${timestamp()}`
  const lastSchemaData = getLastSchemaData()

  let isDiff = true;
  if (!lastSchemaData) {
    // 초기화
    const diff = await findDiff([], findedSchema);
    writeFiles(diff, findedSchema, filename)
  } else {
    const diff = await findDiff(lastSchemaData, findedSchema);
    // 이전 내용과 비교해 다를경우에만 새로 생성
    if (diff.length > 0) {
      writeFiles(diff, findedSchema, filename)
    } else {
      isDiff = false;
    }
  }
  return { filename, isDiff };
}

export default schemaTracker;