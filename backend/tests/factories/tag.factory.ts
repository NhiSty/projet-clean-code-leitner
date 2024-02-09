import { Factory } from "@mikro-orm/seeder";
import { faker } from "@faker-js/faker/locale/en";
import { Tag } from "../../src/database/models/tag.model.js";

export class TagFactory extends Factory<Tag> {
  model = Tag;

  protected definition(): Partial<Tag> {
    return {
      id: faker.string.uuid(),
      name: faker.word.words(),
    };
  }
}
