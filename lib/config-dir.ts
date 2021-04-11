import fs from 'fs';
import path from 'path';

// config.json 경로를 반환
function configDir() {
  const dirPath = path.resolve(__dirname, '../config/');
  !fs.existsSync(dirPath) && fs.mkdirSync(dirPath);
  return dirPath;
}

export default configDir;