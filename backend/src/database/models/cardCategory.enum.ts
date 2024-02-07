/**
 * CardCategory is an enum that represents the category of a card.
 */
export enum CardCategory {
  FIRST = "first",
  SECOND = "second",
  THIRD = "third",
  FOURTH = "fourth",
  FIFTH = "fifth",
  SIXTH = "sixth",
  SEVENTH = "seventh",
  DONE = "done",
}

export function getNextCategory(category: CardCategory): CardCategory {
  const values = Object.values(CardCategory);
  const index = values.indexOf(category);
  const clampedIndex = index + (1 % values.length);
  return values[clampedIndex];
}

export function getPreviousCategory(category: CardCategory): CardCategory {
  const values = Object.values(CardCategory);
  const index = values.indexOf(category);
  const clampedIndex = index - (1 % values.length);
  return values[clampedIndex];
}
