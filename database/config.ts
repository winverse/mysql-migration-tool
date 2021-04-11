import { ConnectionConfig } from 'mysql';

export const DATABASE_NAME = 'linegames';
export const META_TABLE_NAME = `meta`;

const config: ConnectionConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: DATABASE_NAME,
}

export default config;