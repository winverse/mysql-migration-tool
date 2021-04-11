import MigrationRunner from '../database/migration-runner';
import { META_TABLE_NAME } from '../database/db';
import cliPrompt from '../lib/cli-prompt';

async function runner() {
  let DATABASE_NAME: string = ''
  if (process.argv[2]) {
    DATABASE_NAME = process.argv[2];
  } else {
    DATABASE_NAME = await cliPrompt('Please write down the name of the DB to be applied: ');
  }

  try {
    const runner = MigrationRunner.setDatabaseName(DATABASE_NAME, META_TABLE_NAME); // 예시 5번
    const count = await runner.migrationRunner();
    return { dbName: DATABASE_NAME, count};
  } catch (err) {
    throw new Error(err);
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