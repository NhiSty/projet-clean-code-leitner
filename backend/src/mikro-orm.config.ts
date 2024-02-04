import "dotenv/config";
import { defineConfig } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import { Tag } from "./database/models/tag.model.js";
import { Migration20231220121911 } from "./migrations/Migration20231220121911.js";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { Card } from "./database/models/card.model.js";
import { User } from "./database/models/user.model.js";
import { UserCard } from "./database/models/userCard.model.js";

export default defineConfig({
  dbName: process.env.DB_NAME,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
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
