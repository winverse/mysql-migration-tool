import { SchemaDetail, ColumnDetail, DiffData } from '../../types';
import generateDDL from '../generate-ddl';

export async function dropTable (tableName: string) {
  const query = `DROP TABLE \`DATABASE-NAME\`.\`${tableName}\``;

  const data = {
    targetTable: tableName,
    type: 'dropTable',
    query,
    ddl: '',
  }
  return data;
}

export async function createTable (tableInfo: SchemaDetail): Promise<DiffData> {
  const { tableName } = tableInfo;
  let query = `CREATE TABLE IF NOT EXISTS \`DATABASE-NAME\`.\`${tableInfo.tableName}\` (\n`;

  tableInfo.columns.forEach((column) => {
    const { Field, Type, Null, Extra, Default } = column;
    query += `  \`${Field}\` ${Type.toUpperCase()} ${Null === 'NO' ? 'NOT NULL' : 'NULL'}${Default ? ` DEFAULT ${Default}` : ''}${Extra ? ' AUTO_INCREMENT' : ''},\n`;
  })

  const primaryKey = tableInfo.columns.find((column) => column.Key === 'PRI');
  const uniKey = tableInfo.columns.find((column) => column.Key === 'UNI');

  if (primaryKey) {
    query += `PRIMARY KEY(\`${primaryKey.Field}\`)`;
  }

  if (uniKey) {
    query += `${primaryKey ? ',' : ''}   UNIQUE KEY \`unique_item_name\` (\`${uniKey.Field}\`)`;
  }

  query += '\n';
  query += ')';

  const data = {
    targetTable: tableName,
    type: 'createTable',
    query, 
    ddl: await generateDDL(tableName)
  };
  return data
}

export async function addColumn(tableName: string, column: ColumnDetail): Promise<DiffData> {
  const { Field, Type, Null, Extra, Default } = column;
  const query =`ALTER TABLE \`DATABASE-NAME\`.\`${tableName}\`` +
    ` ADD COLUMN \`${Field}\` ${Type.toUpperCase()} ${Null === 'NO' ? 'NOT NULL' : 'NULL'}${Default ? ` DEFAULT ${Default}` : ''}${Extra ? ' AUTO_INCREMENT' : ''};`;
    
  const data = {
    targetTable: tableName,
    type: 'addColumn',
    query,
    ddl: await generateDDL(tableName)
  };

  return data;
}

export async function removeColumn(tableName: string, columnName: string): Promise<DiffData> {
  const query = `ALTER TABLE \`DATABASE-NAME\`.\`${tableName}\` drop ${columnName}`;

  const data = {
    targetTable: tableName,
    type: 'removeColumn',
    query,
    ddl: await generateDDL(tableName),
  }

  return data;
}

export async function changeColumn(tableName: string, column: ColumnDetail): Promise<DiffData> {
  const { Field, Type, Null, Extra, Default, Key } = column;

  const query = `ALTER TABLE \`DATABASE-NAME\`.\`${tableName}\` MODIFY \`${Field}\` ${Type.toUpperCase()} ${Null === 'NO' ? 'NOT NULL' : 'NULL'}${Default ? ` DEFAULT ${Default}` : ''}${Extra ? ' AUTO_INCREMENT' : ''}
    ${Key === 'PRI' ? `, ADD PRIMARY KEY(\`${Field}\`);` : Key === 'UNI' ? `, ADD UNIQUE INDEX \`unique_index_name\` (\`${Field}\`)` : ''}
  ;`;

  const data = {
    targetTable: tableName,
    type: 'changeColumn',
    query,
    ddl: await generateDDL(tableName),
  }

  return data;
}