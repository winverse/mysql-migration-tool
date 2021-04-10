import { ConnectionConfig } from 'mysql';

export const isDev = process.env.NODE_ENV !== 'production';

export const DATABASE_NAME = 'linegames2';
export const META_DATABASE_NAME = `meta`;

const config: ConnectionConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: DATABASE_NAME,
}

export default config;