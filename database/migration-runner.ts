import fs from 'fs';
import getMigrationDir from '../lib/migration-dir';
import { DiffData } from '../types';
import customQuery from './query/custom-query';

class MigrationRunner {
  private databaseName: string = '';
  private metaTableName: string = '';
  private isDev = process.env.NODE_ENV !== 'production';

  private constructor(databaseName: string, metaTableName: string) {
    this.databaseName = databaseName;
    this.metaTableName = metaTableName;
  }

  static setDatabaseName (databaseName: string, metaTableName: string) {
    return new MigrationRunner(databaseName, metaTableName);
  }

  private async migrationRecord (filenames: string[]): Promise<number> {
    const appliedFileCount = filenames.length;
    if (appliedFileCount) {
      try {
        const uniqueFilenames = Array.from(new Set(filenames));
        await Promise.all(uniqueFilenames.map(async(filename) => {
          const query = `INSERT INTO \`${this.databaseName}\`.\`${this.metaTableName}\` 
            (name) VALUE ('${filename}');
          `;
          await customQuery(query);
          console.log(`filename: '${filename}' was recored`);
        }));
      } catch (err) {
        throw new Error(err);
      }
    } else {
      console.error('[FAIL] All migration has already been applied');
    }
    return appliedFileCount;
  }

  async migrationRunner(): Promise<number> {
    const migrationDir = getMigrationDir();
    let queries: { query: string, filename: string }[] = [];

    fs.readdirSync(migrationDir).map((file) => {
      let up;
      if (this.isDev) {
        up = require(`./migration/${file}`).default;
      } else {
        up = require(`./migration/${file}`);
      }
      up.map((diffContext: DiffData) => queries.push({ query: diffContext.query, filename: file }));
    })

    const filenames = await Promise.all(queries.map(async({ query, filename }) => {
      try {
        const alreadyRunMigation = await customQuery(`SELECT name FROM \`${this.databaseName}\`.\`${this.metaTableName}\` where name = '${filename}' LIMIT 1;`);
        if (alreadyRunMigation.length <= 0) {
          await customQuery(query.replace('DATABASE-NAME', this.databaseName));
          return filename;
        }
      } catch (err) {
        throw new Error(err);
      }
    }))

    // migration 기록
    const clean = filenames.filter(Boolean); 
    const appliedFileCount = await this.migrationRecord(clean as string[]);
    return appliedFileCount;
  }
}

export default MigrationRunner;