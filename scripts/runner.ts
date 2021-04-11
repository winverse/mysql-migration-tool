import MigrationRunner from '../database/migration-runner';
import { DATABASE_NAME, META_TABLE_NAME } from '../database/config';


async function runner() {
  try {
    const runner = MigrationRunner.setDatabaseName(DATABASE_NAME, META_TABLE_NAME); // 예시 5번

    const count = await runner.migrationRunner();
    
    return count;
  } catch (err) {
    throw new Error(err);
  }
}

runner().then((count) => {
  if (Number(count) > 0) {
    console.info('[SUCCESS] Migration was success!! 🎉');
  }
  process.exit();
}).catch((err) => {
  console.log(err);
  process.exit(1);
})