import { Factory, Faker } from "@mikro-orm/seeder";
import { Tag } from "../../src/database/models/tag.model";

export class TagFactory extends Factory<Tag> {
  model = Tag;

  protected definition(faker: Faker): Partial<Tag> {
    return {
      name: faker.helpers.unique(faker.random.word),
    };
  }
}
