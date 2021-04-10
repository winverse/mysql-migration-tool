import fs from 'fs';
import schemaTracker from '../database/schema-tracker';

// 마이그레이션 파일 생성
async function generate () {
  let filename = '';
  try {
    const tracker = await schemaTracker();
    filename = tracker.filename;

    return tracker.isDiff;
  } catch (err) {
    if (filename) {
      fs.unlinkSync(`${filename}.json`);
    }
    throw new Error(err);
  }
}

// schema 생성
generate().then((isDiff) => {
  if (isDiff) {
    console.log(`Create new schema and migration files! 🎉`);
  } else {
    console.log('There was no difference... 🤔');
  }
  process.exit();
}).catch((err) => {
  throw new Error(err);
})


