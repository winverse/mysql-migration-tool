import fs from 'fs';
import getMigrationDir from '../lib/migration-dir';
import { DiffData } from '../types';
import { META_DATABASE_NAME, isDev } from './config';
import customQuery from './query/custom-query';

async function migrationRunner(databaseName: string): Promise<number> {
  const migrationDir = getMigrationDir();
  let queries: { query: string, filename: string }[] = []

  fs.readdirSync(migrationDir).map((file) => {
    let up;
    
    if (isDev) {
      up = require(`./migration/${file}`).default;
    } else {
      up = require(`./migration/${file}`);
    }
    up.map((diffContext: DiffData) => queries.push({ query: diffContext.query, filename: file }))
  })

  const filenames = await Promise.all(queries.map(async({ query, filename }) => {
    try {
      const alreadyRunMigation = await customQuery(`SELECT name FROM \`${databaseName}\`.\`${META_DATABASE_NAME}\` where name = '${filename}' LIMIT 1;`);
      if (alreadyRunMigation.length <= 0) {
        await customQuery(query.replace('DATABASE-NAME', databaseName));
        return filename;
      }
    } catch (err) {
      throw new Error(err);
    }
  }))

  // migration 기록
  const appliedFile = filenames.filter(Boolean);
  const appliedFileCount = appliedFile.length;
  if (appliedFileCount) {
    try {
      const uniqueFilenames = Array.from(new Set(appliedFile));
      await Promise.all(uniqueFilenames.map(async(filename) => {
        const query = `INSERT INTO \`${databaseName}\`.\`${META_DATABASE_NAME}\` 
          (name) VALUE ('${filename}');
        `;
        await customQuery(query);
        console.log(`filename: '${filename}' has been applied`);
      }));
    } catch (err) {
      throw new Error(err);
    }
  } else {
    console.log('All migration has already been applied');
  }

  return appliedFileCount;
}

export default migrationRunner;