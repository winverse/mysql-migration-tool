import customQuery from './custom-query';

async function queryDDL (tablename: string): Promise<string> {
  try {
    const ddl = await customQuery(`SHOW CREATE TABLE ${tablename}`);
    return ddl[0]['Create Table'];
  } catch (err) {
    return '';
  }
}

export default queryDDL;

