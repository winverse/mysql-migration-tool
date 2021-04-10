import db from '../db';

async function customQuery (sql: string): Promise<any> {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    })
  })
}

export default customQuery