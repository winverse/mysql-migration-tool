import fs from 'fs';
import mysql, { Connection, ConnectionConfig } from 'mysql';
import configDir from '../lib/config-dir';
import writeConfig from '../lib/write-config';

const configPath = `${configDir()}/config.json`;

if (!fs.existsSync(configPath)) {
  writeConfig();
}

const json = fs.readFileSync(`${configDir()}/config.json`, 'utf8');

const parseJSON =  JSON.parse(json);

export const DATABASE_NAME = process.argv[2] || parseJSON.database;
export const META_TABLE_NAME = `meta`;

console.log('name', DATABASE_NAME);
console.log('meta', META_TABLE_NAME);

const config: ConnectionConfig = { ...parseJSON };

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