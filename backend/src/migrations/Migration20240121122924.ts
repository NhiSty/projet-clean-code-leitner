import { Migration } from "@mikro-orm/migrations";

export class Migration20240121122924 extends Migration {
  async up(): Promise<void> {
    // Create "quiz" and "card_quiz" tables
    this.addSql(`
      create table "quiz" (
        "id" uuid not null primary key,
        "user_id" uuid not null,
        "date" datetime not null,

        FOREIGN KEY (user_id) REFERENCES "user"(id),
        UNIQUE(user_id, date)
      );

      create table "card_quiz" (
        "card_id" uuid not null,
        "user_id" uuid not null,
        "date" datetime not null,

        FOREIGN KEY (card_id) REFERENCES card(id),
        FOREIGN KEY (user_id) REFERENCES user(id),
        UNIQUE(card_id, user_id, date)
      );
    `);
  }

  async down(): Promise<void> {}
}
