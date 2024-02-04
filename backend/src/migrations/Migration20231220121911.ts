import { Migration } from "@mikro-orm/migrations";

export class Migration20231220121911 extends Migration {
  async up(): Promise<void> {
    // Tags table
    this.addSql(`
      create table "tag" (
          "id" integer not null primary key autoincrement,
          "name" varchar not null unique
      );
    `);

    // Card Table
    this.addSql(`
        create table "card" (
          "id" integer not null primary key autoincrement,
          "question" varchar not null unique,
          "answer" varchar not null,
          "category" varchar not null,
          "tagId" integer not null,
  
          FOREIGN KEY (tagId) REFERENCES tag(id)
        );
    `);

    // User Table
    this.addSql(`
      create table "user" (
        "id" integer not null primary key autoincrement,
        "username" varchar not null unique
      );
    `);
  }
}
