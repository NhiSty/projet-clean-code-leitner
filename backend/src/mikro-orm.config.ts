import { defineConfig } from "@mikro-orm/sqlite";
import { Migrator } from "@mikro-orm/migrations";
import { Tag } from "./database/models/tag.model.js";
import { Migration20231220121911 } from "./migrations/Migration20231220121911.js";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { Card } from "./database/models/card.model.js";
import { User } from "./database/models/user.model.js";
import { UserCard } from "./database/models/userCard.model.js";

export default defineConfig({
  dbName: "tmp/db.sqlite",
  entities: [Tag, User, Card, UserCard],
  extensions: [Migrator],
  metadataProvider: TsMorphMetadataProvider,
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
