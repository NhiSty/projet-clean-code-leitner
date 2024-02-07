import { Migration } from "@mikro-orm/migrations";

export class Migration20231220121911 extends Migration {
  async up(): Promise<void> {
    // Create "tag", "card", "user" and "user_cards" tables
    this.addSql(`
      create table "tag" (
          "id" uuid not null primary key,
          "name" varchar not null unique
      );

      -- Card Table
      create table "card" (
        "id" uuid not null primary key,
        "question" varchar not null unique,
        "answer" varchar not null,
        "tag_id" uuid not null,

        FOREIGN KEY (tag_id) REFERENCES tag(id)
      );

      -- User Table
      create table "user" (
        "id" uuid not null primary key,
        "username" varchar not null unique
      );

      -- User Card Table
      create table "user_card" (
        "user_id" uuid not null,
        "card_id" uuid not null,
        "last_seen" date not null default NOW(),
        "category" varchar not null,

        FOREIGN KEY (user_id) REFERENCES "user"(id),
        FOREIGN KEY (card_id) REFERENCES card(id),
        UNIQUE(user_id, card_id)
      );
    `);
  }

  async down(): Promise<void> {
    // Drop tables
    this.addSql(`
      drop table if exists "user_card";
      drop table if exists "user";
      drop table if exists "card";
      drop table if exists "tag";
    `);
  }
}
