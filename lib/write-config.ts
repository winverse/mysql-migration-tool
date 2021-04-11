import fs from 'fs';
import configDir from './config-dir';

async function writeConfig(database: string = 'linegames') {
  let defaultConfig = {
    host: 'localhost',
    user: 'root',
    password: '1234',
  };
  
  const newConfig = { ...defaultConfig, database, };
  const configPath = `${configDir()}/config.json`;
  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 4), 'utf8');
}

export default writeConfig;