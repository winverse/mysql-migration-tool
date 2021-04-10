import fs from 'fs';
import path from 'path';

// schema 폴더 경로를 반환
function getSchemaDir () {
  const dirPath = path.resolve(__dirname, '../database/schema/');
  !fs.existsSync(dirPath) && fs.mkdirSync(dirPath);
  return dirPath;
}

export default getSchemaDir;