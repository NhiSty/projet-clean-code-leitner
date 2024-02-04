import { defineConfig } from "@mikro-orm/sqlite";
import { Migrator } from "@mikro-orm/migrations";
import { Card } from "./database/models/card.model.js";
import { Tag } from "./database/models/tag.model.js";
import { User } from "./database/models/user.model.js";
import logger from "./utils/logger.js";
import { Migration20231220121911 } from "./migrations/Migration20231220121911.js";

export default defineConfig({
  dbName: "tmp/db.sqlite",
  entities: [Tag, User, Card],
  extensions: [Migrator],
  schemaGenerator: {
    createForeignKeyConstraints: true,
  },

  migrations: {
    migrationsList: [
      {
        name: "Migration20231220121911.ts",
        class: Migration20231220121911,
      },
    ],
  },
});
