import fs from 'fs';
import getMigrationDir from '../lib/migration-dir';
import { DiffData } from '../types';
import query from './query/query';
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
          const rawQuery = `INSERT INTO \`${this.databaseName}\`.\`${this.metaTableName}\` 
            (name) VALUE ('${filename}');
          `;
          await query(rawQuery);
          console.log(`filename: '${filename}' was recored`);
        }));
      } catch (err) {
        throw new Error(err as string);
      }
    } else {
      console.error('[FAIL] All migration has already been applied');
    }
    return appliedFileCount;
  }

  async migrationRunner(): Promise<number> {
    const migrationDir = getMigrationDir();
    let queries: { rawQuery: string, filename: string }[] = [];

    fs.readdirSync(migrationDir).map((file) => {
      let up;
      if (this.isDev) {
        up = require(`./migration/${file}`).default;
      } else {
        up = require(`./migration/${file}`);
      }
      up.map((diffContext: DiffData) => queries.push({ rawQuery: diffContext.query, filename: file }));
    })

    const filenames = await Promise.all(queries.map(async({ rawQuery, filename }) => {
      try {
        const alreadyRunMigation = await query(`SELECT name FROM \`${this.databaseName}\`.\`${this.metaTableName}\` where name = '${filename}' LIMIT 1;`);
        if (alreadyRunMigation.length <= 0) {
          await query(rawQuery.replace('DATABASE-NAME', this.databaseName));
          return filename;
        }
      } catch (err) {
        throw new Error(err as string);
      }
    }))

    // migration 기록
    const clean = filenames.filter(Boolean); 
    const appliedFileCount = await this.migrationRecord(clean as string[]);
    return appliedFileCount;
  }
}

export default MigrationRunner;