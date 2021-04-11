import fs from 'fs';
import configDir from './config-dir';

async function writeConfig(database: string = 'linegames') {
  const configPath = `${configDir()}/config.json`;

  if (!fs.existsSync(configPath)) {
    throw new Error('Please create config file...!');
  }

  const json = fs.readFileSync(`${configDir()}/config.json`, 'utf8');

  const config =  JSON.parse(json);

  fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
}

export default writeConfig;