import { Factory, Faker } from "@mikro-orm/seeder";
import { Card, CardCategory } from "../../src/database/models/card.model";
import { EntityData } from "@mikro-orm/core";

export class CardFactory extends Factory<Card> {
  model = Card;

  protected definition(faker: Faker): EntityData<Card> {
    return {
      question: faker.helpers.unique(faker.lorem.sentence),
      answer: faker.lorem.sentence(),
      category: this.getRandomCategory(),
    };
  }

  private getRandomCategory(): CardCategory {
    const categories = Object.values(CardCategory);
    const randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
  }
}
