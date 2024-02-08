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

/**
 * Get the next card category from a specific category
 * @param category current category
 * @returns the next card category
 */
export function getNextCategory(category: CardCategory): CardCategory {
  const values = Object.values(CardCategory);
  const index = values.indexOf(category);
  const clampedIndex = index + (1 % values.length);
  return values[clampedIndex];
}
