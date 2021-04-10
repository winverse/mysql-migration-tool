import { SchemaDetail, ColumnDetail, DiffData } from '../../types';
import getDDL from './query-ddl';

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

export async function createTable (name: string, present: SchemaDetail[]): Promise<DiffData> {
  const tableInfo = present.find((table) => table.tableName === name);
  if (!tableInfo) {
    throw new Error('Not found table info');
  }

  let query = `CREATE TABLE IF NOT EXISTS \`DATABASE-NAME\`.\`${name}\` (\n`;

  tableInfo.columns.map((column) => {
    const { Field, Type, Null, Extra, Default, Key } = column;
    query += `  \`${Field}\` ${Type.toUpperCase()} ${Null === 'NO' ? 'NOT NULL' : 'NULL'}${Default ? ` DEFAULT ${Default}` : ''}${Extra ? ' AUTO_INCREMENT' : ''},\n`;
    if (Key) {
      return Field;
    }
  })

  const primaryKey = tableInfo.columns.find((column) => column.Key);

  if (primaryKey) {
    query += `  PRIMARY KEY(\`${primaryKey.Field}\`)\n`;
  }
  query += ')';

  const data = {
    targetTable: name,
    type: 'createTable',
    query, 
    ddl: await getDDL(name)
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
    ddl: await getDDL(tableName)
  };

  return data;
}

export async function removeColumn(tableName: string, columnName: string): Promise<DiffData> {
  const query = `ALTER TABLE \`DATABASE-NAME\`.\`${tableName}\` drop ${columnName}`;

  const data = {
    targetTable: tableName,
    type: 'removeColumn',
    query,
    ddl: await getDDL(tableName),
  }

  return data;
}

export async function changeColumn(tableName: string, column: ColumnDetail): Promise<DiffData> {
  const { Field, Type, Null, Extra, Default, Key } = column;
  const query = `ALTER TABLE \`DATABASE-NAME\`.\`${tableName}\` MODIFY \`${Field}\` ${Type.toUpperCase()} ${Null === 'NO' ? 'NOT NULL' : 'NULL'}${Default ? ` DEFAULT ${Default}` : ''}${Extra ? ' AUTO_INCREMENT' : ''},
    ${Key === 'PRI' ? `ADD PRIMARY KEY(\`${Field}\`);` : Key === 'UNI' ? `ADD UNIQUE INDEX \`unique_index_name\` (\`${Field}\`)` : ''}
  ;`;

  const data = {
    targetTable: tableName,
    type: 'changeColumn',
    query,
    ddl: await getDDL(tableName),
  }

  return data;
}