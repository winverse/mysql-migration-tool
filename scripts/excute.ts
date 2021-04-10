import migrationRunner from '../database/migration-runner';
import { DATABASE_NAME } from '../database/config';


async function excute() {
  try {
    await migrationRunner(DATABASE_NAME); // 예시 5번
  } catch (err) {
    throw new Error(err);
  }
}

excute().then((count) => {
  if (Number(count) > 0) {
    console.log('Migration was success!!');
  }
  process.exit();
}).catch((err) => {
  console.log(err);
  process.exit(1);
})