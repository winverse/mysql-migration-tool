import mysql, { Connection } from 'mysql';
import config, { DATABASE_NAME, META_TABLE_NAME } from './config';

const db: Connection = mysql.createConnection(config);

// 마이그레이션 기록 테이블
const query = `CREATE TABLE IF NOT EXISTS\`${DATABASE_NAME}\`.\`${META_TABLE_NAME}\` (
    \`id\` INT(11) NOT NULL AUTO_INCREMENT,
    \`name\` VARCHAR(20) NOT NULL,
    \`create_at\` TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (\`id\`)
  );`

// migration 기록
db.query(query, (err) => {
  if (err) throw new Error(err.sqlMessage);
})

export default db;