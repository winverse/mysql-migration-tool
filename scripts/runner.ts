import MigrationRunner from '../database/migration-runner';
import { META_TABLE_NAME } from '../database/db';

// 마이그레이션 실행
async function runner() {
  let DATABASE_NAME: string = ''
  if (process.argv[2]) {
    DATABASE_NAME = process.argv[2];
  }

  if (!DATABASE_NAME) {
    throw new Error('Migration runner needs Database name');
  }

  try {
    const runner = MigrationRunner.setDatabaseName(DATABASE_NAME, META_TABLE_NAME); // 예시 5번
    const count = await runner.migrationRunner();
    return { dbName: DATABASE_NAME, count};
  } catch (err) {
    throw new Error(err as string);
  }
}

runner().then(({ count, dbName }) => {
  if (Number(count) > 0) {
    console.info(`[INFO] Migration was applied to database name: ${dbName}`);
    console.info('[SUCCESS] Migration was success!! 🎉');
  }
  process.exit();
}).catch((err) => {
  console.log(err);
  process.exit(1);
})