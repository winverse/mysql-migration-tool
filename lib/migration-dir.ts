import fs from 'fs';
import path from 'path';

// migration 폴더 경로를 반환
function migrationDir() {
  const dirPath = path.resolve(__dirname, '../database/migration/');
  !fs.existsSync(dirPath) && fs.mkdirSync(dirPath);
  return dirPath;
}

export default migrationDir;