import fs from 'fs';
import { DATABASE_NAME, META_TABLE_NAME } from '../database/config';
import schemaTracker from '../database/migration-generator';

// 마이그레이션 파일 생성
async function generator () {
  let filename = '';
  try {
    const tracker = schemaTracker.setDatabaseName(DATABASE_NAME, META_TABLE_NAME);

    const result = await tracker.schemaTracker();

    filename = result.filename;

    return result.isDiff;
  } catch (err) {
    if (filename) {
      fs.unlinkSync(`${filename}.json`);
    }
    throw new Error(err);
  }
}

generator().then((isDiff) => {
  if (isDiff) {
    console.info(`[SUCCESS] Create new schema and migration files! 🎉`);
  } else {
    console.warn('[FAIL] There was no difference... 🤔');
  }
  process.exit();
}).catch((err) => {
  throw new Error(err);
})


