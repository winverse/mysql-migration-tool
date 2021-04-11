import { Connection } from 'mysql';
import { DATABASE_NAME, META_TABLE_NAME } from './db';

function createMetaTable (db: Connection) {
  const query = `CREATE TABLE IF NOT EXISTS\`${DATABASE_NAME}\`.\`${META_TABLE_NAME}\` (
    \`id\` INT(11) NOT NULL AUTO_INCREMENT,
    \`name\` VARCHAR(20) NOT NULL,
    \`create_at\` TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (\`id\`)
  );`

  db.query(query, (err) => {
    if (err) throw new Error(err.sqlMessage);
  })
}

export default createMetaTable;