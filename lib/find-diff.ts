import { SchemaDetail, DiffData } from '../types';
import { addColumn, changeColumn, createTable, dropTable, removeColumn } from '../database/query/query-interface';

// 이전 스키마와 현재 스키마의 차이를 찾아내는 함수 입니다.
// CASE: createTable, dropTable, addColumn, removeColumn, changeColumn
async function findDiff (last:SchemaDetail[], present:SchemaDetail[]): Promise<DiffData[]>{
  const result: DiffData[] = [];

  const lastTables = last.map((table) => table.tableName); 
  const presentTables = present.map((table) => table.tableName); 

  // dropTable
  await Promise.all(lastTables.map(async(lastTable) => {
    if (!presentTables.includes(lastTable)) {
      await dropTable(lastTable).then((data) => result.push(data));
    }
  }))

  // createTable
  await Promise.all(presentTables.map(async(presentTable) => {
    if (!lastTables.includes(presentTable)) {
      await createTable(presentTable, present).then((data) => result.push(data));
    }
  }))
  
  await Promise.all(last.map(async (lastTable) => {
    const selectedTableFromPresent = present.find((presentTable) => presentTable.tableName === lastTable.tableName);

    // A table that used to be, but doesn't exist now
    if (!selectedTableFromPresent) return;
      
    const lastColumns = lastTable.columns.map((column) => column.Field);
    const presentColumns = selectedTableFromPresent.columns.map((column) => column.Field);
    
    const getColumnInfo = (columnName:string, type: 'last' | 'present') => {
      return type === 'present' ? 
        selectedTableFromPresent.columns.find((column) => column.Field === columnName)
        : lastTable.columns.find((column) => column.Field === columnName);
    }

    await Promise.all(lastColumns.map(async(field) => {
      const { tableName } = selectedTableFromPresent;
      // removeColumn
      if (!presentColumns.includes(field)) {
        await removeColumn(tableName, field).then((data) => result.push(data));
        return;
      } 

      // changeColumn
      const presentTableColumn = getColumnInfo(field, 'present');
      const lastTableColumn = getColumnInfo(field, 'last');

      if (!presentTableColumn || ! lastTableColumn) {
        throw new Error('Not exists column');
      }
      
      if (
        presentTableColumn.Type !== lastTableColumn.Type ||
        presentTableColumn.Null !== lastTableColumn.Null ||
        presentTableColumn.Key !== lastTableColumn.Key ||
        presentTableColumn.Default !== lastTableColumn.Default ||
        presentTableColumn.Extra !== lastTableColumn.Extra
      ) {
        await changeColumn(tableName, presentTableColumn).then((data) => result.push(data))
      }
    }));

    // addColumn
    await Promise.all(presentColumns.map(async (field) => {
      const { tableName } = selectedTableFromPresent;
      if (!lastColumns.includes(field)) {
        const info = getColumnInfo(field, 'present');
        if (!info) {
          throw new Error(`Not exists ${field} info in ${tableName} table`);
        }
        await addColumn(tableName, info).then((data) => result.push(data));
        return;
      }
    }));
  }));

  return result;
}

export default findDiff;