import query from './query/custom-query';

async function generateDDL (tablename: string): Promise<string> {
  try {
    const ddl = await query(`SHOW CREATE TABLE ${tablename}`);
    return ddl[0]['Create Table'];
  } catch (err) {
    return '';
  }
}

export default generateDDL;

