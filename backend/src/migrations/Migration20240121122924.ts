import { Migration } from "@mikro-orm/migrations";

export class Migration20240121122924 extends Migration {
  async up(): Promise<void> {
    // Create "quiz" and "quiz_cards" tables
    this.addSql(`
      create table "quiz" (
        "id" uuid not null primary key,
        "user_id" uuid not null,
        "date" date not null,

        FOREIGN KEY (user_id) REFERENCES "user"(id),
        UNIQUE(user_id, date)
      );

      create table "quiz_cards" (
        "card_id" uuid not null,
        "user_id" uuid not null,
        "quiz_id" uuid not null,
        "date" date not null,

        FOREIGN KEY (card_id) REFERENCES card(id),
        FOREIGN KEY (user_id) REFERENCES "user"(id),
        FOREIGN KEY (quiz_id) REFERENCES quiz(id),
        UNIQUE(card_id, quiz_id, user_id, date)
      );
    `);
  }

  async down(): Promise<void> {
    // Drop "quiz" and "quiz_cards" tables
    this.addSql(`
      drop table "quiz";
      drop table "quiz_cards";
    `);
  }
}
