import { MikroORM } from "@mikro-orm/postgresql";
import { defineConfig } from "@mikro-orm/postgresql";
import { SeedManager } from "@mikro-orm/seeder";
import mikroOrmOption from "../../src/mikro-orm.config.js";

const config = defineConfig({
  ...mikroOrmOption,
  dbName: ":memory:",

  seeder: {
    path: "../seeders",
    pathTs: "../seeders",
    defaultSeeder: "DatabaseSeeder",
    glob: "!(*.d).{js,ts}",
    emit: "ts",
    fileName: (className: string) => className,
  },

  extensions: [SeedManager, ...mikroOrmOption.extensions!],
});

/**
 * Setup a test (in-memory) database connection
 * @returns a {@link MikroORM} instance
 */
export async function setupTestDb(): Promise<MikroORM> {
  const orm = await MikroORM.init(config);
  await orm.getMigrator().up();

  return orm;
}
