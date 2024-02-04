import { EntityManager, MikroORM } from "@mikro-orm/core";
import { defineConfig } from "@mikro-orm/postgresql";
import { SeedManager } from "@mikro-orm/seeder";
import mikroOrmOption from "../../src/mikro-orm.config.js";

import { Migration20231220121911 } from "../../src/migrations/Migration20231220121911.js";
import { DatabaseSeeder } from "../seed/test.seeder.js";
import { container } from "../../src/utils/ioc.js";

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
