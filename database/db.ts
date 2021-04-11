import fs from 'fs';
import mysql, { Connection, ConnectionConfig } from 'mysql';
import configDir from '../lib/config-dir';
import writeConfig from '../lib/write-config';
import createMetaTable from './create-meta-table';

const configPath = `${configDir()}/config.json`;

if (!fs.existsSync(configPath)) {
  writeConfig();
}

const json = fs.readFileSync(`${configDir()}/config.json`, 'utf8');

const parseJSON =  JSON.parse(json);

export const DATABASE_NAME = process.argv[2] || parseJSON.database;
export const META_TABLE_NAME = 'meta';

const config: ConnectionConfig = { ...parseJSON };


const db: Connection = mysql.createConnection(config);

createMetaTable(db);

export default db;